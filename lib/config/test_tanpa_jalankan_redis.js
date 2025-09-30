import Redis from 'ioredis'
import Bullmq from "bullmq";

const connect=new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest:null
})

connect.on("connect",() => {
    console.log("redis connected")
})
connect.on("error",error => {
    console.log(error)

})
connect.on("close",() => {
    console.log("redis disconnected")
})
const evaluasi=new Bullmq.Queue('evaluation',{
    connection:connect
})

const evalworker=new Bullmq.Worker('evaluation',async job => {
    console.log(`Processing job ${job.id}...`)
},{
    connection:connect
})
const evalqueue={
    add:jest.fn(()=>Promise.resolve({
        id:'mock-job-id'
    }))
}
export default {
    evalworker,
    evaluasi,
    evalqueue,
    connect
}

