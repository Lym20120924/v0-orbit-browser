"use client"

import { X, Type, Minus, Plus, BookOpen } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"

interface ReadingModeProps {
  isOpen: boolean
  onClose: () => void
  url: string
}

export function ReadingMode({ isOpen, onClose, url }: ReadingModeProps) {
  const { translate } = useBrowser()
  const [fontSize, setFontSize] = useState(18)
  const [fontFamily, setFontFamily] = useState("serif")

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  // 模拟提取的文章内容
  const articleContent = {
    title: "The Future of Web Browsers",
    author: "John Doe",
    date: "December 14, 2025",
    content: `
      Web browsers have come a long way since the early days of the internet. Today's browsers are sophisticated 
      applications that not only render web pages but also provide advanced features like developer tools, 
      extensions, and privacy protection.

      The future of web browsers lies in enhanced privacy, better performance, and seamless integration with 
      emerging technologies. Features like incognito mode, password managers, and developer tools have become 
      essential for modern browsing.

      As we move forward, browsers will continue to evolve, offering users more control over their online 
      experience while maintaining the simplicity and ease of use that made the web accessible to everyone.
    `,
  }

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{translate("readingMode")}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value)
                playSound("click")
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans-serif</option>
              <option value="mono">Monospace</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2">
            <button
              onClick={() => {
                setFontSize(Math.max(12, fontSize - 2))
                playSound("click")
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm text-foreground">{fontSize}px</span>
            <button
              onClick={() => {
                setFontSize(Math.min(32, fontSize + 2))
                playSound("click")
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article
          className={cn(
            "animate-fade-in-up",
            fontFamily === "serif" && "font-serif",
            fontFamily === "sans" && "font-sans",
            fontFamily === "mono" && "font-mono",
          )}
          style={{ fontSize: `${fontSize}px` }}
        >
          <h1 className="mb-4 text-4xl font-bold text-foreground leading-tight">{articleContent.title}</h1>
          <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {articleContent.author}</span>
            <span>•</span>
            <span>{articleContent.date}</span>
          </div>
          <div className="prose prose-lg max-w-none">
            {articleContent.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6 leading-relaxed text-foreground">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
