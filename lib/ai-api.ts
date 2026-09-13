"use client"

export interface AIModel {
  id: string
  name: string
  provider: string
  endpoint: string
  host: string
  description: string
  apiKey: string
  requestFormat: "openai"
  category?: "chat" | "code"
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

const MODEL_ID = "Qwen3.8-Flash-Next"
const MODEL: AIModel = {
  id: MODEL_ID,
  name: "Qwen3.8-Flash-Next",
  provider: "Qwen",
  endpoint: "https://api.hcnsec.cn/v1",
  host: "api.hcnsec.cn",
  description: "统一的 Qwen3.8-Flash-Next 对话模型",
  apiKey: "",
  requestFormat: "openai",
  category: "chat",
}

export const AI_MODELS: AIModel[] = [MODEL]

export function getAvailableModels(): AIModel[] {
  return AI_MODELS
}

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id)
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((model) => model.provider === provider)
}

export function getAllProviders(): string[] {
  return [MODEL.provider]
}

export function setDeepseekKey(_key: string): void {}

export function getCurrentDeepseekKey(): string {
  return "server-configured"
}

export function isDeepseekConfigured(): boolean {
  return true
}

function normalizeMessages(messages: ChatMessage[]) {
  return messages.map(({ role, content }) => ({ role, content }))
}

export async function sendAIMessage(
  message: string,
  _modelId: string = MODEL_ID,
  conversationHistory: ChatMessage[] = [],
  systemPrompt?: string,
): Promise<string> {
  const messages = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...normalizeMessages(conversationHistory),
    { role: "user" as const, content: message },
  ]

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system_prompt: systemPrompt ?? "" }),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.error || `AI 请求失败（${response.status}）`)
  }

  const text = result?.choices?.[0]?.message?.content ?? result?.output ?? result?.response ?? result?.text
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("AI 返回了无法识别的响应")
  }
  return text.trim()
}

export async function* streamAIMessage(
  message: string,
  modelId: string = MODEL_ID,
  conversationHistory: ChatMessage[] = [],
): AsyncGenerator<string> {
  const fullResponse = await sendAIMessage(message, modelId, conversationHistory)
  let output = ""
  for (const character of fullResponse) {
    output += character
    yield output
    await new Promise((resolve) => setTimeout(resolve, 8))
  }
}
