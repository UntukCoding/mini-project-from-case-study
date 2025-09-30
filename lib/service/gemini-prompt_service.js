import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";


dotenv.config()
const genai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY
})

const parseJsonFromLlMResponse = (rawText) => {
    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (jsonMatch && jsonMatch[0]) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error(`Failed to parse JSON: ${e.message}. Raw text: ${rawText}`);
        }
    }
    throw new Error(`No valid JSON object found in the raw text: ${rawText}`);
}

const extractdatafromcv = async (cvtext) => {
    const prompt = `
    Extract the following information from the CV text provided below.
    Return the result as a single, minified JSON object. Do not include any text outside the JSON.
    The JSON object should have these keys: "skills" (an array of strings), "experience_years" (a number), "project_summary" (a string summarizing key projects).`;
    const result=await genai.models.generateContent({
        model:"gemini-2.5-pro",
        contents:{
            parts:[
                {
                    text:prompt
                },
                {
                    inlineData:{
                        mimeType:cvtext.mimetype,
                        data:cvtext.buffervalue
                    }
                }
            ]
        }
    })

    console.log(result.text)
    return parseJsonFromLlMResponse(result.text)
}
const scoreCvWithRag = async (structuredCv, ragContext) => {
    const prompt = `
    You are an expert HR analyst. Evaluate a candidate's CV based on their structured data and specific job requirements provided as context.
    Return the result as a single, minified JSON object with two keys: "cv_match_rate" (a number between 0.0 and 1.0) and "cv_feedback" (a brief string).

    Job Requirements Context:
    ---
    ${ragContext}
    ---

    Candidate's Structured CV Data:
    ---
    ${JSON.stringify(structuredCv)}
    ---
  `;
    const result = await genai.models.generateContent({
        model:"gemini-2.5-pro",
        contents:{
            parts:[
                {
                    text:prompt
                }
            ]
        }
    })
    console.log(result.text)
    return parseJsonFromLlMResponse(result.text)
};

const scoreProjectWithRag = async (projectText, ragContext) => {
    const prompt = `
    You are an expert technical lead. Evaluate a candidate's project report based on the provided text and a scoring rubric.
    Return the result as a single, minified JSON object with two keys: "project_score" (a number between 1.0 and 10.0) and "project_feedback" (a brief string).

    Scoring Rubric Context:
    ---
    ${ragContext}
    ---

    Candidate's Project Report Text:
    ---
    ${projectText}
    ---
  `;
    const result = await genai.models.generateContent({
        model: "gemini-2.5-pro",
        contents:{
            parts:[
                {
                    text:prompt
                },

            ]
        }
    })
    console.log(result.text)
    return parseJsonFromLlMResponse(result.text)
};

const generateOverallSummary = async (evaluationData) => {
    const prompt = `
    Based on the following evaluation data, write a concise overall summary (2-3 sentences) for the candidate.

    Evaluation Data:
    ---
    ${JSON.stringify(evaluationData, null, 2)}
    ---
  `;
    const result = await genai.models.generateContent({
        model: "gemini-2.5-pro",
        contents:{
            parts:[
                {
                    text:prompt
                }
            ]
        }
    })
    console.log(result.text)
    return result.text
};





export default {
    generateOverallSummary,
    extractdatafromcv,
    scoreProjectWithRag,
    scoreCvWithRag
}