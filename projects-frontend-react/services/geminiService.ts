import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Project } from '../types';

const apiKey = process.env.API_KEY || '';

const getSystemInstruction = (projects: Project[]) => {
  const villages = Array.from(new Set(projects.map(p => p.village))).join(', ');
  // Limit projects in context to avoid token limits if too many, or summarize
  // For now, let's pass a simplified version of projects to save tokens
  const simplifiedProjects = projects.map(p => ({
    title: p.title,
    village: p.village,
    status: p.status,
    budget: p.budget,
    year: p.year
  }));

  return `
You are an intelligent digital assistant for the Neyveli Constituency Dashboard, representing MLA Mr. Saba Rajendran.
Your goal is to help citizens understand the developmental projects happening in their area.

Here is the context data you have access to:
Villages: ${villages}
Projects: ${JSON.stringify(simplifiedProjects)}

Guidelines:
1. Answer questions politely and professionally.
2. Use the provided project data to answer specific queries about budget, status, year, and location.
3. If a user asks about a village not in the list or a project not found, clearly state that you don't have that information currently.
4. Highlight the MLA's efforts in bringing these projects.
5. Keep answers concise but informative.
6. If asked about the MLA, he is Mr. Saba Rajendran, MLA of Neyveli Constituency.
`;
};

export const sendMessageToGemini = async (userMessage: string, projects: Project[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // We use the flash model for quick, responsive chat
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: getSystemInstruction(projects),
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};
