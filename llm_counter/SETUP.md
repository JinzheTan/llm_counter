# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory (`llm_counter/`) with the following structure:

```env
# OpenAI API Key (required for OpenAI models)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key (required for Claude models)  
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google API Key (required for Gemini models)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

## Getting API Keys

### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env.local` file

### Anthropic
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Go to "API Keys" section
4. Create a new key
5. Copy the key and add it to your `.env.local` file

### Google (Gemini)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

## Important Notes

- **Partial Setup**: You don't need all API keys. The application will only show models for which you have valid keys.
- **Security**: Never commit your `.env.local` file to version control. It's already in `.gitignore`.
- **Testing**: Start with one provider (e.g., OpenAI) and add others later.
- **Costs**: Be aware that API calls will incur costs. Start with small texts for testing.

## Troubleshooting

### Model Not Showing
- Check that your API key is correctly set in `.env.local`
- Restart the development server after adding new keys
- Ensure the key has the correct format and is active

### API Errors
- Verify your API key is valid and has sufficient credits
- Check that you have access to the specific model
- Some models may have usage restrictions or require special access

### Build Errors
- If you encounter permission issues during build, try running the development server instead
- Ensure all dependencies are installed with `npm install`

## Testing Your Setup

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. You should see model buttons for providers with valid API keys
4. Try generating a sample article first to test the setup
5. Test word counting with a short text

## Recommended First Test

1. Click "Generate Random Article" to create test content
2. Select a model you have an API key for
3. The system should automatically count words and show results
4. Compare LLM counts with actual counts in the table

If everything works correctly, you're ready to test different models and analyze their counting accuracy! 