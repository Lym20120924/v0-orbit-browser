"use client"

import { useState } from "react"
import { X, Code2, Network, Terminal, Search, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import type { ConsoleLog, NetworkRequest } from "@/lib/developer-tools"
import { formatBytes, formatDuration } from "@/lib/developer-tools"

interface DevToolsPanelProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
}

export function DeveloperToolsPanel({ isOpen, onClose, currentUrl }: DevToolsPanelProps) {
  const { translate } = useBrowser()
  const [activeTab, setActiveTab] = useState<"console" | "network" | "elements">("console")
  const [searchTerm, setSearchTerm] = useState("")

  // 模拟数据
  const [consoleLogs] = useState<ConsoleLog[]>([
    { id: "1", type: "log", message: "Page loaded successfully", timestamp: new Date(), count: 1 },
    { id: "2", type: "info", message: `Navigated to ${currentUrl}`, timestamp: new Date(), count: 1 },
    { id: "3", type: "warn", message: "Resource loaded from cache", timestamp: new Date(), count: 2 },
    {
      id: "4",
      type: "error",
      message: "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT",
      timestamp: new Date(),
      count: 1,
    },
  ])

  const [networkRequests] = useState<NetworkRequest[]>([
    {
      id: "1",
      url: currentUrl,
      method: "GET",
      status: 200,
      type: "document",
      size: "24.5 KB",
      time: 156,
      timestamp: new Date(),
    },
    {
      id: "2",
      url: `${currentUrl}/style.css`,
      method: "GET",
      status: 200,
      type: "stylesheet",
      size: "8.2 KB",
      time: 45,
      timestamp: new Date(),
    },
    {
      id: "3",
      url: `${currentUrl}/script.js`,
      method: "GET",
      status: 200,
      type: "script",
      size: "32.1 KB",
      time: 89,
      timestamp: new Date(),
    },
    {
      id: "4",
      url: `${currentUrl}/image.jpg`,
      method: "GET",
      status: 404,
      type: "image",
      size: "0 B",
      time: 234,
      timestamp: new Date(),
    },
  ])

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-accent"
    if (status >= 300 && status < 400) return "text-primary"
    if (status >= 400) return "text-destructive"
    return "text-muted-foreground"
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return "❌"
      case "warn":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "📝"
    }
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col border-t border-border bg-card shadow-2xl animate-slide-up"
      style={{ height: "40vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{translate("developerTools")}</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-background p-0.5">
            {[
              { id: "console" as const, label: translate("console"), icon: Terminal },
              { id: "network" as const, label: translate("network"), icon: Network },
              { id: "elements" as const, label: translate("elements"), icon: Code2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playSound("click")
                  setActiveTab(tab.id)
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playSound("click")}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={translate("clearAll")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleClose}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "console" && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={translate("filterConsole")}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs scrollbar-thin">
              {consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-2 border-b border-border/50 px-2 py-1 hover:bg-secondary/50",
                    log.type === "error" && "bg-destructive/5 text-destructive",
                    log.type === "warn" && "bg-yellow-500/5 text-yellow-600",
                    log.type === "info" && "bg-primary/5 text-primary",
                  )}
                >
                  <span>{getLogIcon(log.type)}</span>
                  <span className="flex-1">{log.message}</span>
                  {log.count > 1 && <span className="rounded bg-muted px-1.5 text-[10px]">{log.count}</span>}
                  <span className="text-[10px] text-muted-foreground">{log.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "network" && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
              <div className="flex gap-4">
                <span className="text-muted-foreground">{networkRequests.length} requests</span>
                <span className="text-muted-foreground">
                  {formatBytes(networkRequests.reduce((acc, req) => acc + Number.parseFloat(req.size), 0))} transferred
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Method</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Size</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {networkRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="px-4 py-2 font-mono">
                        <div className="max-w-xs truncate">{request.url.split("/").pop() || request.url}</div>
                      </td>
                      <td className="px-4 py-2">{request.method}</td>
                      <td className={cn("px-4 py-2 font-medium", getStatusColor(request.status))}>{request.status}</td>
                      <td className="px-4 py-2 text-muted-foreground">{request.type}</td>
                      <td className="px-4 py-2 text-muted-foreground">{request.size}</td>
                      <td className="px-4 py-2 text-muted-foreground">{formatDuration(request.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "elements" && (
          <div className="flex h-full flex-col p-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4 font-mono text-xs">
              <div className="text-muted-foreground">
                <span className="text-primary">&lt;html</span>
                <span className="text-accent"> lang</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-yellow-600">"en"</span>
                <span className="text-primary">&gt;</span>
              </div>
              <div className="ml-4 text-muted-foreground">
                <span className="text-primary">&lt;head&gt;</span>
                <div className="ml-4">...</div>
                <span className="text-primary">&lt;/head&gt;</span>
              </div>
              <div className="ml-4 text-muted-foreground">
                <span className="text-primary">&lt;body</span>
                <span className="text-accent"> class</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-yellow-600">"bg-background"</span>
                <span className="text-primary">&gt;</span>
                <div className="ml-4">...</div>
                <span className="text-primary">&lt;/body&gt;</span>
              </div>
              <div className="text-muted-foreground">
                <span className="text-primary">&lt;/html&gt;</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">{translate("selectElementToInspect")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
