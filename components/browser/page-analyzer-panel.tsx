"use client"

import { useState, useEffect } from "react"
import { X, Search, Zap, Eye, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import { analyzePage, type PageAnalysis } from "@/lib/page-analyzer"

interface PageAnalyzerPanelProps {
  isOpen: boolean
  onClose: () => void
  currentUrl: string
}

export function PageAnalyzerPanel({ isOpen, onClose, currentUrl }: PageAnalyzerPanelProps) {
  const { translate } = useBrowser()
  const [activeTab, setActiveTab] = useState<"seo" | "performance" | "accessibility">("seo")
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (isOpen && currentUrl && !currentUrl.startsWith("orbit://")) {
      handleAnalyze()
    }
  }, [isOpen, currentUrl])

  if (!isOpen) return null

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    playSound("whoosh")

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = analyzePage(currentUrl)
    setAnalysis(result)
    setIsAnalyzing(false)
    playSound("success")
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-accent"
    if (score >= 70) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-accent/10"
    if (score >= 70) return "bg-yellow-500/10"
    return "bg-destructive/10"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl animate-scale-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("pageAnalyzer")}</h2>
          </div>
          <button
            onClick={() => {
              playSound("click")
              onClose()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-border">
          {[
            { id: "seo" as const, label: "SEO", icon: Search },
            { id: "performance" as const, label: translate("performance"), icon: Zap },
            { id: "accessibility" as const, label: translate("accessibility"), icon: Eye },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playSound("tab")
                setActiveTab(tab.id)
              }}
              onMouseEnter={() => playSound("hover")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">{translate("analyzing")}...</p>
            </div>
          ) : analysis ? (
            <>
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-6">
                    <div>
                      <p className="text-sm text-muted-foreground">SEO {translate("score")}</p>
                      <p className={cn("text-3xl font-bold", getScoreColor(analysis.seo.score))}>
                        {analysis.seo.score}/100
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold",
                        getScoreBg(analysis.seo.score),
                        getScoreColor(analysis.seo.score),
                      )}
                    >
                      {analysis.seo.score}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {analysis.seo.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                        {issue.severity === "error" ? (
                          <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                        ) : issue.severity === "warning" ? (
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{issue.title}</p>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "performance" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {translate("performance")} {translate("score")}
                      </p>
                      <p className={cn("text-3xl font-bold", getScoreColor(analysis.performance.score))}>
                        {analysis.performance.score}/100
                      </p>
                    </div>
                    <Zap className={cn("h-12 w-12", getScoreColor(analysis.performance.score))} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {analysis.performance.metrics.map((metric, i) => (
                      <div key={i} className="rounded-lg border border-border p-4">
                        <p className="mb-1 text-xs text-muted-foreground">{metric.name}</p>
                        <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "accessibility" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {translate("accessibility")} {translate("score")}
                      </p>
                      <p className={cn("text-3xl font-bold", getScoreColor(analysis.accessibility.score))}>
                        {analysis.accessibility.score}/100
                      </p>
                    </div>
                    <Eye className={cn("h-12 w-12", getScoreColor(analysis.accessibility.score))} />
                  </div>

                  <div className="space-y-3">
                    {analysis.accessibility.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                        {issue.severity === "error" ? (
                          <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                        ) : issue.severity === "warning" ? (
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{issue.title}</p>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium text-foreground">{translate("noAnalysis")}</p>
              <p className="mb-6 text-sm text-muted-foreground">{translate("clickAnalyze")}</p>
              <button
                onClick={handleAnalyze}
                onMouseEnter={() => playSound("hover")}
                className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105"
              >
                {translate("analyze")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
