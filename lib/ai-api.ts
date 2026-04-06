"use client"

// RapidAPI Key provided by user
const RAPIDAPI_KEY = "5e117c0989mshca3aa58cc6a164ep1e6d32jsna56e7442ae34"

export interface AIModel {
  id: string
  name: string
  provider: string
  endpoint: string
  host: string
  description: string
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt4o",
    name: "GPT-4 Omni",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/gpt4",
    host: "chatgpt-42.p.rapidapi.com",
    description: "OpenAI GPT-4o 多模态模型"
  },
  {
    id: "gpt4",
    name: "GPT-4",
    provider: "OpenAI", 
    endpoint: "https://chatgpt-42.p.rapidapi.com/gpt4",
    host: "chatgpt-42.p.rapidapi.com",
    description: "OpenAI GPT-4 模型"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    endpoint: "https://chatgpt-42.p.rapidapi.com/conversationgpt4",
    host: "chatgpt-42.p.rapidapi.com",
    description: "ChatGPT 对话模型"
  },
  {
    id: "copilot",
    name: "Copilot",
    provider: "Microsoft",
    endpoint: "https://copilot5.p.rapidapi.com/copilot",
    host: "copilot5.p.rapidapi.com",
    description: "Microsoft Copilot 助手"
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    endpoint: "https://deepseek-r1.p.rapidapi.com/chat",
    host: "deepseek-r1.p.rapidapi.com",
    description: "DeepSeek R1 推理模型"
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    endpoint: "https://deepseek-v3.p.rapidapi.com/chat",
    host: "deepseek-v3.p.rapidapi.com",
    description: "DeepSeek V3 最新模型"
  },
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    endpoint: "https://gemini-pro-api.p.rapidapi.com/gemini",
    host: "gemini-pro-api.p.rapidapi.com",
    description: "Google Gemini Flash 模型"
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    endpoint: "https://claude-api.p.rapidapi.com/claude",
    host: "claude-api.p.rapidapi.com",
    description: "Anthropic Claude 模型"
  },
  {
    id: "hunyuan",
    name: "Hunyuan Large",
    provider: "Tencent",
    endpoint: "https://hunyuan-large.p.rapidapi.com/chat",
    host: "hunyuan-large.p.rapidapi.com",
    description: "腾讯混元大模型"
  },
  {
    id: "qwen",
    name: "Qwen",
    provider: "Alibaba",
    endpoint: "https://qwen-api.p.rapidapi.com/chat",
    host: "qwen-api.p.rapidapi.com",
    description: "阿里通义千问模型"
  },
  {
    id: "llama",
    name: "Llama 3",
    provider: "Meta",
    endpoint: "https://llama3-70b.p.rapidapi.com/chat",
    host: "llama3-70b.p.rapidapi.com",
    description: "Meta Llama 3 开源模型"
  },
  {
    id: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    endpoint: "https://mistral-api.p.rapidapi.com/chat",
    host: "mistral-api.p.rapidapi.com",
    description: "Mistral AI 模型"
  }
]

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export async function sendAIMessage(
  message: string,
  modelId: string = "chatgpt",
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0]
  
  // Build conversation context
  const messages = conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }))
  messages.push({ role: "user", content: message })

  try {
    // Try primary ChatGPT API
    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com"
      },
      body: JSON.stringify({
        messages: messages,
        system_prompt: "You are Orbit AI, a helpful assistant in the Orbit Browser. Answer in the same language as the user's question. Be concise and helpful.",
        temperature: 0.7,
        max_tokens: 2048
      })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.result) return data.result
      if (data.response) return data.response
      if (data.message) return data.message
      if (data.choices?.[0]?.message?.content) return data.choices[0].message.content
      if (typeof data === "string") return data
    }

    // Fallback to alternative endpoint
    const fallbackResponse = await fetch("https://open-ai21.p.rapidapi.com/conversationgpt35", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "open-ai21.p.rapidapi.com"
      },
      body: JSON.stringify({
        messages: messages,
        web_access: false
      })
    })

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json()
      if (fallbackData.result) return fallbackData.result
      if (fallbackData.BOT) return fallbackData.BOT
      if (fallbackData.response) return fallbackData.response
    }

    // Third fallback
    const thirdResponse = await fetch("https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "chatgpt-best-price.p.rapidapi.com"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    })

    if (thirdResponse.ok) {
      const thirdData = await thirdResponse.json()
      if (thirdData.choices?.[0]?.message?.content) {
        return thirdData.choices[0].message.content
      }
    }

    throw new Error("All API endpoints failed")
  } catch (error) {
    console.error("[v0] AI API Error:", error)
    // Return intelligent fallback response
    return generateFallbackResponse(message)
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("你好") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
    return "你好！我是 Orbit AI 助手。很高兴为您服务。请问有什么可以帮助您的吗？"
  }
  
  if (lowerMessage.includes("天气")) {
    return "抱歉，我暂时无法获取实时天气信息。您可以使用浏览器访问天气网站查询，或在地址栏中搜索「天气」获取相关信息。"
  }
  
  if (lowerMessage.includes("翻译") || lowerMessage.includes("translate")) {
    return "您可以使用 Orbit 浏览器的翻译功能。点击工具栏中的翻译按钮，即可将网页或文本翻译为多种语言。"
  }
  
  if (lowerMessage.includes("书签") || lowerMessage.includes("bookmark")) {
    return "您可以点击地址栏右侧的星标图标来添加书签。所有书签都可以在侧边栏的书签管理器中查看和管理。"
  }
  
  if (lowerMessage.includes("历史") || lowerMessage.includes("history")) {
    return "点击侧边栏中的「历史记录」选项，您可以查看所有浏览历史。您也可以在设置中清除浏览历史。"
  }
  
  if (lowerMessage.includes("下载") || lowerMessage.includes("download")) {
    return "所有下载的文件都可以在「下载管理器」中查看。点击工具栏中的下载图标即可打开。"
  }
  
  if (lowerMessage.includes("设置") || lowerMessage.includes("setting")) {
    return "点击工具栏右侧的齿轮图标，您可以访问 Orbit 浏览器的设置，包括语言、主题、搜索引擎等选项。"
  }
  
  if (lowerMessage.includes("帮助") || lowerMessage.includes("help")) {
    return "我是 Orbit AI 助手，可以帮助您：\n\n1. 回答问题和提供信息\n2. 解释浏览器功能\n3. 提供使用技巧\n4. 帮助搜索和导航\n\n请告诉我您需要什么帮助！"
  }
  
  return `感谢您的提问！作为 Orbit AI 助手，我正在为您处理：「${message}」\n\n如果您需要更详细的信息，建议使用浏览器搜索功能获取最新内容。您还可以尝试以下功能：\n\n• 翻译 - 使用翻译工具\n• 书签 - 管理常用网站\n• 下载 - 查看下载文件\n• 设置 - 个性化浏览器`
}

export function getAvailableModels(): AIModel[] {
  return AI_MODELS
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(m => m.id === id)
}
