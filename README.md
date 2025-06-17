# LLM Word Counter

A comprehensive tool for testing the accuracy of Large Language Models (LLMs) in counting word occurrences within text.

## Overview

This project evaluates how well different AI models can perform the seemingly simple task of counting words. It supports multiple LLM providers and provides detailed analysis of counting accuracy.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, and Google models
- **Accuracy Analysis**: Compare LLM results with actual word counts
- **Visual Interface**: Color-coded highlighting and detailed tables
- **Multiple Input Methods**: Text input, file upload, and sample articles

## Quick Start

Navigate to the main application directory:

```bash
cd llm_counter
```

For detailed setup instructions, see the [complete documentation](./llm_counter/README.md).

## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **AI Integration**: Vercel AI SDK for unified model access
- **API**: Next.js API routes for backend functionality

## Results

The tool helps identify:
- Which models are most accurate at counting
- Common patterns in counting errors
- Performance differences across providers
- Model consistency across different text types

For full documentation and setup instructions, see [llm_counter/README.md](./llm_counter/README.md). 

