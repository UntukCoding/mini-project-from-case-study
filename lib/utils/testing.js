// import {GoogleGenAI} from "@google/genai"
//
// const ai = new GoogleGenAI({ apiKey: "AIzaSyCcr7z7DnWQihAUhtUYcjESNfxPfFd-dvk" });
//
// const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Write a story about a magic backpack.",
// });
// console.log(response.text);

import * as path from "node:path";
import fs from "node:fs/promises";
import fs2 from "node:fs";

import pdf from "pdf-parse-new";
import mammoth from "mammoth";
import read_file_service from "../service/read_file_service.js";
import {ChromaClient} from "chromadb";

import {GoogleGeminiEmbeddingFunction} from "@chroma-core/google-gemini";
import * as url from "node:url";
import {GoogleGenAI} from "@google/genai";
import {DefaultEmbeddingFunction} from "@chroma-core/default-embed";
import {GoogleEmbeddingFunction2} from "./embed_wor.js";
import {QdrantClient} from "@qdrant/js-client-rest";
import {v4 as uuidv4} from 'uuid'
import geminiPrompt from "../service/gemini-prompt_service.js";
import chromaDbService from "../service/qdrant-db-service.js";

// const filepath="/home/fahmi-lenovo-user/file_fahmi/nodejs/js/mini-project-rakamin/lib/public/uploads/cv_1758898378803_422194074.pdf"
// const hasil="public/uploads/cv_1758902110388_230290553.pdf"
// const pisahkan=hasil.split('/')
//
// const value=path.join(hasil)
// console.log("Does CV file exist?", fs2.existsSync(value));
// let file=await fs.readFile(value)
// console.log(result.text)
async function runTest() {
    try {
        const chrome=new ChromaClient({
            host:"localhost",
            port:8000
        })
        // const querycol={"skills":["Node.js (Express.js)","Python (Django)","RESTful APIs","Go","PostgreSQL","MongoDB","Redis","Elasticsearch","Google Cloud Platform (GCP)","Docker","Kubernetes","CI/CD (Jenkins, GitLab CI)","Terraform","Retrieval-Augmented Generation (RAG)","Vector Databases (ChromaDB, Pinecone)","Prompt Engineering","LLM Chaining","LangChain","TensorFlow","PyTorch","Microservices","Message Queues (Kafka, RabbitMQ)","Git","Agile/Scrum"],"experience_years":6,"project_summary":"Led the development of a Retrieval-Augmented Generation (RAG) pipeline for an internal search system, improving search relevance by 30% and reducing response time by 20%. Designed a high-traffic RESTful API in Node.js serving over 1 million daily requests. Developed an e-commerce backend with Python (Django), increasing sales conversion by 15%, and integrated Vector Databases for a product recommendation feature that boosted CTR by 25%. Also created a personal AI-powered CV analyzer using RAG and Gemini API."}
        // const cvQuery = `Candidate skills: ${querycol.skills.join(', ')}. Experience: ${querycol.experience_years} years.`;
        //
        // const googleembedfunction=new GoogleGeminiEmbeddingFunction({
        //     apiKey:"AIzaSyCcr7z7DnWQihAUhtUYcjESNfxPfFd-dvk",
        //     modelName:"gemini-embedding-001"
        // })
        // const collect=await chrome.getCollection({
        //     name:"job_description",
        //     embeddingFunction:googleembedfunction
        // })
        // const collek=await collect.query({
        //     queryTexts:[cvQuery],
        //     nResults:2
        // })
        // console.log(collek)
        // console.log(collect)
        // console.log("isi koleksi")


        const collect=await chrome.listCollections()
        console.log(collect)

        for (const collectKey of collect) {
            await chrome.deleteCollection({
                name:collectKey.name
            })
            console.log(`Deleted collection: ${collectKey.name}`);
        }
        // const __filename=url.fileURLToPath(import.meta.url)
        // const __dirname=path.dirname(__filename)
        // console.log(__dirname)
        // const projectRoot = path.join(__dirname, '..');
        // // 2. Buat path lengkap ke folder atau file yang dituju
        // const documentsPath = path.join(projectRoot, 'public', 'uploads');
        // const filePath = path.join(projectRoot, 'public', 'uploads', 'cv_1758902110388_230290553.pdf');
        // const filePath2 = path.join(projectRoot,'datadummy', 'cv_1758902110388_230290553.pdf');// Ganti dengan nama file
        // const hasil="datadummy/CV - Fahmi Rambu Zarate.pdf"
        // const pisahkan=hasil.split('/')
        // const renew=path.join(projectRoot,pisahkan[0],pisahkan[1])
        //
        // console.log('Skrip dijalankan dari:', __dirname);
        // console.log('Path ke root proyek:', projectRoot);
        // console.log('Path ke folder documents:', documentsPath);
        // console.log('Path ke file spesifik:', filePath2);
        // console.log(fs2.existsSync(renew))
        // console.log(fs2.existsSync(hasil))
        // const ext=path.extname(renew).toLowerCase()
        // if (ext==='.pdf'){
        //     const read=await fs.readFile(renew)
        //     const rawtext=await pdf(read)
        //
        //     console.log(rawtext.text)
        // }
    }catch (e) {
        console.log(e)
    }
}


