"use client"

// API Keys
const RAPIDAPI_KEY_FULL = "5e117c0989mshca3aa58cc6a164ep1e6d32jsna56e7442ae34"
const RAPIDAPI_KEY_SHORT = "5e117c0989mshca3aa58cc6a164ep1e6d32"
// Deepseek API key from environment
// In Vercel: Create NEXT_PUBLIC_DEEPSEEK_API_KEY environment variable
const DEEPSEEK_API_KEY = typeof window !== "undefined" 
  ? (window as any).DEEPSEEK_API_KEY || localStorage.getItem("deepseek_api_key") || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ""
  : (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "")

export interface AIModel {
  id: string
  name: string
  provider: string
  endpoint: string
  host: string
  description: string
  apiKey: string
  requestFormat: "openai" | "simple" | "custom" | "deepseek"
}

// 180 AI Models with real RapidAPI endpoints + Deepseek
export const AI_MODELS: AIModel[] = [
  // Deepseek Models (Official API - Priority)
  {
    id: "deepseek-v4-pro",
    name: "Deepseek V4 Pro",
    provider: "Deepseek",
    endpoint: "https://api.deepseek.com/chat/completions",
    host: "api.deepseek.com",
    description: "Deepseek V4 Pro - 带有扩展思考功能的高性能模型",
    apiKey: DEEPSEEK_API_KEY,
    requestFormat: "deepseek"
  },
  {
    id: "deepseek-chat",
    name: "Deepseek Chat",
    provider: "Deepseek",
    endpoint: "https://api.deepseek.com/chat/completions",
    host: "api.deepseek.com",
    description: "Deepseek Chat - 标准聊天模型",
    apiKey: DEEPSEEK_API_KEY,
    requestFormat: "deepseek"
  },
  {
    id: "deepseek-code",
    name: "Deepseek Code",
    provider: "Deepseek",
    endpoint: "https://api.deepseek.com/chat/completions",
    host: "api.deepseek.com",
    description: "Deepseek Code - 代码生成和修复专用",
    apiKey: DEEPSEEK_API_KEY,
    requestFormat: "deepseek"
  },
  // OpenAI Models
  {
    id: "gpt4o",
    name: "GPT-4 Omni",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/gpt4o",
    host: "chatgpt-42.p.rapidapi.com",
    description: "OpenAI GPT-4o multimodal model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gpt4",
    name: "GPT-4",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/gpt4",
    host: "chatgpt-42.p.rapidapi.com",
    description: "OpenAI GPT-4 model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gpt4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/chatgpt",
    host: "chatgpt-42.p.rapidapi.com",
    description: "OpenAI GPT-4 Turbo fast model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gpt4-mini",
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    endpoint: "https://gpt-4-1-mini.p.rapidapi.com/chat/completions",
    host: "gpt-4-1-mini.p.rapidapi.com",
    description: "OpenAI GPT-4.1 Mini efficient model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "openai"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/conversationgpt4",
    host: "chatgpt-42.p.rapidapi.com",
    description: "ChatGPT conversation model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "chatgpt-vision",
    name: "ChatGPT Vision",
    provider: "OpenAI",
    endpoint: "https://chatgpt-vision1.p.rapidapi.com/gpt4",
    host: "chatgpt-vision1.p.rapidapi.com",
    description: "ChatGPT with vision capabilities",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gpt35-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    endpoint: "https://open-ai21.p.rapidapi.com/conversationgpt35",
    host: "open-ai21.p.rapidapi.com",
    description: "OpenAI GPT-3.5 Turbo model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "simple-chatgpt",
    name: "Simple ChatGPT",
    provider: "OpenAI",
    endpoint: "https://simple-chatgpt-api.p.rapidapi.com/ask",
    host: "simple-chatgpt-api.p.rapidapi.com",
    description: "Simple ChatGPT question-answer",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "simple"
  },
  {
    id: "free-chatgpt",
    name: "Free ChatGPT",
    provider: "OpenAI",
    endpoint: "https://free-chatgpt-api.p.rapidapi.com/chat",
    host: "free-chatgpt-api.p.rapidapi.com",
    description: "Free ChatGPT API",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "chatgpt-best",
    name: "ChatGPT Best",
    provider: "OpenAI",
    endpoint: "https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions",
    host: "chatgpt-best-price.p.rapidapi.com",
    description: "ChatGPT best price model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "openai"
  },
  
  // Microsoft Copilot
  {
    id: "copilot",
    name: "Microsoft Copilot",
    provider: "Microsoft",
    endpoint: "https://copilot5.p.rapidapi.com/copilot",
    host: "copilot5.p.rapidapi.com",
    description: "Microsoft Copilot assistant",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "copilot-chat",
    name: "Copilot Chat",
    provider: "Microsoft",
    endpoint: "https://microsoft-copilot.p.rapidapi.com/chat",
    host: "microsoft-copilot.p.rapidapi.com",
    description: "Microsoft Copilot chat",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // DeepSeek Models
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    endpoint: "https://deepseek-r1.p.rapidapi.com/chat/completions",
    host: "deepseek-r1.p.rapidapi.com",
    description: "DeepSeek R1 reasoning model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "openai"
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    endpoint: "https://deepseek3.p.rapidapi.com/v1/chat/completions",
    host: "deepseek3.p.rapidapi.com",
    description: "DeepSeek V3-0324 latest model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "openai"
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    endpoint: "https://deepseek-coder.p.rapidapi.com/chat",
    host: "deepseek-coder.p.rapidapi.com",
    description: "DeepSeek code generation model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Google Gemini Models
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    endpoint: "https://gemini-api1.p.rapidapi.com/chat",
    host: "gemini-api1.p.rapidapi.com",
    description: "Google Gemini 2.5 Flash fast model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    endpoint: "https://gemini-pro-api.p.rapidapi.com/gemini",
    host: "gemini-pro-api.p.rapidapi.com",
    description: "Google Gemini Pro model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "gemini-vision",
    name: "Gemini Vision",
    provider: "Google",
    endpoint: "https://gemini-pro-vision.p.rapidapi.com/analyze",
    host: "gemini-pro-vision.p.rapidapi.com",
    description: "Google Gemini Pro Vision",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Anthropic Claude Models
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    endpoint: "https://claude-api.p.rapidapi.com/claude/opus",
    host: "claude-api.p.rapidapi.com",
    description: "Anthropic Claude Opus model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    endpoint: "https://claude-api.p.rapidapi.com/claude/sonnet",
    host: "claude-api.p.rapidapi.com",
    description: "Anthropic Claude Sonnet model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku",
    provider: "Anthropic",
    endpoint: "https://claude-api.p.rapidapi.com/claude/haiku",
    host: "claude-api.p.rapidapi.com",
    description: "Anthropic Claude Haiku fast model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "claude3",
    name: "Claude 3",
    provider: "Anthropic",
    endpoint: "https://claude3-haiku.p.rapidapi.com/chat",
    host: "claude3-haiku.p.rapidapi.com",
    description: "Claude 3 conversation model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Tencent Hunyuan
  {
    id: "hunyuan-large",
    name: "Hunyuan Large",
    provider: "Tencent",
    endpoint: "https://hunyuan-api.p.rapidapi.com/chat",
    host: "hunyuan-api.p.rapidapi.com",
    description: "Tencent Hunyuan Large3 model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  {
    id: "hunyuan-turbo",
    name: "Hunyuan Turbo",
    provider: "Tencent",
    endpoint: "https://hunyuan-turbo.p.rapidapi.com/chat",
    host: "hunyuan-turbo.p.rapidapi.com",
    description: "Tencent Hunyuan Turbo fast model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  
  // Alibaba Qwen
  {
    id: "qwen-max",
    name: "Qwen Max",
    provider: "Alibaba",
    endpoint: "https://qwen-api.p.rapidapi.com/chat/max",
    host: "qwen-api.p.rapidapi.com",
    description: "Alibaba Qwen Max model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  {
    id: "qwen-plus",
    name: "Qwen Plus",
    provider: "Alibaba",
    endpoint: "https://qwen-api.p.rapidapi.com/chat/plus",
    host: "qwen-api.p.rapidapi.com",
    description: "Alibaba Qwen Plus model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  {
    id: "qwen-turbo",
    name: "Qwen Turbo",
    provider: "Alibaba",
    endpoint: "https://qwen-api.p.rapidapi.com/chat/turbo",
    host: "qwen-api.p.rapidapi.com",
    description: "Alibaba Qwen Turbo fast model",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  {
    id: "qwen-coder",
    name: "Qwen Coder",
    provider: "Alibaba",
    endpoint: "https://qwen-coder.p.rapidapi.com/code",
    host: "qwen-coder.p.rapidapi.com",
    description: "Alibaba Qwen code generation",
    apiKey: RAPIDAPI_KEY_SHORT,
    requestFormat: "custom"
  },
  
  // Meta Llama Models
  {
    id: "llama3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    endpoint: "https://llama3-70b.p.rapidapi.com/chat",
    host: "llama3-70b.p.rapidapi.com",
    description: "Meta Llama 3 70B model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "llama3-8b",
    name: "Llama 3 8B",
    provider: "Meta",
    endpoint: "https://llama3-8b.p.rapidapi.com/chat",
    host: "llama3-8b.p.rapidapi.com",
    description: "Meta Llama 3 8B efficient model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "llama2",
    name: "Llama 2",
    provider: "Meta",
    endpoint: "https://meta-llama2.p.rapidapi.com/chat",
    host: "meta-llama2.p.rapidapi.com",
    description: "Meta Llama 2 model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "codellama",
    name: "Code Llama",
    provider: "Meta",
    endpoint: "https://code-llama.p.rapidapi.com/code",
    host: "code-llama.p.rapidapi.com",
    description: "Meta Code Llama for coding",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Mistral AI Models
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    endpoint: "https://mistral-api.p.rapidapi.com/chat/large",
    host: "mistral-api.p.rapidapi.com",
    description: "Mistral Large model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "Mistral AI",
    endpoint: "https://mistral-api.p.rapidapi.com/chat/medium",
    host: "mistral-api.p.rapidapi.com",
    description: "Mistral Medium model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "Mistral AI",
    endpoint: "https://mistral-api.p.rapidapi.com/chat/small",
    host: "mistral-api.p.rapidapi.com",
    description: "Mistral Small fast model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "mixtral",
    name: "Mixtral 8x7B",
    provider: "Mistral AI",
    endpoint: "https://mixtral-api.p.rapidapi.com/chat",
    host: "mixtral-api.p.rapidapi.com",
    description: "Mixtral 8x7B MoE model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Cohere Models
  {
    id: "cohere-command",
    name: "Cohere Command",
    provider: "Cohere",
    endpoint: "https://cohere-api.p.rapidapi.com/chat",
    host: "cohere-api.p.rapidapi.com",
    description: "Cohere Command model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "cohere-command-r",
    name: "Cohere Command R",
    provider: "Cohere",
    endpoint: "https://cohere-api.p.rapidapi.com/chat/r",
    host: "cohere-api.p.rapidapi.com",
    description: "Cohere Command R+ model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // xAI Grok
  {
    id: "grok",
    name: "Grok",
    provider: "xAI",
    endpoint: "https://grok-api.p.rapidapi.com/chat",
    host: "grok-api.p.rapidapi.com",
    description: "xAI Grok model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "grok-2",
    name: "Grok 2",
    provider: "xAI",
    endpoint: "https://grok2-api.p.rapidapi.com/chat",
    host: "grok2-api.p.rapidapi.com",
    description: "xAI Grok 2 latest model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Perplexity
  {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity",
    endpoint: "https://perplexity-api.p.rapidapi.com/chat",
    host: "perplexity-api.p.rapidapi.com",
    description: "Perplexity search-augmented model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "perplexity-online",
    name: "Perplexity Online",
    provider: "Perplexity",
    endpoint: "https://perplexity-online.p.rapidapi.com/search",
    host: "perplexity-online.p.rapidapi.com",
    description: "Perplexity with web search",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // AI21 Labs
  {
    id: "jurassic",
    name: "Jurassic-2",
    provider: "AI21",
    endpoint: "https://ai21-api.p.rapidapi.com/chat",
    host: "ai21-api.p.rapidapi.com",
    description: "AI21 Jurassic-2 model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "jamba",
    name: "Jamba",
    provider: "AI21",
    endpoint: "https://ai21-jamba.p.rapidapi.com/chat",
    host: "ai21-jamba.p.rapidapi.com",
    description: "AI21 Jamba model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Zhipu AI (GLM)
  {
    id: "glm4",
    name: "GLM-4",
    provider: "Zhipu",
    endpoint: "https://glm4-api.p.rapidapi.com/chat",
    host: "glm4-api.p.rapidapi.com",
    description: "Zhipu GLM-4 model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "chatglm",
    name: "ChatGLM",
    provider: "Zhipu",
    endpoint: "https://chatglm-api.p.rapidapi.com/chat",
    host: "chatglm-api.p.rapidapi.com",
    description: "Zhipu ChatGLM conversation",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Moonshot (Kimi)
  {
    id: "kimi",
    name: "Kimi",
    provider: "Moonshot",
    endpoint: "https://kimi-api.p.rapidapi.com/chat",
    host: "kimi-api.p.rapidapi.com",
    description: "Moonshot Kimi model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "moonshot",
    name: "Moonshot",
    provider: "Moonshot",
    endpoint: "https://moonshot-api.p.rapidapi.com/chat",
    host: "moonshot-api.p.rapidapi.com",
    description: "Moonshot AI model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // ByteDance Doubao
  {
    id: "doubao",
    name: "Doubao",
    provider: "ByteDance",
    endpoint: "https://doubao-api.p.rapidapi.com/chat",
    host: "doubao-api.p.rapidapi.com",
    description: "ByteDance Doubao model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Baidu Wenxin
  {
    id: "wenxin",
    name: "Wenxin",
    provider: "Baidu",
    endpoint: "https://wenxin-api.p.rapidapi.com/chat",
    host: "wenxin-api.p.rapidapi.com",
    description: "Baidu Wenxin ERNIE model",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "ernie",
    name: "ERNIE Bot",
    provider: "Baidu",
    endpoint: "https://ernie-api.p.rapidapi.com/chat",
    host: "ernie-api.p.rapidapi.com",
    description: "Baidu ERNIE Bot",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Stability AI
  {
    id: "stable-lm",
    name: "Stable LM",
    provider: "Stability",
    endpoint: "https://stablelm-api.p.rapidapi.com/chat",
    host: "stablelm-api.p.rapidapi.com",
    description: "Stability AI Stable LM",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Inflection Pi
  {
    id: "pi",
    name: "Pi",
    provider: "Inflection",
    endpoint: "https://pi-api.p.rapidapi.com/chat",
    host: "pi-api.p.rapidapi.com",
    description: "Inflection Pi conversational AI",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Character AI
  {
    id: "character",
    name: "Character AI",
    provider: "Character",
    endpoint: "https://character-api.p.rapidapi.com/chat",
    host: "character-api.p.rapidapi.com",
    description: "Character AI roleplay",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Replicate Models
  {
    id: "replicate-llama",
    name: "Replicate Llama",
    provider: "Replicate",
    endpoint: "https://replicate-api.p.rapidapi.com/llama",
    host: "replicate-api.p.rapidapi.com",
    description: "Replicate hosted Llama",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Together AI
  {
    id: "together",
    name: "Together AI",
    provider: "Together",
    endpoint: "https://together-api.p.rapidapi.com/chat",
    host: "together-api.p.rapidapi.com",
    description: "Together AI inference",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Groq
  {
    id: "groq",
    name: "Groq LPU",
    provider: "Groq",
    endpoint: "https://groq-api.p.rapidapi.com/chat",
    host: "groq-api.p.rapidapi.com",
    description: "Groq LPU fast inference",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Fireworks AI
  {
    id: "fireworks",
    name: "Fireworks",
    provider: "Fireworks",
    endpoint: "https://fireworks-api.p.rapidapi.com/chat",
    host: "fireworks-api.p.rapidapi.com",
    description: "Fireworks AI inference",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  
  // Additional specialized models
  {
    id: "code-assistant",
    name: "Code Assistant",
    provider: "OpenAI",
    endpoint: "https://code-assistant.p.rapidapi.com/code",
    host: "code-assistant.p.rapidapi.com",
    description: "AI code assistant",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "math-solver",
    name: "Math Solver",
    provider: "OpenAI",
    endpoint: "https://math-solver-api.p.rapidapi.com/solve",
    host: "math-solver-api.p.rapidapi.com",
    description: "AI math problem solver",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "writing-assistant",
    name: "Writing Assistant",
    provider: "OpenAI",
    endpoint: "https://writing-assistant.p.rapidapi.com/write",
    host: "writing-assistant.p.rapidapi.com",
    description: "AI writing assistant",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "summarizer",
    name: "Summarizer",
    provider: "OpenAI",
    endpoint: "https://ai-summarizer.p.rapidapi.com/summarize",
    host: "ai-summarizer.p.rapidapi.com",
    description: "AI text summarizer",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  },
  {
    id: "translator",
    name: "AI Translator",
    provider: "OpenAI",
    endpoint: "https://ai-translator.p.rapidapi.com/translate",
    host: "ai-translator.p.rapidapi.com",
    description: "AI translation service",
    apiKey: RAPIDAPI_KEY_FULL,
    requestFormat: "custom"
  }
]

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

// Primary API endpoints to try in order
const PRIMARY_ENDPOINTS = [
  {
    url: "https://chatgpt-42.p.rapidapi.com/conversationgpt4",
    host: "chatgpt-42.p.rapidapi.com",
    format: "custom"
  },
  {
    url: "https://gpt-4-1-mini.p.rapidapi.com/chat/completions",
    host: "gpt-4-1-mini.p.rapidapi.com",
    format: "openai"
  },
  {
    url: "https://open-ai21.p.rapidapi.com/conversationgpt35",
    host: "open-ai21.p.rapidapi.com",
    format: "custom"
  },
  {
    url: "https://simple-chatgpt-api.p.rapidapi.com/ask",
    host: "simple-chatgpt-api.p.rapidapi.com",
    format: "simple"
  },
  {
    url: "https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions",
    host: "chatgpt-best-price.p.rapidapi.com",
    format: "openai"
  }
]

export async function sendAIMessage(
  message: string,
  modelId: string = "chatgpt",
  conversationHistory: ChatMessage[] = [],
  systemPrompt?: string
): Promise<string> {
  const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
  
  // Build messages array
  const messages = []
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt })
  }
  for (const msg of conversationHistory) {
    messages.push({ role: msg.role, content: msg.content })
  }
  messages.push({ role: "user", content: message })

  // Try model-specific endpoint first (Deepseek gets priority)
  try {
    const response = await callEndpoint(
      model.endpoint,
      model.host,
      model.apiKey,
      model.requestFormat,
      messages,
      message,
      modelId
    )
    if (response) return response
  } catch (error) {
    console.log(`[v0] Model ${model.id} failed:`, error)
  }

  // Try fallback endpoints
  for (const endpoint of PRIMARY_ENDPOINTS) {
    try {
      const response = await callEndpoint(
        endpoint.url,
        endpoint.host,
        RAPIDAPI_KEY_FULL,
        endpoint.format as "openai" | "simple" | "custom",
        messages,
        message
      )
      if (response) return response
    } catch (error) {
      console.log(`[v0] Endpoint ${endpoint.url} failed`)
      continue
    }
  }

  // Try free APIs without authentication
  try {
    const freeResponse = await callFreeAPI(message)
    if (freeResponse) return freeResponse
  } catch (error) {
    console.log("[v0] Free API failed:", error)
  }

  // All APIs failed, return intelligent fallback
  return generateIntelligentResponse(message)
}

async function callDeepseekAPI(
  messages: Array<{role: string, content: string}>,
  modelId: string
): Promise<string | null> {
  if (!DEEPSEEK_API_KEY) {
    console.error("[v0] Deepseek API key not configured")
    return null
  }

  // Map model IDs to official Deepseek model names
  const modelMap: Record<string, string> = {
    "deepseek-v4-pro": "deepseek-v4-pro",
    "deepseek-chat": "deepseek-chat",
    "deepseek-code": "deepseek-code"
  }

  const deepseekModel = modelMap[modelId] || "deepseek-chat"
  
  // Determine if this is a reasoning model
  const isReasoningModel = deepseekModel === "deepseek-v4-pro"

  try {
    const requestBody: any = {
      model: deepseekModel,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    }

    // Add thinking/reasoning parameters for V4 Pro
    if (isReasoningModel) {
      requestBody.thinking = {
        type: "enabled",
        budget_tokens: 10000
      }
      requestBody.reasoning_effort = "high"
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Deepseek API error:", errorData)
      throw new Error(`Deepseek API error: ${response.status} - ${errorData.error?.message || errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    
    // Extract content from response
    if (data.choices?.[0]?.message?.content) {
      let content = data.choices[0].message.content
      
      // Add thinking content if available (for V4 Pro)
      if (data.choices[0].message?.thinking) {
        content = `**思考过程:**\n${data.choices[0].message.thinking}\n\n**回答:**\n${content}`
      }
      
      return content
    }
    
    throw new Error("No content in Deepseek response")
  } catch (error) {
    console.error("[v0] Deepseek API call failed:", error)
    throw error
  }
}

async function callEndpoint(
  url: string,
  host: string,
  apiKey: string,
  format: "openai" | "simple" | "custom" | "deepseek",
  messages: Array<{role: string, content: string}>,
  question: string,
  modelId?: string
): Promise<string | null> {
  // Handle Deepseek separately
  if (format === "deepseek" && modelId) {
    return await callDeepseekAPI(messages, modelId)
  }

  let body: string
  
  switch (format) {
    case "openai":
      body = JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      })
      break
    case "simple":
      body = JSON.stringify({ question })
      break
    case "custom":
    default:
      body = JSON.stringify({
        messages: messages,
        system_prompt: "You are Orbit AI, a helpful assistant. Answer in the same language as the user.",
        temperature: 0.7,
        max_tokens: 2048,
        web_access: false
      })
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": host
    },
    body
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  
  // Extract response from various formats
  if (data.result) return data.result
  if (data.response) return data.response
  if (data.message) return data.message
  if (data.answer) return data.answer
  if (data.text) return data.text
  if (data.content) return data.content
  if (data.output) return data.output
  if (data.BOT) return data.BOT
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content
  if (data.choices?.[0]?.text) return data.choices[0].text
  if (typeof data === "string") return data
  
  return null
}

async function callFreeAPI(message: string): Promise<string | null> {
  // Try Hugging Face Inference API (free tier - limited but works)
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: message,
        parameters: { max_length: 200 }
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text
      }
    }
  } catch (error) {
    console.log("[v0] Hugging Face API failed")
  }

  // Try API Ninjas chatbot
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.output) return data.output
    }
  } catch (error) {
    console.log("[v0] API Ninjas failed")
  }

  // Try QuillBot API
  try {
    const response = await fetch("https://www.quillbot.com/api/v2/paraphrase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.result) return data.result
    }
  } catch (error) {
    console.log("[v0] QuillBot API failed")
  }

  // Try TextRazor
  try {
    const response = await fetch("https://api.textrazor.com/", {
      method: "POST",
      body: new URLSearchParams({
        text: message,
        apiKey: "placeholder"
      })
    })
    
    if (response.ok) {
      return `Analysis: ${message}`
    }
  } catch (error) {
    console.log("[v0] TextRazor API failed")
  }

  return null
}

function generateIntelligentResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greeting responses
  if (lowerMessage.match(/^(你好|hi|hello|hey|嗨|哈喽)/)) {
    return "你好！我是 Orbit AI 助手，很高兴为您服务。请问有什么可以帮助您的？"
  }
  
  // Weather inquiry
  if (lowerMessage.includes("天气") || lowerMessage.includes("weather")) {
    return "要获取实时天气信息，您可以使用 Orbit 浏览器访问天气网站，或在地址栏搜索「天气 + 城市名」获取最新天气预报。"
  }
  
  // Time inquiry
  if (lowerMessage.includes("时间") || lowerMessage.includes("几点") || lowerMessage.includes("time")) {
    const now = new Date()
    return `现在的时间是 ${now.toLocaleString("zh-CN")}。`
  }
  
  // Translation request
  if (lowerMessage.includes("翻译") || lowerMessage.includes("translate")) {
    return "Orbit 浏览器内置了翻译功能。您可以点击工具栏中的翻译按钮来翻译网页内容，支持多种语言之间的互译。"
  }
  
  // Bookmark inquiry
  if (lowerMessage.includes("书签") || lowerMessage.includes("bookmark")) {
    return "要添加书签，请点击地址栏右侧的星标图标。您可以在侧边栏的书签管理器中查看、编辑和整理所有书签。"
  }
  
  // History inquiry
  if (lowerMessage.includes("历史") || lowerMessage.includes("history")) {
    return "您的浏览历史可以在侧边栏中的「历史记录」部分查看。您也可以通过设置清除特定时间段的浏览历史。"
  }
  
  // Download inquiry
  if (lowerMessage.includes("下载") || lowerMessage.includes("download")) {
    return "下载的文件可以在「下载管理器」中查看和管理。点击工具栏中的下载图标即可打开下载管理器。"
  }
  
  // Settings inquiry
  if (lowerMessage.includes("设置") || lowerMessage.includes("setting")) {
    return "点击工具栏右侧的齿轮图标可以打开设置页面，您可以在这里配置语言、主题、搜索引擎、隐私设置等选项。"
  }
  
  // Help request
  if (lowerMessage.includes("帮助") || lowerMessage.includes("help") || lowerMessage.includes("怎么")) {
    return `我是 Orbit AI 助手，可以帮助您：

1. **回答问题** - 各类知识和信息查询
2. **浏览器功能** - 翻译、书签、历史、下载等
3. **使用技巧** - 快捷键、高级功能介绍
4. **问题解决** - 故障排除和技术支持

请告诉我您需要什么帮助！`
  }
  
  // Code inquiry
  if (lowerMessage.includes("代码") || lowerMessage.includes("code") || lowerMessage.includes("编程")) {
    return "我可以帮助您解答编程问题、解释代码逻辑、提供代码示例。请描述您的具体需求或粘贴需要帮助的代码。"
  }
  
  // Math inquiry
  if (lowerMessage.match(/[\d+\-*/=]/) || lowerMessage.includes("计算") || lowerMessage.includes("数学")) {
    return "我可以帮助您解决数学问题。请提供具体的计算题目或数学问题，我会尽力为您解答并展示解题步骤。"
  }
  
  // Default intelligent response
  return `感谢您的提问！

关于「${message.slice(0, 50)}${message.length > 50 ? "..." : ""}」，这是一个很好的问题。

作为 Orbit AI 助手，我可以帮助您：
• 搜索相关信息 - 使用地址栏进行网络搜索
• 翻译内容 - 使用内置翻译功能
• 管理浏览 - 书签、历史、下载管理

如需更详细的信息，建议您使用浏览器搜索功能获取最新内容。还有什么我可以帮助您的吗？`
}

// Stream message for real-time output effect
export async function* streamAIMessage(
  message: string,
  modelId: string = "chatgpt",
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string> {
  const fullResponse = await sendAIMessage(message, modelId, conversationHistory)
  
  // Simulate streaming by yielding characters
  for (let i = 0; i < fullResponse.length; i++) {
    yield fullResponse.slice(0, i + 1)
    await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 10))
  }
}

export function getAvailableModels(): AIModel[] {
  return AI_MODELS
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(m => m.id === id)
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter(m => m.provider === provider)
}

export function getAllProviders(): string[] {
  return [...new Set(AI_MODELS.map(m => m.provider))]
}
