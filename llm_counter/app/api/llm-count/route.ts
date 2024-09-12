import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { text, words, model } = await request.json();

  try {
    const completion = await openai.chat.completions.create({
      model: model, // 使用从前端传来的模型
      messages: [
        { role: "system", content: "You are a helpful assistant that counts word occurrences." },
        { role: "user", content: `Count the occurrences of the following words in the given text. Only return the counts as a comma-separated list of numbers.\n\nWords: ${words.join(', ')}\n\nText: ${text}` }
      ],
      max_tokens: 100,
    });

    const countsString = completion.choices[0].message.content;
    const counts = countsString.split(',').map(count => parseInt(count.trim(), 10));

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Error counting words with LLM:', error);
    return NextResponse.json({ error: 'Failed to count words with LLM' }, { status: 500 });
  }
}
