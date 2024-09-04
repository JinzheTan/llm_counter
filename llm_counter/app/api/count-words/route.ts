import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text } = await request.json();
  const wordCounts = countWords(text);
  const topWords = getTopWords(wordCounts, 10);
  return NextResponse.json({ topWords });
}

function countWords(text: string): Map<string, number> {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordCounts = new Map<string, number>();
  
  for (const word of words) {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }
  
  return wordCounts;
}

function getTopWords(wordCounts: Map<string, number>, count: number): { word: string; count: number }[] {
  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word, count]) => ({ word, count }));
}
