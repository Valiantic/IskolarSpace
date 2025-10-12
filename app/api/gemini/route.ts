import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const { prompt } = await req.json();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

        const result = await model.generateContent(prompt);
        const plan = result.response.text();

        return NextResponse.json({ plan });
    } catch(error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}