import dotenv from 'dotenv'
import {GoogleGenAI} from "@google/genai";
import {QdrantClient} from "@qdrant/js-client-rest";
dotenv.config()

const genai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY
})
const qdrantnew=new QdrantClient({
    host:'localhost',
    port:6333
})

const jobDescriptionChunks = [
    "Product Engineer (Backend) 2025. Rakamin is hiring a Product Engineer (Backend) to work on Rakamin. We're looking for dedicated engineers who write code they're proud of and who are eager to keep scaling and improving complex systems, including those powered by Al.",
    "Technical Skills Requirement: Strong experience with backend languages and frameworks (Node.js, Django, Rails), Database management (MySQL, PostgreSQL, MongoDB), RESTful APIs, Security compliance, Cloud technologies (AWS, Google Cloud, Azure).",
    "AI/LLM Skills Requirement: Familiarity with LLM APIs, embeddings, vector databases and prompt design best practices. Experience implementing Retrieval-Augmented Generation (RAG) by embedding and retrieving context from vector databases.",
    "Responsibilities include building LLM chaining flows, where the output from one model is reliably passed to and enriched by another, and handling long-running Al processes gracefully - including job orchestration, async background workers, and retry mechanisms."
];

const scoringRubricChunks = [
    "CV Evaluation - Technical Skills Match (Weight: 40%): Alignment with job requirements (backend, databases, APIs, cloud, AI/LLM). Score 5 for Excellent match + AI/LLM exposure.",
    "CV Evaluation - Experience Level (Weight: 25%): Years of experience and project complexity. Score 5 for 5+ yrs / high-impact projects.",
    "Project Deliverable - Correctness (Prompt & Chaining) (Weight: 30%): Implements prompt design, LLM chaining, RAG context injection. Score 5 for Fully correct + thoughtful implementation.",
    "Project Deliverable - Resilience & Error Handling (Weight: 20%): Handles long jobs, retries, randomness, API failures. Score 5 for Robust, production-ready handling."
];

async function job_description_vektordb() {
    console.log("Starting data ingestion (Recommended Method)...");

    // 1. Ingest Job Description
    try {
        console.log("Creating embeddings for Job Description...");

        await qdrantnew.createCollection('job_description',{
            vectors:{
                size:3072,
                distance:'Cosine'
            }
        })
        let data=[]

        for (let i=0; i<jobDescriptionChunks.length; i++) {
            const id = Math.floor(Math.random() * 1e12);
            const text=jobDescriptionChunks[i]
            const result=await genai.models.embedContent({
                model:'gemini-embedding-001',
                contents:{
                    parts:[
                        {
                            text
                        }
                    ]
                }
            })
            const embedding=result.embeddings.map(value => value.values)
            const listvector=embedding[0]
            data.push({
                id:id,
                vector:listvector,
                payload:{
                    document:text
                }
            })
        }
        await qdrantnew.upsert('job_description',{
            points:data
        })
        console.log("Data ingestion complete.");
    }catch (e) {
        console.error("\nData ingestion failed:", e);
        process.exit(1);
    }
}

async function scoring_rubric_vectordb(){
    try {
        console.log("Creating embeddings for Scoring Rubric...");
        await qdrantnew.createCollection('scoring_rubric',{
            vectors:{
                size:3072,
                distance:'Cosine'
            }
        })
        let data=[]

        for (let i=0; i<scoringRubricChunks.length; i++) {
            const id = Math.floor(Math.random() * 1e12);
            const text=scoringRubricChunks[i]
            const result=await genai.models.embedContent({
                model:'gemini-embedding-001',
                contents:{
                    parts:[
                        {
                            text
                        }
                    ]
                }
            })
            const embedding=result.embeddings.map(value => value.values)
            const listvector=embedding[0]
            data.push({
                id:id,
                vector:listvector,
                payload:{
                    document:text
                }
            })
        }
        await qdrantnew.upsert('scoring_rubric',{
            points:data
        })
        console.log("Data ingestion complete.");
    }catch (e) {
        console.log("\nData ingestion failed:", e);
    }
}

job_description_vektordb().catch(console.error)
scoring_rubric_vectordb().catch(console.error)