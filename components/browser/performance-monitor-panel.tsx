"use client"

import { X, Cpu, HardDrive, Wifi, Activity, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import { performanceMonitor, type PerformanceMetrics } from "@/lib/performance-monitor"

interface PerformanceMonitorPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function PerformanceMonitorPanel({ isOpen, onClose }: PerformanceMonitorPanelProps) {
  const { translate } = useBrowser()
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceMonitor.getMetrics())
  const [fpsHistory, setFpsHistory] = useState<number[]>([])

  useEffect(() => {
    if (!isOpen) return

    performanceMonitor.startMonitoring()

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics())
      setFpsHistory(performanceMonitor.getFPSHistory())
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const getColorForValue = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage < 50) return "text-green-500"
    if (percentage < 75) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {translate("performanceMonitor") || "Performance Monitor"}
            </h2>
          </div>
          <button
            onClick={() => {
              playSound("whoosh")
              onClose()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Main Metrics */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Cpu className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPU Usage</p>
                  <p className={cn("text-3xl font-bold", getColorForValue(metrics.cpu, 100))}>{metrics.cpu}%</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${metrics.cpu}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                  <HardDrive className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Memory</p>
                  <p className={cn("text-3xl font-bold", getColorForValue(metrics.memory, 100))}>{metrics.memory}%</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${metrics.memory}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Wifi className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-xl font-bold text-green-500">
                    {(metrics.network.download / 1000).toFixed(1)} KB/s
                  </p>
                  <p className="text-xs text-muted-foreground">↑ {(metrics.network.upload / 1000).toFixed(1)} KB/s</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">FPS</p>
                  <p className={cn("text-3xl font-bold", getColorForValue(60 - metrics.fps, 60))}>{metrics.fps}</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${(metrics.fps / 60) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* FPS Chart */}
          <div className="mb-6 rounded-xl border border-border bg-secondary/50 p-6">
            <h3 className="mb-4 font-semibold text-foreground">FPS History</h3>
            <div className="flex h-32 items-end gap-1">
              {fpsHistory.map((fps, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-gradient-to-t from-yellow-500 to-yellow-300 transition-all"
                  style={{ height: `${(fps / 60) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Page Load Metrics */}
          <div className="rounded-xl border border-border bg-secondary/50 p-6">
            <h3 className="mb-4 font-semibold text-foreground">Page Load Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Load Time</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{(metrics.pageLoadTime / 1000).toFixed(2)}s</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DOM Content Loaded</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {(metrics.domContentLoaded / 1000).toFixed(2)}s
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Contentful Paint</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {(metrics.firstContentfulPaint / 1000).toFixed(2)}s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
