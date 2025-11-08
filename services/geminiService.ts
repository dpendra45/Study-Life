import { GoogleGenAI, Type } from "@google/genai";
import { Category, Priority, Task } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const taskSuggestionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "The title of the task. Should be concise and actionable.",
        },
        description: {
          type: Type.STRING,
          description: "A brief, optional description of the task."
        },
        category: {
          type: Type.STRING,
          enum: Object.values(Category),
          description: "The category of the task.",
        },
        priority: {
            type: Type.STRING,
            enum: Object.values(Priority),
            description: "The priority level of the task.",
        },
      },
      required: ["title", "category", "priority"],
    },
};

export async function suggestTasks(): Promise<Omit<Task, 'id' | 'completed' | 'dueDate'>[]> {
  const prompt = `
    You are an AI assistant for a student planner app. 
    Your goal is to help students stay organized and productive.
    Suggest three distinct and useful tasks for a student for today.
    One task should be for 'Study', one for 'Health', and one 'Personal'.
    Provide a short, helpful description for each task.
    Assign a relevant priority to each.
    Provide the output in the specified JSON format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: taskSuggestionSchema,
      },
    });

    const jsonText = response.text;
    const suggestions = JSON.parse(jsonText);
    return suggestions;
  } catch (error) {
    console.error("Error generating task suggestions:", error);
    throw new Error("Failed to get suggestions from Gemini API.");
  }
}