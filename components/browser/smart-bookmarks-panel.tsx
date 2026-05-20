"use client"

import { useState } from "react"
import { X, Star, Plus, Trash2, Tag, Folder, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import type { SmartBookmark, BookmarkCollection } from "@/lib/smart-bookmarks"
import { playSound } from "@/lib/sounds"

interface SmartBookmarksPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SmartBookmarksPanel({ isOpen, onClose }: SmartBookmarksPanelProps) {
  const { t: translate } = useLanguage()
  const [bookmarks, setBookmarks] = useState<SmartBookmark[]>([
    {
      id: "1",
      title: "GitHub",
      url: "https://github.com",
      tags: ["dev", "code"],
      note: "Code repository",
      collection: "Development",
      favicon: "",
      createdAt: new Date(),
      lastVisited: new Date(),
    },
  ])
  const [collections, setCollections] = useState<BookmarkCollection[]>([
    { id: "1", name: "Development", color: "#3b82f6", bookmarkIds: ["1"] },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  if (!isOpen) return null

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCollection = !selectedCollection || bookmark.collection === selectedCollection

    return matchesSearch && matchesCollection
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl animate-scale-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("smartBookmarks")}</h2>
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

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-4">
            <button
              onClick={() => {
                playSound("pop")
                setSelectedCollection(null)
              }}
              onMouseEnter={() => playSound("hover")}
              className={cn(
                "mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                !selectedCollection ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary",
              )}
            >
              <Star className="h-4 w-4" />
              {translate("allBookmarks")} ({bookmarks.length})
            </button>

            <div className="mb-2 mt-4 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-muted-foreground">{translate("collections")}</span>
              <button
                onClick={() => playSound("pop")}
                onMouseEnter={() => playSound("hover")}
                className="text-primary hover:text-primary/80"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => {
                  playSound("click")
                  setSelectedCollection(collection.name)
                }}
                onMouseEnter={() => playSound("hover")}
                className={cn(
                  "mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  selectedCollection === collection.name
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: collection.color }} />
                <span className="flex-1 truncate">{collection.name}</span>
                <span className="text-xs text-muted-foreground">({collection.bookmarkIds.length})</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={translate("searchBookmarks")}
                  className="w-full rounded-xl border border-border bg-secondary py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => playSound("pop")}
                onMouseEnter={() => playSound("hover")}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                {translate("addBookmark")}
              </button>
            </div>

            <div className="grid gap-4">
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group rounded-xl border border-border p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/30"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{bookmark.title}</h3>
                      <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                    </div>
                    <button
                      onClick={() => playSound("click")}
                      onMouseEnter={() => playSound("hover")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {bookmark.note && <p className="mb-2 text-sm text-muted-foreground">{bookmark.note}</p>}

                  <div className="flex flex-wrap gap-2">
                    {bookmark.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {bookmark.collection && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">
                        <Folder className="h-3 w-3" />
                        {bookmark.collection}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
