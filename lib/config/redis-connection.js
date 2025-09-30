import Redis from 'ioredis'
import Bullmq from 'bullmq'
import {loggerwinston} from "./loggerwinston.js";
const redisConnection=new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest:null
})

redisConnection.on("connect",() => {
    loggerwinston.info("redis connected")
})
redisConnection.on("error",error => {
    loggerwinston.error(error)

})
redisConnection.on("close",() => {
    loggerwinston.info("redis disconnected")
})
export default {
    redisConnection
}