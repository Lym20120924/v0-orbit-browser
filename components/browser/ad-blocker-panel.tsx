"use client"

import { X, Shield, Plus, Trash2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import {
  type AdBlockRule,
  getAdBlockRules,
  saveAdBlockRules,
  getBlockedAdsToday,
  clearBlockedAds,
} from "@/lib/ad-blocker"

interface AdBlockerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdBlockerPanel({ isOpen, onClose }: AdBlockerPanelProps) {
  const { translate } = useBrowser()
  const [rules, setRules] = useState<AdBlockRule[]>(getAdBlockRules())
  const [blockedToday] = useState(getBlockedAdsToday())
  const [newPattern, setNewPattern] = useState("")
  const [newType, setNewType] = useState<"url" | "selector" | "domain">("url")

  if (!isOpen) return null

  const handleAddRule = () => {
    if (!newPattern.trim()) return

    const newRule: AdBlockRule = {
      id: Date.now().toString(),
      pattern: newPattern,
      type: newType,
      action: newType === "selector" ? "hide" : "block",
    }

    const updated = [...rules, newRule]
    setRules(updated)
    saveAdBlockRules(updated)
    setNewPattern("")
    playSound("success")
  }

  const handleRemoveRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id)
    setRules(updated)
    saveAdBlockRules(updated)
    playSound("pop")
  }

  const handleClearStats = () => {
    clearBlockedAds()
    playSound("whoosh")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("adBlocker") || "Ad Blocker"}</h2>
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

        {/* Stats */}
        <div className="border-b border-border bg-primary/5 p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{translate("blockedToday") || "Blocked Today"}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{blockedToday}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{translate("activeRules") || "Active Rules"}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{rules.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{translate("status") || "Status"}</p>
              <p className="mt-2 text-lg font-semibold text-green-500">{translate("enabled") || "Enabled"}</p>
            </div>
          </div>
        </div>

        {/* Add New Rule */}
        <div className="border-b border-border p-6">
          <h3 className="mb-4 font-semibold text-foreground">{translate("addNewRule") || "Add New Rule"}</h3>
          <div className="flex gap-3">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="url">URL Pattern</option>
              <option value="domain">Domain</option>
              <option value="selector">CSS Selector</option>
            </select>
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder={newType === "url" ? "/ads/" : newType === "domain" ? "example.com" : ".ad-container"}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleAddRule}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{translate("blockingRules") || "Blocking Rules"}</h3>
            <button onClick={handleClearStats} className="text-sm text-muted-foreground hover:text-foreground">
              {translate("clearStatistics") || "Clear Statistics"}
            </button>
          </div>
          <div className="space-y-2">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-3 animate-stagger-fade-in hover:border-primary/50 transition-all"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                {rule.action === "block" ? (
                  <EyeOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Eye className="h-4 w-4 text-yellow-500" />
                )}
                <div className="flex-1">
                  <code className="text-sm text-foreground">{rule.pattern}</code>
                  <p className="text-xs text-muted-foreground capitalize">
                    {rule.type} • {rule.action}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveRule(rule.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
