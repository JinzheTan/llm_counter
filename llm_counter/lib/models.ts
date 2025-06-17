import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  model: any;
}

export const models: ModelConfig[] = [
  // OpenAI Models
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT 3.5 Turbo',
    provider: 'openai',
    model: openai('gpt-3.5-turbo')
  },
  {
    id: 'gpt-4',
    name: 'GPT 4',
    provider: 'openai',
    model: openai('gpt-4')
  },
  {
    id: 'gpt-4o',
    name: 'GPT 4o',
    provider: 'openai',
    model: openai('gpt-4o')
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT 4o Mini',
    provider: 'openai',
    model: openai('gpt-4o-mini')
  },
  // Anthropic Models
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    model: anthropic('claude-3-5-sonnet-20241022')
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    model: anthropic('claude-3-haiku-20240307')
  },
  // Google Models
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    model: google('gemini-1.5-pro')
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    model: google('gemini-1.5-flash')
  }
];

export function getModelById(id: string): ModelConfig | undefined {
  return models.find(model => model.id === id);
}

export function getModelsByProvider(provider: string): ModelConfig[] {
  return models.filter(model => model.provider === provider);
} 