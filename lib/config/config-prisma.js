import {PrismaClient} from '../generated/prisma/client.js'
import {loggerwinston} from "./loggerwinston.js";
export const configPrisma= new PrismaClient({
    log:[
        {
            emit:'event',
            level:"query"
        },
        {
            emit:'event',
            level:"error"
        },
        {
            emit:'event',
            level:"info"
        },
        {
            emit:'event',
            level:"warn"
        },
    ]
})

configPrisma.$on('error', function (event) {
    loggerwinston.error(event)
})
configPrisma.$on('warn', function (event) {
    loggerwinston.warn(event)
})
configPrisma.$on('info', function (event) {
    loggerwinston.info(event)
})
configPrisma.$on('query', function (event) {
    loggerwinston.info(event)
})