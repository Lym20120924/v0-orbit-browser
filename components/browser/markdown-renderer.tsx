"use client"

import { useMemo } from "react"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const rendered = useMemo(() => parseMarkdown(content), [content])
  
  return (
    <div className={`markdown-content prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {rendered}
    </div>
  )
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let codeBlock: string[] = []
  let codeLanguage = ""
  let inCodeBlock = false
  let listItems: string[] = []
  let listType: "ul" | "ol" | null = null

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType
      elements.push(
        <ListTag key={`list-${elements.length}`} className={listType === "ul" ? "list-disc pl-4" : "list-decimal pl-4"}>
          {listItems.map((item, i) => (
            <li key={i} className="my-1">{parseInline(item)}</li>
          ))}
        </ListTag>
      )
      listItems = []
      listType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code block start/end
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={`code-${elements.length}`} code={codeBlock.join("\n")} language={codeLanguage} />
        )
        codeBlock = []
        codeLanguage = ""
        inCodeBlock = false
      } else {
        flushList()
        codeLanguage = line.slice(3).trim()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlock.push(line)
      continue
    }

    // Headers
    if (line.startsWith("### ")) {
      flushList()
      elements.push(<h3 key={`h3-${i}`} className="text-base font-semibold mt-4 mb-2">{parseInline(line.slice(4))}</h3>)
      continue
    }
    if (line.startsWith("## ")) {
      flushList()
      elements.push(<h2 key={`h2-${i}`} className="text-lg font-semibold mt-4 mb-2">{parseInline(line.slice(3))}</h2>)
      continue
    }
    if (line.startsWith("# ")) {
      flushList()
      elements.push(<h1 key={`h1-${i}`} className="text-xl font-bold mt-4 mb-2">{parseInline(line.slice(2))}</h1>)
      continue
    }

    // Horizontal rule
    if (line.match(/^[-*_]{3,}$/)) {
      flushList()
      elements.push(<hr key={`hr-${i}`} className="my-4 border-border" />)
      continue
    }

    // Unordered list
    if (line.match(/^[-*+]\s/)) {
      if (listType !== "ul") {
        flushList()
        listType = "ul"
      }
      listItems.push(line.replace(/^[-*+]\s/, ""))
      continue
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      if (listType !== "ol") {
        flushList()
        listType = "ol"
      }
      listItems.push(line.replace(/^\d+\.\s/, ""))
      continue
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList()
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-primary/50 pl-4 my-2 italic text-muted-foreground">
          {parseInline(line.slice(2))}
        </blockquote>
      )
      continue
    }

    // Empty line
    if (line.trim() === "") {
      flushList()
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(<p key={`p-${i}`} className="my-2">{parseInline(line)}</p>)
  }

  // Flush any remaining items
  flushList()
  if (inCodeBlock && codeBlock.length > 0) {
    elements.push(
      <CodeBlock key={`code-${elements.length}`} code={codeBlock.join("\n")} language={codeLanguage} />
    )
  }

  return elements
}

function parseInline(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Inline code
    let match = remaining.match(/`([^`]+)`/)
    if (match && match.index !== undefined) {
      if (match.index > 0) {
        elements.push(parseInlineBasic(remaining.slice(0, match.index), key++))
      }
      elements.push(
        <code key={`ic-${key++}`} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
          {match[1]}
        </code>
      )
      remaining = remaining.slice(match.index + match[0].length)
      continue
    }

    // Bold
    match = remaining.match(/\*\*([^*]+)\*\*/)
    if (match && match.index !== undefined) {
      if (match.index > 0) {
        elements.push(parseInlineBasic(remaining.slice(0, match.index), key++))
      }
      elements.push(<strong key={`b-${key++}`}>{match[1]}</strong>)
      remaining = remaining.slice(match.index + match[0].length)
      continue
    }

    // Italic
    match = remaining.match(/\*([^*]+)\*/)
    if (match && match.index !== undefined) {
      if (match.index > 0) {
        elements.push(parseInlineBasic(remaining.slice(0, match.index), key++))
      }
      elements.push(<em key={`i-${key++}`}>{match[1]}</em>)
      remaining = remaining.slice(match.index + match[0].length)
      continue
    }

    // Link
    match = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (match && match.index !== undefined) {
      if (match.index > 0) {
        elements.push(parseInlineBasic(remaining.slice(0, match.index), key++))
      }
      elements.push(
        <a key={`a-${key++}`} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {match[1]}
        </a>
      )
      remaining = remaining.slice(match.index + match[0].length)
      continue
    }

    // No more matches, add remaining text
    elements.push(parseInlineBasic(remaining, key++))
    break
  }

  return elements
}

function parseInlineBasic(text: string, key: number): React.ReactNode {
  // Handle LaTeX math (basic support)
  if (text.includes("$$")) {
    const parts = text.split(/\$\$([^$]+)\$\$/)
    return (
      <span key={`t-${key}`}>
        {parts.map((part, i) => 
          i % 2 === 1 ? (
            <span key={i} className="font-mono bg-muted px-2 py-1 rounded text-sm">
              {part}
            </span>
          ) : part
        )}
      </span>
    )
  }
  return <span key={`t-${key}`}>{text}</span>
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto bg-muted/30">
        <code className="text-sm font-mono">{code}</code>
      </pre>
    </div>
  )
}
