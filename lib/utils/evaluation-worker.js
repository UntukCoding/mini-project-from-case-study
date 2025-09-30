import {configPrisma} from "../config/config-prisma.js";
import redisConnection from "../config/redis-connection.js";
import {Worker} from "bullmq";
import read_file_service from "../service/read_file_service.js";
import geminiPrompt from "../service/gemini-prompt_service.js";
import chromaDbService from "../service/qdrant-db-service.js";

const evalution_queue_name='evaluation'

const processor = async (job) => {
    const {jobId}=job.data
    console.log(`Processing job ${jobId}...`);
    try {
        const currentjobs=await configPrisma.evaluationjobs.update({
            where:{
                id:jobId
            },data:{
                status:'PROCESSING'
            },select:{
                cv_filepath:true,
                project_filepath:true
            }
        })
        console.log(currentjobs.cv_filepath)
        console.log(currentjobs.project_filepath)
        const cvtext=await read_file_service.parsedoc(currentjobs.cv_filepath)
        const projecttext=await read_file_service.parsedata(currentjobs.project_filepath)
        console.log(cvtext)
        console.log(projecttext)
        console.log(`[Job ${jobId}] Chain 1: Extracting CV data...`);
        const structcv=await geminiPrompt.extractdatafromcv(cvtext)

        console.log(`[Job ${jobId}] Chain 2: Scoring CV with RAG...`);
        const cvQuery = `Candidate skills: ${structcv.skills.join(', ')}. Experience: ${structcv.experience_years} years.`;

        const ragcontext=await chromaDbService.querycollect('job_description',cvQuery)
        const cvscore=await geminiPrompt.scoreCvWithRag(projecttext,ragcontext)
        console.log(`[Job ${jobId}] Chain 3: Scoring project with RAG...`);

        const projectragcontext=await chromaDbService.querycollect('scoring_rubric',projecttext)
        const projectscore=await geminiPrompt.scoreProjectWithRag(projecttext,projectragcontext)

        console.log(`[Job ${jobId}] Chain 4: Generating summary...`);
        const summarydata={
            ...cvscore,
            ...projectscore
        }
        const overallsummary=await geminiPrompt.generateOverallSummary(summarydata)

        const finalResult = {
            cv_match_rate: cvscore.cv_match_rate,
            cv_feedback: cvscore.cv_feedback,
            project_score: projectscore.project_score,
            project_feedback: projectscore.project_feedback,
            overall_summary: overallsummary,
        };
        await configPrisma.evaluationjobs.update({
            where:{
                id:jobId
            },data:{
                status:'COMPLETED',
                result:finalResult
            }
        })
        console.log(`Job ${jobId} completed successfully.`);

    }catch (e) {
        console.error(`Job ${jobId} failed:`, e);
        // Jika terjadi error, update status menjadi 'failed'
        await configPrisma.evaluationjobs.update({
            where: { id: jobId },
            data: {
                status: 'FAILED',
                error_message: e.message
            }
        });
        // Penting untuk melempar error agar BullMQ tahu job ini gagal
        throw e
    }
}
const initevalworker=new Worker(evalution_queue_name,processor,{
    connection:redisConnection.redisConnection,
})

console.log("Evaluation worker is listening for jobs...");

export default {
    initevalworker
}