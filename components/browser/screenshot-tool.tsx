"use client"

import { useState } from "react"
import { X, Camera, Monitor, Maximize, MousePointer, Download, Copy, Check } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface ScreenshotToolProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
}

export function ScreenshotTool({ isOpen, onClose, currentUrl }: ScreenshotToolProps) {
  const { translate } = useBrowser()
  const [captureMode, setCaptureMode] = useState<"visible" | "fullpage" | "selection">("visible")
  const [captured, setCaptured] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const handleCapture = () => {
    playSound("success")
    setCaptured(true)
    setTimeout(() => setCaptured(false), 3000)
  }

  const handleCopy = () => {
    playSound("success")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    playSound("click")
  }

  const modes = [
    { id: "visible", label: translate("captureVisible"), icon: Monitor },
    { id: "fullpage", label: translate("captureFullPage"), icon: Maximize },
    { id: "selection", label: translate("captureSelection"), icon: MousePointer },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("screenshot")}</h2>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => playSound("hover")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">{translate("captureMode") || "Capture Mode"}</h3>
            <div className="space-y-2">
              {modes.map((mode, index) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    playSound("click")
                    setCaptureMode(mode.id)
                  }}
                  onMouseEnter={() => playSound("hover")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 transition-all hover:scale-[1.02]",
                    captureMode === mode.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <mode.icon className="h-5 w-5" />
                  <span className="font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {captured && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 animate-scale-in">
              <div className="mb-3 flex items-center gap-2 text-green-400">
                <Check className="h-5 w-5" />
                <span className="font-medium">Screenshot captured!</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  onMouseEnter={() => playSound("hover")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-background px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {translate("copyToClipboard")}
                </button>
                <button
                  onClick={handleDownload}
                  onMouseEnter={() => playSound("hover")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  {translate("downloadImage")}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleCapture}
            onMouseEnter={() => playSound("hover")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            <Camera className="h-5 w-5" />
            {translate("captureScreen") || "Capture Screenshot"}
          </button>
        </div>
      </div>
    </div>
  )
}
