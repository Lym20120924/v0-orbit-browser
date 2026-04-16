// RSS2JSON API for parsing RSS feeds (free, no API key required)
const RSS2JSON_API = "https://api.rss2json.com/v1/api.json"

export interface RSSFeed {
  id: string
  url: string
  title: string
  description: string
  lastUpdated: number
  favicon?: string
  image?: string
  link?: string
  category: string
  itemCount: number
}

export interface RSSItem {
  id: string
  feedId: string
  title: string
  link: string
  description: string
  pubDate: number
  author?: string
  content?: string
  image?: string
  categories?: string[]
  read: boolean
  starred: boolean
}

export class RSSReader {
  private feeds: Map<string, RSSFeed> = new Map()
  private items: Map<string, RSSItem[]> = new Map()
  private initialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.loadData()
      this.initialized = true
    }
  }

  async addFeed(url: string, category = "General"): Promise<RSSFeed> {
    try {
      const { feed, items } = await this.fetchAndParseFeed(url)
      feed.category = category

      this.feeds.set(feed.id, feed)
      this.items.set(feed.id, items)
      this.saveData()

      return feed
    } catch (error) {
      console.error("[v0] RSS feed error:", error)
      throw new Error(`Failed to add RSS feed: ${error}`)
    }
  }

  async refreshFeed(feedId: string): Promise<RSSItem[]> {
    const feed = this.feeds.get(feedId)
    if (!feed) throw new Error("Feed not found")

    try {
      const { feed: updatedFeed, items } = await this.fetchAndParseFeed(feed.url)
      
      // Preserve read/starred status
      const existingItems = this.items.get(feedId) || []
      const existingMap = new Map(existingItems.map(i => [i.link, i]))
      
      const mergedItems = items.map(item => {
        const existing = existingMap.get(item.link)
        if (existing) {
          return { ...item, read: existing.read, starred: existing.starred }
        }
        return item
      })

      this.feeds.set(feedId, { ...updatedFeed, id: feedId, category: feed.category })
      this.items.set(feedId, mergedItems)
      this.saveData()

      return mergedItems
    } catch (error) {
      console.error("[v0] RSS refresh error:", error)
      throw error
    }
  }

  private async fetchAndParseFeed(url: string): Promise<{ feed: RSSFeed; items: RSSItem[] }> {
    // Use RSS2JSON API to parse the feed
    const apiUrl = `${RSS2JSON_API}?rss_url=${encodeURIComponent(url)}`
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== "ok") {
      throw new Error(data.message || "Invalid RSS feed")
    }

    const feedId = btoa(url).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)
    
    const feed: RSSFeed = {
      id: feedId,
      url,
      title: data.feed.title || "Untitled Feed",
      description: data.feed.description || "",
      link: data.feed.link || url,
      image: data.feed.image || undefined,
      lastUpdated: Date.now(),
      category: "General",
      itemCount: data.items?.length || 0,
    }

    // Extract favicon from feed link
    try {
      const feedUrl = new URL(data.feed.link || url)
      feed.favicon = `https://www.google.com/s2/favicons?domain=${feedUrl.hostname}&sz=32`
    } catch (e) {
      // Invalid URL, no favicon
    }

    const items: RSSItem[] = (data.items || []).map((item: any, index: number) => ({
      id: `${feedId}-${index}-${Date.now()}`,
      feedId,
      title: item.title || "Untitled",
      link: item.link || "",
      description: item.description || "",
      content: item.content || item.description || "",
      pubDate: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
      author: item.author || item.creator || undefined,
      image: item.enclosure?.link || item.thumbnail || this.extractImage(item.content || item.description) || undefined,
      categories: item.categories || [],
      read: false,
      starred: false,
    }))

    return { feed, items }
  }

  private extractImage(html: string): string | undefined {
    if (!html) return undefined
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
    return match ? match[1] : undefined
  }

  getFeeds(category?: string): RSSFeed[] {
    const feeds = Array.from(this.feeds.values())
    if (category) {
      return feeds.filter((f) => f.category === category)
    }
    return feeds
  }

  getItems(feedId?: string, unreadOnly = false): RSSItem[] {
    if (feedId) {
      const items = this.items.get(feedId) || []
      return unreadOnly ? items.filter((i) => !i.read) : items
    }

    const allItems: RSSItem[] = []
    for (const items of this.items.values()) {
      allItems.push(...items)
    }

    return unreadOnly ? allItems.filter((i) => !i.read) : allItems
  }

  markAsRead(itemId: string): void {
    for (const items of this.items.values()) {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        item.read = true
        this.saveData()
        break
      }
    }
  }

  toggleStar(itemId: string): void {
    for (const items of this.items.values()) {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        item.starred = !item.starred
        this.saveData()
        break
      }
    }
  }

  deleteFeed(feedId: string): void {
    this.feeds.delete(feedId)
    this.items.delete(feedId)
    this.saveData()
  }

  getCategories(): string[] {
    const categories = new Set<string>()
    for (const feed of this.feeds.values()) {
      categories.add(feed.category)
    }
    return Array.from(categories)
  }

  private saveData(): void {
    localStorage.setItem("orbit_rss_feeds", JSON.stringify(Array.from(this.feeds.entries())))
    localStorage.setItem("orbit_rss_items", JSON.stringify(Array.from(this.items.entries())))
  }

  private loadData(): void {
    const feedsData = localStorage.getItem("orbit_rss_feeds")
    const itemsData = localStorage.getItem("orbit_rss_items")

    if (feedsData) {
      this.feeds = new Map(JSON.parse(feedsData))
    }
    if (itemsData) {
      this.items = new Map(JSON.parse(itemsData))
    }
  }
}
