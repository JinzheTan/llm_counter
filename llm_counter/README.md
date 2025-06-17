# LLM Word Counter

A Next.js application that tests the accuracy of Large Language Models (LLMs) in counting word occurrences within text. This tool helps researchers and developers understand how well different AI models perform at simple counting tasks.

## Features

🧠 **Multi-Model Support**: Test multiple LLM providers including:
- OpenAI (GPT-3.5, GPT-4, GPT-4o, o1-preview)
- Anthropic (Claude 3.5 Sonnet, Claude 3 Haiku)
- Google (Gemini 1.5 Pro, Gemini 1.5 Flash)

📊 **Comprehensive Analysis**: 
- Automatic extraction of top 10 most frequent words
- Side-by-side comparison of actual vs LLM counts
- Accuracy percentage calculations
- Visual highlighting of words in text

🎯 **Multiple Input Methods**:
- Direct text input
- File upload (.txt files)
- AI-generated sample articles
- Curated sample articles

📈 **Visual Results**:
- Color-coded word highlighting
- Detailed comparison tables
- Overall accuracy metrics

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for the LLM providers you want to test

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd llm_counter/llm_counter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your API keys:

```env
# OpenAI API Key (required for OpenAI models)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (required for Claude models)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google API Key (required for Gemini models)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

**Note**: You only need to provide API keys for the providers you want to use. Models will be automatically hidden if their API keys are not available.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Input Text**: Provide text through direct input, file upload, or generate sample articles
2. **Word Extraction**: The system automatically identifies the 10 most frequent words (excluding very short words)
3. **LLM Testing**: Selected language model counts occurrences of these words
4. **Comparison**: Results are compared with actual counts to show accuracy
5. **Visualization**: Words are highlighted in the text and results displayed in a table

## API Endpoints

- `POST /api/llm-count` - Count word occurrences using selected LLM
- `POST /api/generate-article` - Generate a random article using GPT-4o
- `GET /api/crawl-article` - Get a random sample article

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **AI Integration**: Vercel AI SDK for unified LLM access
- **UI Components**: Tailwind CSS with Radix UI components
- **Language**: TypeScript for type safety

## Key Improvements Made

✅ **Unified AI SDK**: Migrated from direct OpenAI integration to Vercel AI SDK for multi-provider support

✅ **Enhanced Error Handling**: Comprehensive error handling and user feedback

✅ **Better UX**: 
- Loading states
- Error messages
- Accuracy calculations
- Provider-grouped model selection

✅ **Improved Word Filtering**: Filters out very short words for more meaningful analysis

✅ **Sample Content**: Rich sample articles instead of placeholder text

✅ **Code Quality**: Removed unused Python backend files, improved TypeScript types

## Usage Tips

- **Text Length**: Works best with 100-1000 words for meaningful analysis
- **Word Selection**: The system automatically picks the most frequent words for testing
- **Model Comparison**: Try different models to see how counting accuracy varies
- **File Upload**: Only .txt files are supported for file uploads

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
