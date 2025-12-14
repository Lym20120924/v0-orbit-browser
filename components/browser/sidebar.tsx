"use client"

import { Star, Clock, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Bookmark as BookmarkType } from "../orbit-browser"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"

interface SidebarProps {
  isOpen: boolean
  bookmarks: BookmarkType[]
  history: { title: string; url: string; time: Date }[]
  onNavigate: (url: string) => void
  onRemoveBookmark: (id: string) => void
  onClearHistory: () => void
}

export function Sidebar({ isOpen, bookmarks, history, onNavigate, onRemoveBookmark, onClearHistory }: SidebarProps) {
  const { translate } = useBrowser()
  const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks")
  const [removingId, setRemovingId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleRemoveBookmark = (id: string) => {
    playSound("tabClose")
    setRemovingId(id)
    setTimeout(() => {
      onRemoveBookmark(id)
      setRemovingId(null)
    }, 200)
  }

  const handleTabSwitch = (tab: "bookmarks" | "history") => {
    if (tab !== activeTab) {
      playSound("click")
      setActiveTab(tab)
    }
  }

  const handleNavigate = (url: string) => {
    playSound("click")
    onNavigate(url)
  }

  const handleClearHistory = () => {
    playSound("tabClose")
    onClearHistory()
  }

  const groupedHistory = history.reduce(
    (acc, item) => {
      const dateKey = item.time.toLocaleDateString()
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(item)
      return acc
    },
    {} as Record<string, typeof history>,
  )

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card animate-slide-in-left">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-border">
        {["bookmarks", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabSwitch(tab as "bookmarks" | "history")}
            onMouseEnter={() => playSound("hover")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200",
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            )}
          >
            {tab === "bookmarks" ? (
              <Star
                className={cn("h-4 w-4 transition-all duration-200", activeTab === tab && "scale-110 animate-swing")}
              />
            ) : (
              <Clock
                className={cn(
                  "h-4 w-4 transition-all duration-200",
                  activeTab === tab && "scale-110 animate-icon-spin",
                )}
              />
            )}
            {translate(tab)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {activeTab === "bookmarks" ? (
          <div className="space-y-1">
            {bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                <Star className="mb-3 h-10 w-10 text-muted-foreground/30 animate-float" />
                <p className="text-sm text-muted-foreground">{translate("noBookmarksYet")}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{translate("clickStarToSave")}</p>
              </div>
            ) : (
              bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg p-2 transition-all duration-200",
                    "hover:bg-secondary hover:scale-[1.02] hover:shadow-md",
                    "animate-stagger-fade-in",
                    removingId === bookmark.id && "opacity-0 scale-95 translate-x-4",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      "bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-bold text-primary",
                      "transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 group-hover:animate-jello",
                    )}
                  >
                    {bookmark.title.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleNavigate(bookmark.url)}
                    onMouseEnter={() => playSound("hover")}
                    className="flex-1 overflow-hidden text-left"
                  >
                    <p className="truncate text-sm font-medium text-foreground">{bookmark.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{bookmark.url.replace(/^https?:\/\//, "")}</p>
                  </button>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    onMouseEnter={() => playSound("hover")}
                    className={cn(
                      "rounded p-1.5 opacity-0 transition-all duration-200",
                      "hover:bg-destructive/20 hover:scale-110",
                      "group-hover:opacity-100 active:scale-90",
                    )}
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                <Clock className="mb-3 h-10 w-10 text-muted-foreground/30 animate-float" />
                <p className="text-sm text-muted-foreground">{translate("noHistoryYet")}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{translate("browsingHistoryHere")}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between animate-fade-in">
                  <span className="text-xs font-medium text-muted-foreground">{translate("recentHistory")}</span>
                  <button
                    onClick={handleClearHistory}
                    onMouseEnter={() => playSound("hover")}
                    className={cn(
                      "flex items-center gap-1 rounded px-2 py-1 text-xs text-destructive",
                      "transition-all duration-200 hover:bg-destructive/20 hover:scale-105 active:scale-95",
                    )}
                  >
                    <Trash2 className="h-3 w-3" />
                    {translate("clear")}
                  </button>
                </div>
                {Object.entries(groupedHistory).map(([date, items], groupIndex) => (
                  <div
                    key={date}
                    className="animate-stagger-fade-in"
                    style={{ animationDelay: `${groupIndex * 0.1}s` }}
                  >
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{date}</p>
                    <div className="space-y-1">
                      {items.map((item, index) => (
                        <button
                          key={`${item.url}-${index}`}
                          onClick={() => handleNavigate(item.url)}
                          onMouseEnter={() => playSound("hover")}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg p-2 text-left",
                            "transition-all duration-200 hover:bg-secondary hover:scale-[1.02] hover:shadow-md",
                            "animate-stagger-fade-in",
                          )}
                          style={{ animationDelay: `${(groupIndex * items.length + index) * 0.03}s` }}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm text-foreground">{item.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
