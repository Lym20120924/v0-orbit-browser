"use client"

import { useState } from "react"
import { X, BookOpen, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface ReaderModeProps {
  isOpen: boolean
  onClose: () => void
  content: string
}

export function ReaderMode({ isOpen, onClose, content }: ReaderModeProps) {
  const { translate } = useBrowser()
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState<"serif" | "sans" | "mono">("serif")
  const [lineHeight, setLineHeight] = useState(1.6)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left")
  const [bgColor, setBgColor] = useState<"white" | "sepia" | "dark">("sepia")

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const fonts = [
    { value: "serif", label: "Serif", class: "font-serif" },
    { value: "sans", label: "Sans", class: "font-sans" },
    { value: "mono", label: "Mono", class: "font-mono" },
  ] as const

  const alignments = [
    { value: "left", icon: AlignLeft },
    { value: "center", icon: AlignCenter },
    { value: "right", icon: AlignRight },
    { value: "justify", icon: AlignJustify },
  ] as const

  const backgrounds = [
    { value: "white", label: "White", class: "bg-white text-gray-900" },
    { value: "sepia", label: "Sepia", class: "bg-amber-50 text-amber-950" },
    { value: "dark", label: "Dark", class: "bg-gray-900 text-gray-100" },
  ] as const

  const currentBg = backgrounds.find((b) => b.value === bgColor)

  return (
    <div className="fixed inset-0 z-50 flex bg-background/95 backdrop-blur-sm animate-backdrop-fade">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4 animate-slide-in-left">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">{translate("readerMode")}</h2>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => playSound("hover")}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="h-4 w-4" />
              {translate("fontSize")}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound("click")
                  setFontSize((s) => Math.max(12, s - 2))
                }}
                onMouseEnter={() => playSound("hover")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-all hover:bg-secondary/70"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm text-muted-foreground">{fontSize}px</span>
              <button
                onClick={() => {
                  playSound("click")
                  setFontSize((s) => Math.min(24, s + 2))
                }}
                onMouseEnter={() => playSound("hover")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-all hover:bg-secondary/70"
              >
                +
              </button>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="mb-2 text-sm font-medium text-foreground">{translate("fontFamily")}</label>
            <div className="flex gap-2">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => {
                    playSound("click")
                    setFontFamily(font.value)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm transition-all",
                    fontFamily === font.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="mb-2 text-sm font-medium text-foreground">{translate("lineHeight")}</label>
            <input
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={lineHeight}
              onChange={(e) => {
                playSound("hover")
                setLineHeight(Number.parseFloat(e.target.value))
              }}
              className="w-full"
            />
            <div className="text-center text-sm text-muted-foreground">{lineHeight.toFixed(1)}</div>
          </div>

          {/* Text Align */}
          <div>
            <label className="mb-2 text-sm font-medium text-foreground">{translate("textAlign")}</label>
            <div className="grid grid-cols-4 gap-1">
              {alignments.map((align) => (
                <button
                  key={align.value}
                  onClick={() => {
                    playSound("click")
                    setTextAlign(align.value)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg border transition-all",
                    textAlign === align.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50",
                  )}
                >
                  <align.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="mb-2 text-sm font-medium text-foreground">{translate("backgroundColor")}</label>
            <div className="flex gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => {
                    playSound("click")
                    setBgColor(bg.value)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm transition-all",
                    bgColor === bg.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className={cn("mx-auto max-w-3xl rounded-2xl p-12 shadow-xl transition-all", currentBg?.class)}>
          <div
            className={cn(fonts.find((f) => f.value === fontFamily)?.class)}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              textAlign,
            }}
          >
            <h1 className="mb-6 text-3xl font-bold">Sample Article Title</h1>
            <p className="mb-4">
              This is reader mode. The content is optimized for comfortable reading with adjustable font size, typeface,
              line height, and colors.
            </p>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
