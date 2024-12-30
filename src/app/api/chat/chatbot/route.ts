import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(message);

    if (!result.response) {
      return NextResponse.json(
        { error: 'Failed to generate response from the AI model' },
        { status: 500 }
      );
    }

    const reply = result.response.text();
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
