import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModelById } from '@/lib/models';

// 添加CORS头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // 检查请求体大小
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50000) { // 50KB 限制
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413, headers: corsHeaders }
      );
    }

    const { text, words, model } = await request.json();

    if (!text || !words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: text and words array are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 限制文本长度
    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 10,000 characters allowed.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 限制单词数量
    if (words.length > 20) {
      return NextResponse.json(
        { error: 'Too many words to count. Maximum 20 words allowed.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const modelConfig = getModelById(model);
    if (!modelConfig) {
      return NextResponse.json(
        { error: `Unsupported model: ${model}` },
        { status: 400, headers: corsHeaders }
      );
    }

    // 检查是否为OpenAI模型
    if (modelConfig.provider !== 'openai') {
      return NextResponse.json(
        { error: 'Only OpenAI models are currently supported' },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `Count the occurrences of the following words in the given text. Only return the counts as a comma-separated list of numbers.

Words: ${words.join(', ')}

Text: ${text}`;

    const { text: response } = await generateText({
      model: modelConfig.model,
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that counts word occurrences. Only return numbers separated by commas, no other text." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      maxTokens: 100,
      temperature: 0,
    });

    // Parse the response to extract counts
    if (!response) {
      throw new Error('No response received from model');
    }
    
    const countsString = response.trim();
    const counts = countsString.split(',').map(count => {
      const parsed = parseInt(count.trim(), 10);
      return isNaN(parsed) ? 0 : parsed;
    });

    // Ensure we have the same number of counts as words
    if (counts.length !== words.length) {
      console.warn(`Expected ${words.length} counts, got ${counts.length}. Response: ${countsString}`);
      // Pad with zeros or truncate as needed
      while (counts.length < words.length) {
        counts.push(0);
      }
      counts.splice(words.length);
    }

    return NextResponse.json({ counts }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error counting words with LLM:', error);
    
    // 根据错误类型返回不同的状态码
    let status = 500;
    let message = 'Failed to count words with LLM';
    
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
