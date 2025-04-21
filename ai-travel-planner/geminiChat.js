
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY; // Make sure this is in your .env file

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "application/json",
};

async function generateTripPlan(prompt) {
  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    });
    const response = result.response;
    if (response.candidates && response.candidates.length > 0) {
      return response.candidates[0].content.parts[0].text;
    } else {
      console.error("No response from Gemini:", response);
      return null;
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export { generateTripPlan };