async function checkCollection() {
    try {
        const client = new ChromaClient({
            host: "localhost",
            port: 8000,
        });
        const googleembedfunction=new GoogleGeminiEmbeddingFunction({
            apiKey:"AIzaSyCcr7z7DnWQihAUhtUYcjESNfxPfFd-dvk",
            modelName:"gemini-embedding-001"
        })
        console.log("Connecting to ChromaDB and checking collection...");
        const collection = await client.getCollection({ name: "job_description2",embeddingFunction:googleembedfunction });

        const count = await collection.count();
        console.log(`Collection 'job_description' has ${count} items.`);

        if (count > 0) {
            console.log("Peeking at the first few items...");
            const items = await collection.peek({ limit: 4 });
            console.log(items.embeddings);
        } else {
            console.error("\n>>> DIAGNOSIS: Database KOSONG. Jalankan ingest.js! <<<");
        }

    } catch (error) {
        console.error("\n>>> DIAGNOSIS: Gagal terhubung atau menemukan koleksi. Pastikan server ChromaDB berjalan dan Anda sudah pernah menjalankan ingest.js sebelumnya. <<<");
        console.error(error.message);
    }
}

async function adady(){
    try {
        const client = new ChromaClient({
            host: "localhost",
            port: 8000,
        });
        const genai = new GoogleGeminiEmbeddingFunction({
            apiKey:"AIzaSyBn-LdU30JwKSRwDfuHRK5EWeC8Z7RN3fk",
            modelName:"gemini-embedding-001"
        })
        const scoringRubricChunks = [
            "CV Evaluation - Technical Skills Match (Weight: 40%): Alignment with job requirements (backend, databases, APIs, cloud, AI/LLM). Score 5 for Excellent match + AI/LLM exposure.",
            "CV Evaluation - Experience Level (Weight: 25%): Years of experience and project complexity. Score 5 for 5+ yrs / high-impact projects.",
            "Project Deliverable - Correctness (Prompt & Chaining) (Weight: 30%): Implements prompt design, LLM chaining, RAG context injection. Score 5 for Fully correct + thoughtful implementation.",
            "Project Deliverable - Resilience & Error Handling (Weight: 20%): Handles long jobs, retries, randomness, API failures. Score 5 for Robust, production-ready handling."
        ];
        const vektor=[
            0.00047169198,  0.0032995353,   0.015264778,  -0.06435476, -0.0059019346,
            0.028473822,    0.01863364,   0.006227985, -0.011992476, -0.0073359255,
            -0.013832102,  -0.018739346, -0.0036124813,  0.045040596,   0.103968635,
            0.007724323,  -0.004258815,    0.00794412,  0.007114285, -0.0003300508,
            0.0056603844,  0.0091109425,    0.01334442, -0.029786237,  -0.009024311,
            -0.029962841,   0.025607055,   0.035472196,   0.04914291, -0.0004824399,
            -0.005794631,   0.010657696,   0.015152102,  0.021915227,   0.008860286,
            -0.0001750094,   0.016300797,  -0.008803812,   0.03325428, -0.0008385234,
            0.019570544,   0.018407214,  0.0026269015, -0.016239233,   -0.03688422,
            0.0022477645,  0.0055454876,    0.01963253, -0.020085363,   0.017919308,
            0.002452485,  0.0002111795,  -0.012214784,  -0.16056001,  -0.014807219,
            -0.008356359,  -0.013257815,   -0.00801365,  0.016587762,  -0.008379717,
            -0.02673458,   0.037503578,  -0.026149936, -0.011103386, -0.0010572511,
            -0.030600691,   0.003641113,  0.0038762887,  0.010252914,   -0.02286977,
            -0.0029445789, -0.0087133935,  -0.009622122,  -0.02337653,  0.0136861205,
            -0.007260325,  -0.008343302,  -0.021514213,  0.009686389,   0.002010703,
            0.011303816,  -0.018477216,  0.0029681074,  0.015535918,   0.018226115,
            -0.015135467,   0.003457564,   0.024630902,  0.025590334, -0.0028504827,
            0.019886944, -0.0016897034,   0.004079905,  0.021107707,  -0.016968634,
            -0.023247411,  -0.017106613,   0.003653407, 0.0017863258,  -0.010771239,
        ]

        const collection = await client.createCollection({name:"job_description3434"});
        await collection.add({
            ids:scoringRubricChunks.map((_, i) => `jd_${i + 1}`),
            embeddings:[vektor],
            documents:scoringRubricChunks,
        })
    }catch (e) {
        console.log(e)
    }
}
async function newtest(){
    try {
        const genai = new GoogleGenAI({
            apiKey:"AIzaSyDQLsUvJvfY98XsZXs3NtDe8Eq2eLjWXbw"
        })
        const scoringRubricChunks = [
            "CV Evaluation - Technical Skills Match (Weight: 40%): Alignment with job requirements (backend, databases, APIs, cloud, AI/LLM). Score 5 for Excellent match + AI/LLM exposure.",
            "CV Evaluation - Experience Level (Weight: 25%): Years of experience and project complexity. Score 5 for 5+ yrs / high-impact projects.",
            "Project Deliverable - Correctness (Prompt & Chaining) (Weight: 30%): Implements prompt design, LLM chaining, RAG context injection. Score 5 for Fully correct + thoughtful implementation.",
            "Project Deliverable - Resilience & Error Handling (Weight: 20%): Handles long jobs, retries, randomness, API failures. Score 5 for Robust, production-ready handling."
        ];
        const qdrantnew=new QdrantClient({
            host:'localhost',
            port:6333
        })
        await qdrantnew.createCollection("scoring_rubric",{
            vectors:{
                size:3072,
                distance:"Cosine"
            }
        })
        let point=[]
        const pointing=uuidv4()
        // for (let i=0; i<scoringRubricChunks.length; i++) {
        //     const text=scoringRubricChunks[i]
        //     const result=await genai.models.embedContent({
        //         model:"gemini-embedding-001",
        //         contents: { parts: [{ text }] },
        //     })
        //     const embedding=result.embeddings.map(value => value.values)
        //     console.log(result.embeddings)
        //     point.push({
        //         id: pointing,
        //         vector: embedding,
        //         payload: {
        //             document: text, // mirip "documents" di Chroma
        //             chunk_index: i,
        //             source: "scoring_rubric",
        //         },
        //     })
        // }

        for (let i=0;i<scoringRubricChunks.length; i++){
            const id = Math.floor(Math.random() * 1e12);
            const text=scoringRubricChunks[i]
            const result=await genai.models.embedContent({
                model:"gemini-embedding-001",
                contents:{
                    parts:[
                        {
                            text
                        }
                    ]
                }
            })
            const embedding=result.embeddings.map(value => value.values)
            const betul=embedding[0]
            console.log(embedding)
            point.push({
                id: id,
                vector:betul,
                payload:{
                    document:text
                }
            })
        }
        console.log(point)
        await qdrantnew.upsert('scoring_rubric',{
            points:point
        })
    }catch (e) {
        console.log(e)
    }
}

