import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
export const genAIModel = "gemini-2.0-flash";

export async function scanReceiptWithAI(imageBase64, mimeType, prompt) {
    try {
        if (!process.env.GOOGLE_AI_API_KEY) {
            console.error('GOOGLE_AI_API_KEY is not set in environment');
            return {
                success: false,
                error: 'Google AI API key not configured'
            };
        }
        
        const response = await genAI.models.generateContent({
            model: genAIModel,
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: imageBase64
                            }
                        }
                    ]
                }
            ],
            config: {
                temperature: 0,
                topP: 1,
                responseMimeType: "application/json",
            }
        });
        
        return {
            success: true,
            text: response.text,
            response: response
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            error: error.message || 'AI service unavailable'
        };
    }
}

export async function generateContent(prompt, modelName = genAIModel) {
    try {
        if (!process.env.GOOGLE_AI_API_KEY) {
            console.error('GOOGLE_AI_API_KEY is not set in environment');
            return {
                success: false,
                error: 'Google AI API key not configured'
            };
        }
        
        const response = await genAI.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        
        return {
            success: true,
            text: response.text,
            response: response
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            error: error.message || 'AI service unavailable'
        };
    }
}

export default genAI;