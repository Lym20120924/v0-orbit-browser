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
  if (typeof window === "undefined") {
    // Server-side: simple regex-based parsing
    return parseHTMLServer(html)
  }
  
  // Client-side: use real DOMParser
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return domNodeToElement(doc.documentElement)
  } catch (error) {
    console.error("HTML parse error:", error)
    return null
  }
}

function domNodeToElement(node: Element | Node): DOMElement {
  if (node.nodeType === 3) { // Text node
    return {
      tagName: "#text",
      attributes: {},
      children: [],
      textContent: (node as Text).textContent || undefined,
    }
  }
  
  const el = node as Element
  const attributes: Record<string, string> = {}
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i]
    attributes[attr.name] = attr.value
  }
  
  const children = Array.from(el.childNodes)
    .map(child => domNodeToElement(child))
    .filter(child => !(child.tagName === "#text" && !child.textContent?.trim()))
  
  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || undefined,
    className: el.className || undefined,
    attributes,
    children,
  }
}

function parseHTMLServer(html: string): DOMElement {
  // Server-side fallback: basic DOM structure
  return {
    tagName: "html",
    attributes: {},
    children: [
      {
        tagName: "head",
        attributes: {},
        children: [],
      },
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
