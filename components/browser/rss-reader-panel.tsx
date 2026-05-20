"use client"

import { useState, useEffect } from "react"
import { Rss, Plus, Star, Check, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RSSReader, type RSSFeed, type RSSItem } from "@/lib/rss-reader"
import { playSound } from "@/lib/sounds"
import { useLanguage } from "@/lib/i18n"

const rssReader = new RSSReader()

interface RSSReaderPanelProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (url: string) => void
}

export function RSSReaderPanel({ isOpen, onClose, onNavigate }: RSSReaderPanelProps) {
  const { t } = useLanguage()
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [items, setItems] = useState<RSSItem[]>([])
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null)
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadFeeds()
    }
  }, [isOpen])

  const loadFeeds = () => {
    const allFeeds = rssReader.getFeeds()
    setFeeds(allFeeds)
    if (allFeeds.length > 0 && !selectedFeed) {
      selectFeed(allFeeds[0].id)
    }
  }

  const selectFeed = (feedId: string | null) => {
    setSelectedFeed(feedId)
    const feedItems = rssReader.getItems(feedId || undefined, showUnreadOnly)
    setItems(feedItems)
  }

  const addFeed = async () => {
    if (newFeedUrl.trim()) {
      try {
        await rssReader.addFeed(newFeedUrl, "General")
        setNewFeedUrl("")
        loadFeeds()
        playSound("success")
      } catch (error) {
        playSound("error")
      }
    }
  }

  const markAsRead = (itemId: string) => {
    rssReader.markAsRead(itemId)
    selectFeed(selectedFeed)
    playSound("click")
  }

  const toggleStar = (itemId: string) => {
    rssReader.toggleStar(itemId)
    selectFeed(selectedFeed)
    playSound("pop")
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-4 top-16 w-[800px] h-[600px] bg-background border border-border rounded-lg shadow-2xl z-50 flex animate-slide-in-right">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Rss className="w-5 h-5" />
            <h3 className="font-semibold">{t("rssReader")}</h3>
          </div>
          <div className="flex gap-2">
            <Input
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="Feed URL"
              className="text-sm"
            />
            <Button size="sm" onClick={addFeed}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <Button
            variant={selectedFeed === null ? "default" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => selectFeed(null)}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            {t("allFeeds")}
          </Button>

          {feeds.map((feed) => (
            <Button
              key={feed.id}
              variant={selectedFeed === feed.id ? "default" : "ghost"}
              className="w-full justify-start mb-1 animate-fade-in"
              onClick={() => selectFeed(feed.id)}
            >
              {feed.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h4 className="font-medium">
            {items.length} {t("articles")}
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowUnreadOnly(!showUnreadOnly)
              selectFeed(selectedFeed)
            }}
          >
            {showUnreadOnly ? t("showAll") : t("unreadOnly")}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all animate-fade-in hover:shadow-md cursor-pointer ${
                item.read ? "bg-muted/50" : "bg-background"
              }`}
              onClick={() => {
                onNavigate(item.link)
                markAsRead(item.id)
              }}
            >
              <div className="flex justify-between items-start gap-2">
                <h5 className={`font-medium flex-1 ${item.read ? "text-muted-foreground" : ""}`}>{item.title}</h5>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(item.id)
                    }}
                  >
                    <Star className={`w-4 h-4 ${item.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  {!item.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(item.id)
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(item.pubDate).toLocaleDateString()}</p>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Rss className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>{t("noArticles")}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            {t("close")}
          </Button>
        </div>
      </div>
    </div>
  )
}
