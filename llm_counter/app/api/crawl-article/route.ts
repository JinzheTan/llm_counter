import { NextResponse } from 'next/server';

export async function GET() {
  const article = await crawlArticle();
  return NextResponse.json({ article });
}

async function crawlArticle(): Promise<string> {
  // This is a placeholder implementation. In a real-world scenario,
  // you would implement actual web crawling logic here.
  const dummyArticle = "This is a dummy article crawled from the web. It contains some random text to simulate a real article.";
  return dummyArticle;
}
