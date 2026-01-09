import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { message, language } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Construct the system prompt
        const systemPrompt = `You are an expert AI Legal Assistant for the "Online Police Assistance" system in Sri Lanka. 
    Your role is to provide accurate, helpful, and simplified legal information to citizens based on the **Laws of Sri Lanka**, specifically the **Penal Code of Sri Lanka** and other relevant Sri Lankan statutes.
    
    Guidelines:
    1. STRICTLY reference **Sri Lankan Law** (e.g., "Penal Code of Sri Lanka"). Do NOT reference Indian Law (IPC) or other jurisdictions.
    2. If the user asks in ${language}, you must REPLY IN ${language}.
    3. Be concise but informative. Explain legal concepts in simple terms.
    4. Provide specific section numbers and potential punishments where applicable.
    5. Always include a disclaimer that you are an AI and this is not professional legal advice.
    
    Current User Language Preference: ${language}
    `;

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate content
        // We prepend the system prompt to the user message as Gemini Pro doesn't strictly have a 'system' role in the same way as GPT yet (though system instructions are coming/beta). 
        // For robust compliance, we include it in the prompt.
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const reply = response.text();

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: `Gemini Error: ${error.message}` },
            { status: 500 }
        );
    }
}
