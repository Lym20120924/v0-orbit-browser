"use client"

import { useState } from "react"
import { X, Terminal, Network, Box, Database, Gauge, Shield, Trash2 } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface DevToolsProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
}

type Tab = "console" | "network" | "elements" | "storage" | "performance" | "security"

export function DevTools({ isOpen, onClose, currentUrl }: DevToolsProps) {
  const { translate } = useBrowser()
  const [activeTab, setActiveTab] = useState<Tab>("console")
  const [consoleLogs, setConsoleLogs] = useState([
    { type: "info", message: "Orbit Browser DevTools initialized", time: new Date() },
    { type: "log", message: `Current URL: ${currentUrl}`, time: new Date() },
  ])

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const handleClearConsole = () => {
    playSound("click")
    setConsoleLogs([])
  }

  const tabs = [
    { id: "console" as Tab, label: translate("console"), icon: Terminal },
    { id: "network" as Tab, label: translate("network"), icon: Network },
    { id: "elements" as Tab, label: translate("elements"), icon: Box },
    { id: "storage" as Tab, label: translate("storage"), icon: Database },
    { id: "performance" as Tab, label: translate("performance"), icon: Gauge },
    { id: "security" as Tab, label: translate("security"), icon: Shield },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[40vh] flex-col border-t border-border bg-card shadow-2xl animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-foreground">{translate("devTools")}</h3>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playSound("tab")
                  setActiveTab(tab.id)
                }}
                onMouseEnter={() => playSound("hover")}
                className={cn(
                  "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleClose}
          onMouseEnter={() => playSound("hover")}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground hover:rotate-90"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs">
        {activeTab === "console" && (
          <div className="space-y-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground">Console Output</span>
              <button
                onClick={handleClearConsole}
                onMouseEnter={() => playSound("hover")}
                className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" />
                {translate("clearConsole")}
              </button>
            </div>
            {consoleLogs.map((log, index) => (
              <div key={index} className="flex gap-2 rounded border-l-2 border-blue-500 bg-secondary/30 px-2 py-1">
                <span className="text-muted-foreground">{log.time.toLocaleTimeString()}</span>
                <span className={cn(log.type === "info" ? "text-blue-400" : "text-foreground")}>{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "network" && (
          <div className="space-y-2">
            <div className="text-muted-foreground">Network Activity</div>
            <div className="rounded border border-border bg-secondary/30 p-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-green-400">GET</span>
                <span className="text-muted-foreground">{currentUrl}</span>
                <span className="text-accent">200 OK</span>
              </div>
              <div className="text-muted-foreground">Status: Loaded • Size: 2.4 MB • Time: 1.2s</div>
            </div>
          </div>
        )}

        {activeTab === "elements" && (
          <div className="space-y-1 text-muted-foreground">
            <div>{"<html>"}</div>
            <div className="pl-4">{"<head>"}</div>
            <div className="pl-8">{"<title>Current Page</title>"}</div>
            <div className="pl-4">{"</head>"}</div>
            <div className="pl-4">{"<body>"}</div>
            <div className="pl-8 text-primary">{'<iframe src="' + currentUrl + '" />'}</div>
            <div className="pl-4">{"</body>"}</div>
            <div>{"</html>"}</div>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-2">
            <div className="text-muted-foreground">Local Storage, Cookies, IndexedDB</div>
            <div className="rounded border border-border bg-secondary/30 p-3">
              <div className="mb-2 text-xs font-semibold">Local Storage:</div>
              <div className="text-muted-foreground">orbit_settings: &#123;...&#125;</div>
              <div className="text-muted-foreground">orbit_bookmarks: [...]</div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-2">
            <div className="text-muted-foreground">Performance Metrics</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-border bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">Load Time</div>
                <div className="text-xl font-bold text-accent">1.2s</div>
              </div>
              <div className="rounded border border-border bg-secondary/30 p-3">
                <div className="text-xs text-muted-foreground">DOM Content Loaded</div>
                <div className="text-xl font-bold text-primary">0.8s</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-2">
            <div className="text-muted-foreground">Security Status</div>
            <div className="rounded border border-green-500/30 bg-green-500/10 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="font-semibold text-green-400">Secure Connection</span>
              </div>
              <div className="text-xs text-muted-foreground">HTTPS enabled, no security warnings</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
