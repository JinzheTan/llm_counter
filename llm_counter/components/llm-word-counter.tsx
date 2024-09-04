'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Info } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type WordCount = {
  word: string;
  count: number;
}

export function LlmWordCounter() {
  const [text, setText] = useState('')
  const [topWords, setTopWords] = useState<WordCount[]>([])
  const [llmCounts, setLlmCounts] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const sampleOptions = ['ChatGPT', 'GPT4', 'Llama3.1']
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB']

  useEffect(() => {
    if (text) {
      countWords(text)
    }
  }, [text])

  const countWords = async (content: string) => {
    const response = await fetch('/api/count-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    });
    const data = await response.json();
    setTopWords(data.topWords);

    const llmResponse = await fetch('/api/llm-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content, words: data.topWords.map((w: WordCount) => w.word) }),
    });
    const llmData = await llmResponse.json();
    setLlmCounts(llmData.counts);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
      }
      reader.readAsText(file)
    }
  }
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const generateArticle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Generated Article:", data.article);
      console.log("Setting text:", data.article);
      setText(data.article);
      countWords(data.article);
    } catch (error) {
      console.error("Failed to generate article:", error);
      // You might want to set an error state here and display it to the user
    } finally {
      setIsLoading(false);
    }
  }

  const crawlArticle = async () => {
    try {
      const response = await fetch('/api/crawl-article');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setText(data.article);
      countWords(data.article);
    } catch (error) {
      console.error("Failed to crawl article:", error);
      // You might want to set an error state here and display it to the user
    }
  }

  const highlightWords = (content: string) => {
    let highlightedText = content
    topWords.forEach((word, index) => {
      const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, `<span style="background-color: ${colors[index]}">$&</span>`)
    })
    return highlightedText
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      countWords(text);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Can LLMs count words?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg mb-2">Try testing one of our sample texts:</p>
          <div className="flex flex-wrap gap-2">
            {sampleOptions.map((option) => (
              <Button key={option} variant="outline" className="rounded-full">
                {option}
              </Button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder="Paste your text here..."
          className="min-h-[200px] resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{text.split(/\s+/).filter(Boolean).length}/1,000 words</span>
        </div>
        {topWords.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top 10 Most Frequent Words</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Actual Count</TableHead>
                  <TableHead>LLM Count</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWords.map((word, index) => (
                  <TableRow key={word.word}>
                    <TableCell style={{ backgroundColor: colors[index] }}>{word.word}</TableCell>
                    <TableCell>{word.count}</TableCell>
                    <TableCell>{llmCounts[index]}</TableCell>
                    <TableCell>{word.count - llmCounts[index]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <h3 className="text-lg font-semibold mb-2">Highlighted Text</h3>
              <div
                className="border p-4 rounded-md max-h-60 overflow-auto"
                dangerouslySetInnerHTML={{ __html: highlightWords(text) }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="default" className="bg-black text-white hover:bg-gray-800" onClick={() => countWords(text)}>
            Count
          </Button>
          <Button onClick={generateArticle} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Random Article'}
          </Button>
          <Button onClick={crawlArticle}>Crawl Random Article</Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.doc,.docx,.pdf"
          />
          <Button variant="outline" onClick={triggerFileUpload} className="flex items-center gap-2">
            Upload file
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}