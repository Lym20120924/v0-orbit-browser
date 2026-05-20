export interface SmartBookmark {
  id: string
  url: string
  title: string
  description?: string
  tags: string[]
  notes: string
  favicon?: string
  screenshot?: string
  collections: string[]
  visitCount: number
  lastVisited: number
  createdAt: number
  rating: number
}

export interface BookmarkCollection {
  id: string
  name: string
  description: string
  icon: string
  color: string
  bookmarkIds: string[]
  createdAt: number
}

export class SmartBookmarkManager {
  private bookmarks: Map<string, SmartBookmark> = new Map()
  private collections: Map<string, BookmarkCollection> = new Map()

  constructor() {
    this.loadData()
  }

  addBookmark(url: string, title: string, tags: string[] = [], notes = ""): SmartBookmark {
    const bookmark: SmartBookmark = {
      id: Date.now().toString() + Math.random().toString(36),
      url,
      title,
      tags,
      notes,
      collections: [],
      visitCount: 0,
      lastVisited: Date.now(),
      createdAt: Date.now(),
      rating: 0,
    }

    this.bookmarks.set(bookmark.id, bookmark)
    this.saveData()

    return bookmark
  }

  getBookmarks(options?: {
    tags?: string[]
    collections?: string[]
    search?: string
    sortBy?: "created" | "visited" | "rating"
  }): SmartBookmark[] {
    let bookmarks = Array.from(this.bookmarks.values())

    if (options?.tags && options.tags.length > 0) {
      bookmarks = bookmarks.filter((b) => options.tags!.some((tag) => b.tags.includes(tag)))
    }

    if (options?.collections && options.collections.length > 0) {
      bookmarks = bookmarks.filter((b) => options.collections!.some((col) => b.collections.includes(col)))
    }

    if (options?.search) {
      const searchLower = options.search.toLowerCase()
      bookmarks = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.url.toLowerCase().includes(searchLower) ||
          b.notes.toLowerCase().includes(searchLower),
      )
    }

    if (options?.sortBy === "visited") {
      bookmarks.sort((a, b) => b.lastVisited - a.lastVisited)
    } else if (options?.sortBy === "rating") {
      bookmarks.sort((a, b) => b.rating - a.rating)
    } else {
      bookmarks.sort((a, b) => b.createdAt - a.createdAt)
    }

    return bookmarks
  }

  updateBookmark(id: string, updates: Partial<SmartBookmark>): void {
    const bookmark = this.bookmarks.get(id)
    if (bookmark) {
      Object.assign(bookmark, updates)
      this.saveData()
    }
  }

  deleteBookmark(id: string): void {
    this.bookmarks.delete(id)
    this.saveData()
  }

  createCollection(name: string, icon = "📁", color = "#6366f1"): BookmarkCollection {
    const collection: BookmarkCollection = {
      id: Date.now().toString() + Math.random().toString(36),
      name,
      description: "",
      icon,
      color,
      bookmarkIds: [],
      createdAt: Date.now(),
    }

    this.collections.set(collection.id, collection)
    this.saveData()

    return collection
  }

  getCollections(): BookmarkCollection[] {
    return Array.from(this.collections.values())
  }

  addToCollection(bookmarkId: string, collectionId: string): void {
    const bookmark = this.bookmarks.get(bookmarkId)
    const collection = this.collections.get(collectionId)

    if (bookmark && collection) {
      if (!bookmark.collections.includes(collectionId)) {
        bookmark.collections.push(collectionId)
      }
      if (!collection.bookmarkIds.includes(bookmarkId)) {
        collection.bookmarkIds.push(bookmarkId)
      }
      this.saveData()
    }
  }

  getAllTags(): string[] {
    const tags = new Set<string>()
    for (const bookmark of this.bookmarks.values()) {
      bookmark.tags.forEach((tag) => tags.add(tag))
    }
    return Array.from(tags).sort()
  }

  private saveData(): void {
    localStorage.setItem("orbit_smart_bookmarks", JSON.stringify(Array.from(this.bookmarks.entries())))
    localStorage.setItem("orbit_bookmark_collections", JSON.stringify(Array.from(this.collections.entries())))
  }

  private loadData(): void {
    const bookmarksData = localStorage.getItem("orbit_smart_bookmarks")
    const collectionsData = localStorage.getItem("orbit_bookmark_collections")

    if (bookmarksData) {
      this.bookmarks = new Map(JSON.parse(bookmarksData))
    }
    if (collectionsData) {
      this.collections = new Map(JSON.parse(collectionsData))
    }
  }

  exportBookmarks(): string {
    return JSON.stringify(
      {
        bookmarks: Array.from(this.bookmarks.entries()),
        collections: Array.from(this.collections.entries()),
      },
      null,
      2,
    )
  }

  importBookmarks(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)
      this.bookmarks = new Map(data.bookmarks)
      this.collections = new Map(data.collections)
      this.saveData()
    } catch (error) {
      console.error("Failed to import bookmarks:", error)
    }
  }
}
