import { GoogleGenerativeAI } from "@google/generative-ai";

// Access the key safely from Vite's define or env
const API_KEY = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || ""; 

let model;

if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  // Cache the model instance
  model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
} else {
  console.warn("Gemini API Key is missing. AI features will return mock data.");
}

export const generateContent = async (prompt) => {
  if (!model) {
    // Fallback mock response if no API key is present
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`\`\`\`json
[
  {
    "original": "The Provider shall not be liable for any indirect, special, or consequential damages...",
    "suggestion": "The Provider shall remain liable for indirect damages resulting from gross negligence or willful misconduct.",
    "comment": "Standard liability caps shouldn't protect against negligence. This is a high-risk gap."
  },
  {
    "original": "This Agreement shall automatically renew for successive one (1) year terms...",
    "suggestion": "This Agreement shall renew only upon mutual written agreement of both parties.",
    "comment": "Auto-renewal is unfavorable for the Buyer. We want the option to renegotiate or exit annually."
  }
]
\`\`\``);
        }, 1500);
    });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};