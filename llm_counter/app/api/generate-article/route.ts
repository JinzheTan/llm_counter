import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const articlesFilePath = path.join(process.cwd(), 'articles.json');

// 添加CORS头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST() {
  try {
    const { text: article } = await generateText({
      model: openai('gpt-4o-mini'), // 使用更便宜的模型
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that generates interesting articles with varied vocabulary." 
        },
        { 
          role: "user", 
          content: "Generate a random article (100-200 words) about any interesting topic. Include a title, body, and conclusion. Make sure to use diverse vocabulary and repeat some words naturally." 
        }
      ],
      maxTokens: 800,
      temperature: 0.7,
    });

    if (!article) {
      throw new Error('No article generated');
    }

    // 在 Vercel 上不存储文件，直接返回
    return NextResponse.json({ article }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error generating article:', error);
    
    let status = 500;
    let message = 'Failed to generate article';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        status = 401;
        message = 'Invalid API key';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        status = 429;
        message = 'API rate limit exceeded';
      } else if (error.message.includes('timeout')) {
        status = 408;
        message = 'Request timeout';
      }
    }
    
    return NextResponse.json(
      { error: message },
      { status, headers: corsHeaders }
    );
  }
}
