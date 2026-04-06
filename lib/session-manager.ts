export interface BrowserSession {
  id: string
  name: string
  timestamp: number
  tabs: Array<{
    url: string
    title: string
    favicon?: string
  }>
}

export class SessionManager {
  private sessions: BrowserSession[] = []
  private readonly STORAGE_KEY = "orbit-browser-sessions"

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSessions()
    }
  }

  private loadSessions() {
    try {
      if (typeof localStorage === "undefined") {
        return
      }
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.sessions = JSON.parse(stored)
      }
    } catch (error) {
      console.error("[v0] Failed to load sessions:", error)
      this.sessions = []
    }
  }

  private saveSessions() {
    try {
      if (typeof localStorage === "undefined") {
        return
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessions))
    } catch (error) {
      console.error("[v0] Failed to save sessions:", error)
    }
  }

  saveSession(name: string, tabs: Array<{ url: string; title: string; favicon?: string }>) {
    const session: BrowserSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      timestamp: Date.now(),
      tabs,
    }
    this.sessions.unshift(session)
    if (this.sessions.length > 50) this.sessions.pop()
    this.saveSessions()
    return session
  }

  getSessions(): BrowserSession[] {
    return this.sessions || []
  }

  deleteSession(sessionId: string) {
    this.sessions = this.sessions.filter((s) => s.id !== sessionId)
    this.saveSessions()
  }

  renameSession(sessionId: string, newName: string) {
    const session = this.sessions.find((s) => s.id === sessionId)
    if (session) {
      session.name = newName
      this.saveSessions()
    }
  }
}
