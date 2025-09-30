import * as path from "node:path";
import supertest from 'supertest'
import {server} from "../config/server.js";
import {expect, jest, test} from '@jest/globals';
import bullmqconnect from "../config/bullmqconnect.js";
import redisConnection from "../config/redis-connection.js";
import fs2 from "node:fs";
import fs from "node:fs/promises";
import {configPrisma} from "../config/config-prisma.js";

jest.mock("../config/test_tanpa_jalankan_redis.js",()=>({
    evalqueue:{
        add: jest.fn(() => Promise.resolve({ id: "mock-job-id" }))
    },
    evalworker:{}
}))
describe('api end to flow', () => {
    it('should be upload video', async () => {
        // const __filename=url.fileURLToPath(import.meta.url)
        // const __dirname=path.dirname(__filename)
        const projectRoot = path.join(__dirname, '..');
        const filepath=path.join(projectRoot,'datadummy')
        const cvpath=path.join(filepath,'cv_1758902110388_230290553.pdf')
        const laporanproject=path.join(filepath,'project_report_1758903120168_909342810.pdf')
        const response=await supertest(server).post('/uploaddoc').attach('cv',cvpath).attach('project_report',laporanproject)
        console.log(response.body)
        expect(response.statusCode).toBe(201)
        expect(response.body.status).toBe('success')
        expect(response.body.message).toBe('Files uploaded successfully. Please proceed to evaluation.')
        expect(response.body.data).toHaveProperty('cvPath')
        expect(response.body.data).toHaveProperty('projectReportPath')
    });
    afterEach( async () => {
      await  redisConnection.redisConnection.disconnect()
    });
})

describe('should be get user', () => {
    let id
    it('should be define',async () => {
        const projectRoot = path.join(__dirname, '..');
        const filepath=path.join(projectRoot,'datadummy')
        const cvpath=path.join(filepath,'cv_1758902110388_230290553.pdf')
        const laporanproject=path.join(filepath,'project_report_1758903120168_909342810.pdf')
        const response=await supertest(server).post('/evaluatedoc').send({
            cvPath:cvpath,
            projectReportPath:laporanproject
        })
        id=response.body.id
        console.log(response.body)
        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('status')
    });
    afterEach(async () => {
        await configPrisma.evaluationjobs.delete({
            where:{
                id:id
            }
        })
        await redisConnection.redisConnection.disconnect()
    });
});

describe('should be get ', () => {
    let id
    beforeEach(async ()=> {
        const projectRoot = path.join(__dirname, '..');
        const filepath=path.join(projectRoot,'datadummy')
        const cvpath=path.join(filepath,'cv_1758902110388_230290553.pdf')
        const laporanproject=path.join(filepath,'project_report_1758903120168_909342810.pdf')
        const result=await configPrisma.evaluationjobs.create({
            data:{
                cv_filepath:cvpath,
                project_filepath:laporanproject,
                status:"QUEUED"
            },select:{
                id:true
            }
        })
        id=result.id
    })
    it('should be define get',async () => {
        const result=await supertest(server).get('/results').query({
            id:id
        })
        console.log(result.body)
        expect(result.statusCode).toBe(200)
        expect(result.body).toHaveProperty('id')
        expect(result.body).toHaveProperty('status')
    });
    afterEach(async () => {
        await configPrisma.evaluationjobs.delete({
            where:{
                id:id
            }
        })
        await redisConnection.redisConnection.disconnect()
    });
});
