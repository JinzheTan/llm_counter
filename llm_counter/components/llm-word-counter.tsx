'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Info, AlertCircle, Zap } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { models } from '@/lib/models'

type WordCount = {
  word: string;
  count: number;
}

// 只显示 OpenAI 模型
const openaiModels = models.filter(model => model.provider === 'openai');

export function LlmWordCounter() {
  const [text, setText] = useState('')
  const [topWords, setTopWords] = useState<WordCount[]>([])
  const [llmCounts, setLlmCounts] = useState<number[]>([])
  const [wordsToCount, setWordsToCount] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(openaiModels[0]?.id || 'gpt-3.5-turbo');
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [lastCountTime, setLastCountTime] = useState<number>(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // 更优美的色调 - 使用柔和的渐变色系
  const colors = [
    '#FF6B6B', // 柔和红色
    '#4ECDC4', // 青绿色
    '#45B7D1', // 天蓝色
    '#96CEB4', // 薄荷绿
    '#FECA57', // 温暖黄色
    '#FF9FF3', // 粉紫色
    '#54A0FF', // 明亮蓝
    '#5F27CD', // 深紫色
    '#00D2D3', // 青色
    '#FF9F43'  // 橙色
  ];

  useEffect(() => {
    // 检查使用次数限制
    checkUsageLimit();
  }, []);

  const checkUsageLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('llm_counter_usage');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setUsageCount(count);
      } else {
        // 新的一天，重置计数
        localStorage.setItem('llm_counter_usage', JSON.stringify({ date: today, count: 0 }));
        setUsageCount(0);
      }
    } else {
      localStorage.setItem('llm_counter_usage', JSON.stringify({ date: today, count: 0 }));
      setUsageCount(0);
    }
  };

  const incrementUsageCount = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    localStorage.setItem('llm_counter_usage', JSON.stringify({ date: today, count: newCount }));
    setUsageCount(newCount);
  };

  const countWords = async (text: string) => {
    if (!wordsToCount.length) return;
    
    // 检查使用次数限制
    if (usageCount >= 100) {
      setError('Daily usage limit reached (100 requests per day). Please try again tomorrow.');
      return;
    }

    // 防止频繁调用
    const now = Date.now();
    if (now - lastCountTime < 3000) { // 增加到3秒防止频繁调用
      return;
    }
    setLastCountTime(now);
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/llm-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          words: wordsToCount,
          model: selectedModel,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLlmCounts(data.counts);
      setHasAnalyzed(true);
      incrementUsageCount();
    } catch (error) {
      console.error('Error counting words:', error);
      setError(error instanceof Error ? error.message : 'Failed to count words');
      setLlmCounts(new Array(wordsToCount.length).fill(0));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        setError('Please upload a text file (.txt)');
        return;
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        updateText(content)
      }
      reader.onerror = () => {
        setError('Failed to read file');
      }
      reader.readAsText(file)
    }
  }
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const generateArticle = async () => {
    if (usageCount >= 100) {
      setError('Daily usage limit reached (100 requests per day). Please try again tomorrow.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Generated Article:", data.article);
      updateText(data.article);
      incrementUsageCount();
    } catch (error) {
      console.error("Failed to generate article:", error);
      setError(error instanceof Error ? error.message : 'Failed to generate article');
    } finally {
      setIsLoading(false);
    }
  }

  const crawlArticle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/crawl-article');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      updateText(data.article);
    } catch (error) {
      console.error("Failed to crawl article:", error);
      setError(error instanceof Error ? error.message : 'Failed to crawl article');
    } finally {
      setIsLoading(false);
    }
  }

  const highlightWords = (content: string) => {
    let highlightedText = content
    topWords.forEach((word, index) => {
      const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, `<span style="background-color: ${colors[index]}; color: white; padding: 1px 3px; border-radius: 3px; font-weight: 500;">$&</span>`)
    })
    return highlightedText
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // 如果有文本和关键词，触发分析
      if (text && wordsToCount.length > 0) {
        handleAnalyze();
      }
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setError(null);
    // 模型改变时重置分析状态
    setHasAnalyzed(false);
    setLlmCounts(new Array(topWords.length).fill(0));
  };

  const updateText = (newText: string) => {
    const words = newText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCounts = new Map<string, number>();
    for (const word of words) {
      if (word.length > 2) { // Filter out very short words
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
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
    setError(null);
    setHasAnalyzed(false); // 重置分析状态
  };

  const calculateAccuracy = () => {
    if (topWords.length === 0 || llmCounts.length === 0) return 0;
    let totalDifference = 0;
    let totalActual = 0;
    
    for (let i = 0; i < topWords.length; i++) {
      totalDifference += Math.abs(topWords[i].count - (llmCounts[i] || 0));
      totalActual += topWords[i].count;
    }
    
    return totalActual > 0 ? Math.max(0, (1 - totalDifference / totalActual) * 100) : 0;
  };

  // 手动触发分析
  const handleAnalyze = () => {
    if (text && wordsToCount.length > 0) {
      countWords(text);
    }
  };

  // 判断是否显示分析按钮
  const showAnalyzeButton = text.trim().length > 0 && wordsToCount.length > 0;

  return (
    <Card className="w-full max-w-5xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Can LLMs count words?</CardTitle>
        <p className="text-muted-foreground">
          Test how accurately OpenAI models can count word occurrences in text. Enter your text and click "Analyze with AI" to start.
        </p>
        <div className="text-sm text-muted-foreground">
          Daily usage: {usageCount}/100 requests
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <div>
          <p className="text-lg mb-4">Select an OpenAI model:</p>
          <div className="flex flex-wrap gap-2">
            {openaiModels.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleModelChange(model.id)}
                disabled={isLoading || usageCount >= 100}
              >
                {model.name}
              </Button>
            ))}
          </div>
        </div>
        
        <Textarea
          placeholder="Paste your text here, then click 'Analyze with AI' to test the model's counting accuracy..."
          className="min-h-[200px] resize-none"
          value={text}
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{text.split(/\s+/).filter(Boolean).length}/1,000 words</span>
          {hasAnalyzed && topWords.length > 0 && llmCounts.length > 0 && (
            <span>Accuracy: {calculateAccuracy().toFixed(1)}%</span>
          )}
        </div>
        
        {hasAnalyzed && topWords.length > 0 && llmCounts.length > 0 && llmCounts.length === topWords.length && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top 10 Most Frequent Words</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Actual Count</TableHead>
                  <TableHead>LLM Count</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWords.map((word, index) => {
                  const llmCount = llmCounts[index] || 0;
                  const difference = word.count - llmCount;
                  const accuracy = word.count > 0 ? Math.max(0, (1 - Math.abs(difference) / word.count) * 100) : 100;
                  
                  return (
                    <TableRow key={word.word}>
                      <TableCell>
                        <span 
                          style={{ 
                            backgroundColor: colors[index], 
                            color: 'white', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          {word.word}
                        </span>
                      </TableCell>
                      <TableCell>{word.count}</TableCell>
                      <TableCell>{llmCount}</TableCell>
                      <TableCell className={difference === 0 ? 'text-green-600' : difference > 0 ? 'text-red-600' : 'text-blue-600'}>
                        {difference > 0 ? `+${difference}` : difference}
                      </TableCell>
                      <TableCell>{accuracy.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div>
              <h3 className="text-lg font-semibold mb-2">Highlighted Text</h3>
              <div
                className="border p-4 rounded-md max-h-60 overflow-auto text-sm font-sans leading-relaxed"
                style={{ fontFamily: 'inherit' }}
                dangerouslySetInnerHTML={{ __html: highlightWords(text) }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {showAnalyzeButton ? (
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || usageCount >= 100}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          ) : (
            <Button onClick={generateArticle} disabled={isLoading || usageCount >= 100}>
              {isLoading ? 'Generating...' : 'Generate Random Article'}
            </Button>
          )}
          <Button onClick={crawlArticle} disabled={isLoading} variant="outline">
            {isLoading ? 'Loading...' : 'Load Sample Article'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt"
          />
          <Button variant="outline" onClick={triggerFileUpload} className="flex items-center gap-2" disabled={isLoading}>
            Upload text file
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}