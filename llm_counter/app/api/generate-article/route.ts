import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const articlesFilePath = path.join(process.cwd(), 'articles.json');

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates articles." },
        { role: "user", content: "Generate a random article with a title, body, and conclusion." }
      ],
      max_tokens: 1000,
    });

    const article = completion.choices[0].message.content;

    // Read existing articles
    let articles = [];
    try {
      const data = await fs.readFile(articlesFilePath, 'utf8');
      articles = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, start with an empty array
    }

    // Add new article
    articles.push({
      id: articles.length + 1,
      content: article,
      timestamp: new Date().toISOString()
    });

    // Write updated articles back to file
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 });
  }
}
