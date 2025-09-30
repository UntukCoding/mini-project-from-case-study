import {ChromaClient} from "chromadb";
import {GoogleGeminiEmbeddingFunction} from "@chroma-core/google-gemini";
import dotenv from "dotenv";
import {GoogleGenAI} from "@google/genai";
import {QdrantClient} from "@qdrant/js-client-rest";

dotenv.config()

const genai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY
})

const qdrant=new QdrantClient({
    host:"localhost",
    port:6333
})

const querycollect = async (collectname,query,nresult=2) => {
    const resultfromgemini=await genai.models.embedContent({
        model:'gemini-embedding-001',
        contents:{
            parts:[
                {
                    text:query
                }
            ]
        }
    })
    const listvector=resultfromgemini.embeddings.map(value => value.values)
    const search=await qdrant.search(collectname,{
        vector:listvector[0]
    })
    const topK = search.sort((a,b) => b.score - a.score).slice(0, nresult);
    return topK.map(value => value.payload.document).join("\n---\n")
}

export default {
    querycollect
}