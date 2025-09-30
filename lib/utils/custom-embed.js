
import {GoogleGenerativeAI} from "@google/generative-ai";

const genai=new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
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
const extractdatafromcv_test = async (cvtext) => {
    const prompt = `
    Extract the following information from the CV text provided below.
    Return the result as a single, minified JSON object. Do not include any text, explanation, or markdown formatting outside the JSON object.
    The JSON object should have these keys: "skills" (an array of strings), "experience_years" (a number), "project_summary" (a string summarizing key projects).

    CV Text:
    ---
    ${cvtext}
    ---
  `;
    const model = genai.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(prompt)

    return parseJsonFromLlMResponse(result.response.text());
};

export default {
    extractdatafromcv_test
}