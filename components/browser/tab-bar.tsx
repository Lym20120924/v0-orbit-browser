"use client"

import type React from "react"
import { X, Plus } from "lucide-react"
import type { Tab } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"
import { playSound } from "@/lib/sounds"

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string
  onTabClick: (id: string) => void
  onTabClose: (id: string) => void
  onNewTab: () => void
  onReorderTabs: (fromIndex: number, toIndex: number) => void
}

export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onNewTab, onReorderTabs }: TabBarProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [closingTabId, setClosingTabId] = useState<string | null>(null)
  const [newTabAnimating, setNewTabAnimating] = useState<string | null>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    playSound("whoosh")
    if (dragRef.current) {
      e.dataTransfer.setDragImage(dragRef.current, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
      playSound("hover")
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorderTabs(draggedIndex, dragOverIndex)
      playSound("pop")
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    playSound("tabClose")
    setClosingTabId(tabId)
    setTimeout(() => {
      onTabClose(tabId)
      setClosingTabId(null)
    }, 200)
  }

  const handleNewTab = () => {
    playSound("tab")
    onNewTab()
    const newTabId = Date.now().toString()
    setNewTabAnimating(newTabId)
    setTimeout(() => setNewTabAnimating(null), 300)
  }

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTabId) {
      playSound("click")
      onTabClick(tabId)
    }
  }

  return (
    <div className="flex h-10 items-center gap-1 bg-secondary px-2 pt-2">
      <div ref={dragRef} className="fixed -left-[9999px] h-8 w-32 rounded-lg bg-primary/50" />

      <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-none">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={() => setDragOverIndex(null)}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "group relative flex h-8 min-w-[140px] max-w-[220px] cursor-pointer items-center gap-2 rounded-t-lg px-3",
              "transition-all duration-200 ease-out",
              activeTabId === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-[1.02]",
              draggedIndex === index && "opacity-50 scale-95",
              dragOverIndex === index && draggedIndex !== index && "border-l-2 border-primary",
              closingTabId === tab.id && "animate-tab-close",
              newTabAnimating === tab.id && "animate-tab-appear",
            )}
          >
            {tab.isLoading ? (
              <div className="relative h-4 w-4">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gradient-to-br from-primary/30 to-accent/30 text-[10px] font-bold text-primary",
                  "transition-transform duration-200 group-hover:scale-110 group-hover:animate-jello",
                )}
              >
                {tab.title.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="flex-1 truncate text-xs font-medium">{tab.title}</span>
            <button
              onClick={(e) => handleTabClose(e, tab.id)}
              onMouseEnter={() => playSound("hover")}
              className={cn(
                "rounded p-0.5 opacity-0 transition-all duration-200",
                "hover:bg-destructive/20 hover:text-destructive hover:scale-110",
                "group-hover:opacity-100",
                "active:scale-90",
              )}
            >
              <X className="h-3 w-3" />
            </button>
            {activeTabId === tab.id && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer bg-[length:200%_100%]" />
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleNewTab}
        onMouseEnter={() => playSound("hover")}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          "text-muted-foreground transition-all duration-200",
          "hover:bg-primary/20 hover:text-primary hover:scale-110 hover:rotate-90",
          "active:scale-90",
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
