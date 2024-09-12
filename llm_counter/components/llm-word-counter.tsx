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

const models = [
  { id: 'gpt-3.5-turbo', name: 'GPT 3.5' },
  { id: 'gpt-4', name: 'GPT 4' },
  { id: 'gpt-4o', name: 'GPT 4o' },
  { id: 'o1-preview', name: 'o1-preview' },
];

export function LlmWordCounter() {
  const [text, setText] = useState('')
  const [topWords, setTopWords] = useState<WordCount[]>([])
  const [llmCounts, setLlmCounts] = useState<number[]>([])
  const [wordsToCount, setWordsToCount] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0].id);

  
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB']

  useEffect(() => {
    if (text) {
      countWords(text)
    }
  }, [text])

  const countWords = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/llm-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          words: wordsToCount,
          model: selectedModel, // 添加选定的模型
        }),
      });
      const data = await response.json();
      setLlmCounts(data.counts);
    } catch (error) {
      console.error('Error counting words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        updateText(content)
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
      updateText(data.article);
      // 移除这行，因为 setText 现在会触发 useEffect 中的 countWords
      // countWords(data.article);
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
      updateText(data.article);
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

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    if (text) {
      countWords(text);
    }
  };

  const updateText = (newText: string) => {
    const words = newText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCounts = new Map<string, number>();
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
    const sortedWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    setWordsToCount(sortedWords);
    const newTopWords = sortedWords.map(word => ({ word, count: wordCounts.get(word) || 0 }));
    setTopWords(newTopWords);
    setLlmCounts(new Array(newTopWords.length).fill(0));
    setText(newText);
    if (newText) {
      countWords(newText);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Can LLMs count words?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg mb-2">Select a model:</p>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleModelChange(model.id)}
              >
                {model.name}
              </Button>
            ))}
          </div>
        </div>
        <Textarea
          placeholder="Paste your text here..."
          className="min-h-[200px] resize-none"
          value={text}
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{text.split(/\s+/).filter(Boolean).length}/1,000 words</span>
        </div>
        {topWords.length > 0 && llmCounts.length > 0 && llmCounts.length === topWords.length && (
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
                className="border p-4 rounded-md max-h-60 overflow-auto text-sm font-sans"
                style={{ fontFamily: 'inherit' }}
                dangerouslySetInnerHTML={{ __html: highlightWords(text) }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={generateArticle} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Random Article'}
          </Button>
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