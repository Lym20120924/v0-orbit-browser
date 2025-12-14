"use client"

import { X, Download, CheckCircle, XCircle, Pause, FileText, Trash2 } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface DownloadsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function DownloadsPanel({ isOpen, onClose }: DownloadsPanelProps) {
  const { downloads, translate } = useBrowser()

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "downloading":
        return <Download className="h-4 w-4 animate-bounce text-primary" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent animate-bounce-in" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive animate-icon-shake" />
      case "paused":
        return <Pause className="h-4 w-4 text-muted-foreground" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary animate-float" />
            <h2 className="text-lg font-semibold text-foreground">{translate("downloads")}</h2>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => playSound("hover")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:scale-110 hover:rotate-90 active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin">
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <Download className="mb-4 h-16 w-16 text-muted-foreground/20 animate-float" />
              <p className="font-medium text-muted-foreground">{translate("noDownloadsYet")}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{translate("downloadsWillAppear")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((download, index) => (
                <div
                  key={download.id}
                  className={cn(
                    "rounded-xl border border-border bg-secondary/30 p-4",
                    "hover:border-primary/50 hover:shadow-lg transition-all hover:scale-[1.01]",
                    "animate-stagger-fade-in",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 animate-morph">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium text-foreground">{download.filename}</p>
                      <p className="text-sm text-muted-foreground">{download.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(download.status)}
                      <button
                        onClick={() => playSound("click")}
                        onMouseEnter={() => playSound("hover")}
                        className="rounded p-1 text-muted-foreground transition-all hover:bg-destructive/20 hover:text-destructive hover:scale-110 active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {download.status === "downloading" && (
                    <div className="space-y-1">
                      <div className="h-2 overflow-hidden rounded-full bg-muted relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all relative overflow-hidden"
                          style={{ width: `${download.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                      </div>
                      <p className="text-right text-xs text-muted-foreground">{Math.round(download.progress)}%</p>
                    </div>
                  )}

                  {download.status === "completed" && (
                    <p className="text-xs text-accent animate-fade-in">
                      Completed at {download.startedAt.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {downloads.length > 0 && (
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {downloads.filter((d) => d.status === "downloading").length} {translate("activeDownloads")}
              </span>
              <button
                onClick={() => playSound("click")}
                onMouseEnter={() => playSound("hover")}
                className="text-destructive transition-all hover:text-destructive/80 hover:scale-105 active:scale-95"
              >
                {translate("clearAll")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
