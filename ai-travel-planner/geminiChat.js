import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateTripPlan = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponseText = response.data.candidates[0].content.parts[0].text;
    console.log("--- Raw Gemini Response Text ---");
    console.log(rawResponseText); 

    const jsonMatch = rawResponseText.match(/```json\n([\s\S]*?)\n```/);
    let jsonString;

    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
      console.log("--- Extracted JSON (from ```json block) ---");
    } else {
      jsonString = rawResponseText;
      console.log("--- Extracted JSON (full raw text) ---");
    }

    jsonString = jsonString.trim();
    console.log(jsonString); 

    const parsedData = JSON.parse(jsonString);
    console.log("--- Successfully Parsed Data ---");
    console.log(parsedData); 

    return parsedData;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);

    if (error instanceof SyntaxError && jsonString) {
      console.error("Failed to parse JSON. String attempting to parse:", jsonString);
    } else if (rawResponseText) { 
        console.error("Failed to parse JSON. Raw response text was:", rawResponseText);
    } else {
        console.error("Failed to parse JSON. Raw response text was empty or not captured properly.");
    }
    return null;
  }
};