async function testsu(query){
    try {
        const genai = new GoogleGenAI({
            apiKey:"AIzaSyDQLsUvJvfY98XsZXs3NtDe8Eq2eLjWXbw"
        })
        const qdrantnew=new QdrantClient({
            host:'localhost',
            port:6333
        })
        // const result = await genai.models.embedContent({
        //     content: { parts: [{ text: querytext }] },
        // });
        //
        // const embedding = result.embedding.values;
        //
        // const search = await qdrantnew.search("cv_rubric", {
        //     vector: embedding,
        //     limit: 3,
        // });
        // const collect=await qdrantnew.scroll('scoring_rubric',{
        //     with_vector:true,
        //     with_payload:true
        // })
        // const result=collect.points.map(value => value.vector)
        // console.log(result)
        // const result=await genai.models.embedContent({
        //     model:'gemini-embedding-001',
        //     contents:{
        //         parts:[
        //             {
        //                 text:query
        //             }
        //         ]
        //     }
        // })
        // const embed=result.embeddings.map(value => value.values)
        // const search=await qdrantnew.search('scoring_rubric',{
        //     vector:embed[0]
        // })
        // const topK = search.sort((a,b) => b.score - a.score).slice(0, 3);
        // const filter=topK.map(value => value.payload.document).join("\n---\n")
        // const newrest=await geminiPrompt.scoreProjectWithRag(query,filter)
        // return newrest
        // const result=await qdrantnew.scroll('job_description',{
        //     with_payload:true,
        //     with_vector:true
        // })
        // console.log(result)
        const rawjson={"skills":["Node.js","Express.js","Python","Django","RESTful APIs","Go","PostgreSQL","MongoDB","Redis","Elasticsearch","Google Cloud Platform (GCP)","Docker","Kubernetes","CI/CD","Jenkins","GitLab CI","Terraform","Retrieval-Augmented Generation (RAG)","Vector Databases","ChromaDB","Pinecone","Prompt Engineering","LLM Chaining","LangChain","TensorFlow","PyTorch","Microservices","Message Queues","Kafka","RabbitMQ","Git","Agile/Scrum"],"experience_years":6,"project_summary":"Led the development of a Retrieval-Augmented Generation (RAG) pipeline for an internal search system, improving relevance by 30% and reducing response time by 20%. Designed and implemented high-performance RESTful APIs using Node.js serving over 1 million requests per day. Developed a backend module for an e-commerce platform using Python (Django) that increased sales conversion by 15%. Integrated Vector Databases for a product recommendation feature, which increased CTR by 25%. Built a personal AI-powered CV analyzer using RAG and Gemini API."}
        const cvQuery = `Candidate skills: ${rawjson.skills.join(', ')}. Experience: ${rawjson.experience_years} years.`;
        const collect=await chromaDbService.querycollect('job_description',cvQuery,2)

        return collect
    }catch (e) {
        console.log(e)
    }

}


