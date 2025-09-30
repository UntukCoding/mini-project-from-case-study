import {Queue} from "bullmq";
import redisConnection from "./redis-connection.js";

const evalution_queue_name='evaluation'

const evaluation_queue=new Queue(evalution_queue_name,{
    connection:redisConnection.redisConnection
})
const addevaluationjob=async (data)=>{
    await evaluation_queue.add('process_evaluation',data,{
        attempts:2,
        backoff:{
            type:'exponential',
            delay:5000
        }
    })
}

export default {
    evaluation_queue,
    addevaluationjob
}