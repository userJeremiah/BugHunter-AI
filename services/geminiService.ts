import { GoogleGenAI } from "@google/genai";
import { toBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `You are Bug Hunter, an AI debugging assistant for developers.

Your task is to process screenshots of errors, stack traces, or UI bugs and help developers fix them.

Steps you must always follow:
1. Extract all relevant text from the uploaded image (such as console logs, stack traces, error messages, or code snippets visible in the screenshot). If no text is present, state that.
2. Identify the programming language, framework, or environment from the context when possible.
3. Provide a clear explanation of the issue in plain English.
4. Suggest actionable fixes.
   - If the error relates to application code, suggest code changes in the correct language/framework.
   - If the error relates to configuration or environment setup, suggest configuration or dependency fixes.
   - If the error relates to a UI screenshot, analyze the layout and recommend appropriate fixes (HTML, CSS, or framework-specific adjustments like React/Vue/Flutter).
5. Format your response in this way:
   - **Extracted Error/Context:** [paste extracted text here]
   - **Explanation:** [explain the root cause of the error]
   - **Suggested Fix:** [code snippets or steps to resolve the issue]

Analyze the following screenshot:`;


export const analyzeBugScreenshot = async (file: File): Promise<string> => {
  try {
    const base64Image = await toBase64(file);
    const imagePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Image,
      },
    };

    const textPart = {
      text: PROMPT,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [textPart, imagePart] },
    });

    if (!response.text) {
        throw new Error("API returned an empty response. This might be due to safety settings or an internal error.");
    }
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if(error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key. Please ensure your API_KEY is set correctly.");
        }
    }
    throw new Error("Failed to analyze the image with the AI model.");
  }
};