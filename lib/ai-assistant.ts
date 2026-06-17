import { sendAIMessage } from "@/lib/ai-api"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  model?: string
}

interface SendMessageOptions {
  model?: string
  apiKey?: string
}

export class AIAssistant {
  private messages: ChatMessage[] = []

  async sendMessage(userMessage: string, options?: SendMessageOptions): Promise<string> {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
      model: options?.model,
    }
    this.messages.push(message)

    let response: string
    try {
      // Use real AI API with actual model
      response = await sendAIMessage(
        userMessage,
        options?.model || "gpt-4-mini",
        this.messages.slice(-10).map(m => ({ role: m.role, content: m.content, timestamp: new Date(m.timestamp) }))
      )
    } catch (error) {
      console.error("[v0] AI API error:", error)
      response = "抱歉，AI 服务暂时不可用。请检查您的网络连接或 API 配置。"
    }

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: response,
      timestamp: Date.now(),
      model: options?.model,
    }
    this.messages.push(assistantMessage)

    return response
  }

  getMessages(): ChatMessage[] {
    return [...this.messages]
  }

  clearHistory() {
    this.messages = []
  }
}
