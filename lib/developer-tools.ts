// Developer Tools utilities
export interface ConsoleLog {
  id: string
  type: "log" | "warn" | "error" | "info"
  message: string
  timestamp: Date
  count: number
}

export interface NetworkRequest {
  id: string
  url: string
  method: string
  status: number
  type: string
  size: string
  time: number
  timestamp: Date
}

export interface DOMElement {
  tagName: string
  id?: string
  className?: string
  attributes: Record<string, string>
  children: DOMElement[]
  textContent?: string
}

export function parseHTML(html: string): DOMElement | null {
  // 模拟 DOM 解析 - 实际应用中使用 DOMParser
  return {
    tagName: "html",
    attributes: {},
    children: [
      {
        tagName: "body",
        attributes: {},
        children: [],
      },
    ],
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}
