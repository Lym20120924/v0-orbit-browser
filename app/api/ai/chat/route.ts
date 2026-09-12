import { NextResponse } from "next/server"

const RAPIDAPI_URL = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2"
const RAPIDAPI_HOST = "chatgpt-42.p.rapidapi.com"

interface ChatRequest {
  messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>
  system_prompt?: string
  temperature?: number
  top_k?: number
  top_p?: number
  max_tokens?: number
  web_access?: boolean
}

export async function POST(request: Request) {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "RAPIDAPI_KEY 未配置" }, { status: 500 })
  }

  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "请求体必须是有效的 JSON" }, { status: 400 })
  }

  if (!body.messages?.length || body.messages.some((message) => !message.content?.trim())) {
    return NextResponse.json({ error: "至少需要一条有效消息" }, { status: 400 })
  }

  try {
    const response = await fetch(RAPIDAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({
        messages: body.messages,
        system_prompt: body.system_prompt ?? "",
        temperature: body.temperature ?? 0.9,
        top_k: body.top_k ?? 5,
        top_p: body.top_p ?? 0.9,
        max_tokens: Math.min(body.max_tokens ?? 256, 2048),
        web_access: body.web_access ?? false,
      }),
    })

    const result = await response.json().catch(() => null)
    if (!response.ok) {
      const message = result?.error || result?.message || `RapidAPI 请求失败（${response.status}）`
      return NextResponse.json({ error: message }, { status: response.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] RapidAPI proxy error:", error)
    return NextResponse.json({ error: "无法连接到 AI 服务" }, { status: 502 })
  }
}