const __filename=url.fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
console.log(__dirname)
const projectRoot = path.join(__dirname, '..');
// 2. Buat path lengkap ke folder atau file yang dituju
const filePath2 = path.join(projectRoot,'datadummy', 'project_report_1758903120168_909342810.pdf');

const reader=await fs.readFile(filePath2)
const result=await pdf(reader)
const search=await testsu(result.text)
console.log(search)

// console.log(search)
// adady()
// checkCollection()
// const result=await runTest()
// console.log(result)
//
// const genai = new GoogleGenAI({
//     apiKey:"AIzaSyAf0B7e1QAXvYXw89pmQOmA4O4jnsFDcKE",
// })
// const scoringRubricChunks = [
//     "CV Evaluation - Technical Skills Match (Weight: 40%): Alignment with job requirements (backend, databases, APIs, cloud, AI/LLM). Score 5 for Excellent match + AI/LLM exposure.",
//     "CV Evaluation - Experience Level (Weight: 25%): Years of experience and project complexity. Score 5 for 5+ yrs / high-impact projects.",
//     "Project Deliverable - Correctness (Prompt & Chaining) (Weight: 30%): Implements prompt design, LLM chaining, RAG context injection. Score 5 for Fully correct + thoughtful implementation.",
//     "Project Deliverable - Resilience & Error Handling (Weight: 20%): Handles long jobs, retries, randomness, API failures. Score 5 for Robust, production-ready handling."
// ];
// const result=await genai.models.embedContent({
//     model:"gemini-embedding-001",
//     contents:scoringRubricChunks
// })
//
// const result2=result.embeddings.map(value => value.values)
// console.log(result2)

