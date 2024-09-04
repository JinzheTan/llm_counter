import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates short articles." },
        { role: "user", content: "Generate a short article about a random topic." }
      ],
      max_tokens: 500,
    });

    const article = completion.choices[0].message.content;
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
  }
}
