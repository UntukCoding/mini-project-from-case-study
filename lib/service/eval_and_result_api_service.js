import {validation} from "../validation/validation.js";
import evaluationmodel from "../model/evaluationmodel.js";
import {configPrisma} from "../config/config-prisma.js";
import bullmqconnect from "../config/bullmqconnect.js";
import {Handlinerror} from "../handling/handlinerror.js";

const createeval1_service =async (request) => {
    console.log(request)
    const validate=validation(evaluationmodel.createevaluationmodel,request)
    console.log(validate)
    const newjob=await configPrisma.evaluationjobs.create({
        data:{
            cv_filepath:validate.cvPath,
            project_filepath:validate.projectReportPath,
            status:"QUEUED"
        },select:{
            id:true,
            status:true
        }
    })

    await bullmqconnect.addevaluationjob({
        jobId:newjob.id
    })
    return {
        id:newjob.id,
        status:newjob.status
    }
}
const getresult_service =async (request) => {
    console.log(request)
    const validate=validation(evaluationmodel.getresultmodel,request)
    console.log(validate)
    const result=await configPrisma.evaluationjobs.findUnique({
        where:{
            id:validate
        },select:{
            id:true,
            status:true,
            result:true,
        }
    })
    if(!result){
        throw new Handlinerror(401,'Evaluation Job Not Found')
    }
    const response={
        id:result.id,
        status:result.status,
    }
    if (result.status==='COMPLETED'){
        response.result=result.result
    }
    if (result.status === 'FAILED') {
        response.error = result.error_message;
    }
    console.log(result)
    return response
}

export default {
    getresult_service,
    createeval1_service
}