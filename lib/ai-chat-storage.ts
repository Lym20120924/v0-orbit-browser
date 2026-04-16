"use client"

// IndexedDB-based chat storage for persistence

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  feedback?: "like" | "dislike"
  edited?: boolean
  tokens?: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  modelId: string
  systemPrompt?: string
  pinned?: boolean
}

export interface ChatSettings {
  contextLength: number
  temperature: number
  maxTokens: number
  systemPrompt: string
  theme: "light" | "dark" | "system"
  language: "zh" | "en"
  streamingEnabled: boolean
  soundEnabled: boolean
}

const DB_NAME = "OrbitAIChat"
const DB_VERSION = 1
const CONVERSATIONS_STORE = "conversations"
const SETTINGS_STORE = "settings"

let db: IDBDatabase | null = null

async function openDB(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains(CONVERSATIONS_STORE)) {
        const store = database.createObjectStore(CONVERSATIONS_STORE, { keyPath: "id" })
        store.createIndex("updatedAt", "updatedAt", { unique: false })
        store.createIndex("title", "title", { unique: false })
      }

      if (!database.objectStoreNames.contains(SETTINGS_STORE)) {
        database.createObjectStore(SETTINGS_STORE, { keyPath: "key" })
      }
    }
  })
}

// Conversation Operations
export async function saveConversation(conversation: Conversation): Promise<void> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONVERSATIONS_STORE], "readwrite")
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.put(conversation)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONVERSATIONS_STORE], "readonly")
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.get(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

export async function getAllConversations(): Promise<Conversation[]> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONVERSATIONS_STORE], "readonly")
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const index = store.index("updatedAt")
    const request = index.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const conversations = request.result || []
      // Sort by pinned first, then by updatedAt descending
      conversations.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.updatedAt - a.updatedAt
      })
      resolve(conversations)
    }
  })
}

export async function deleteConversation(id: string): Promise<void> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONVERSATIONS_STORE], "readwrite")
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function clearAllConversations(): Promise<void> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([CONVERSATIONS_STORE], "readwrite")
    const store = transaction.objectStore(CONVERSATIONS_STORE)
    const request = store.clear()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function searchConversations(query: string): Promise<Conversation[]> {
  const conversations = await getAllConversations()
  const lowerQuery = query.toLowerCase()
  return conversations.filter(conv => 
    conv.title.toLowerCase().includes(lowerQuery) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(lowerQuery))
  )
}

// Settings Operations
export async function saveSettings(settings: ChatSettings): Promise<void> {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([SETTINGS_STORE], "readwrite")
    const store = transaction.objectStore(SETTINGS_STORE)
    const request = store.put({ key: "chatSettings", ...settings })
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getSettings(): Promise<ChatSettings> {
  const defaultSettings: ChatSettings = {
    contextLength: 10,
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: "You are Orbit AI, a helpful assistant. Answer in the same language as the user.",
    theme: "system",
    language: "zh",
    streamingEnabled: true,
    soundEnabled: true,
  }

  try {
    const database = await openDB()
    return new Promise((resolve) => {
      const transaction = database.transaction([SETTINGS_STORE], "readonly")
      const store = transaction.objectStore(SETTINGS_STORE)
      const request = store.get("chatSettings")
      request.onerror = () => resolve(defaultSettings)
      request.onsuccess = () => {
        if (request.result) {
          const { key, ...settings } = request.result
          resolve({ ...defaultSettings, ...settings })
        } else {
          resolve(defaultSettings)
        }
      }
    })
  } catch {
    return defaultSettings
  }
}

// Export/Import Functions
export function exportConversation(conversation: Conversation, format: "json" | "markdown" | "txt"): string {
  switch (format) {
    case "json":
      return JSON.stringify(conversation, null, 2)
    
    case "markdown":
      let md = `# ${conversation.title}\n\n`
      md += `*Created: ${new Date(conversation.createdAt).toLocaleString()}*\n\n`
      md += `---\n\n`
      for (const msg of conversation.messages) {
        const role = msg.role === "user" ? "**You**" : "**AI**"
        md += `${role}: ${msg.content}\n\n`
      }
      return md
    
    case "txt":
      let txt = `${conversation.title}\n`
      txt += `${"=".repeat(conversation.title.length)}\n\n`
      for (const msg of conversation.messages) {
        const role = msg.role === "user" ? "You" : "AI"
        txt += `[${role}]: ${msg.content}\n\n`
      }
      return txt
    
    default:
      return JSON.stringify(conversation)
  }
}

export function exportAllConversations(conversations: Conversation[]): string {
  return JSON.stringify(conversations, null, 2)
}

export function importConversations(jsonString: string): Conversation[] {
  try {
    const data = JSON.parse(jsonString)
    if (Array.isArray(data)) {
      return data.filter(item => item.id && item.messages && Array.isArray(item.messages))
    }
    if (data.id && data.messages) {
      return [data]
    }
    return []
  } catch {
    return []
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

// Generate title from first message
export function generateTitle(content: string): string {
  const cleaned = content.replace(/\n/g, " ").trim()
  if (cleaned.length <= 30) return cleaned
  return cleaned.slice(0, 30) + "..."
}

// Estimate tokens (rough approximation)
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English, 1.5 for Chinese
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const otherChars = text.length - chineseChars
  return Math.ceil(chineseChars / 1.5 + otherChars / 4)
}
