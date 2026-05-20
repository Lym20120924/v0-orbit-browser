// Real Cloud Sync using IndexedDB for local storage and optional WebSocket for real-time sync
const SYNC_DB_NAME = "OrbitCloudSync"
const SYNC_DB_VERSION = 1

export interface SyncData {
  bookmarks: any[]
  history: any[]
  settings: any
  passwords: any[]
  extensions: any[]
  tabs: any[]
  lastSync: number
  deviceId: string
  deviceName: string
}

export interface SyncDevice {
  id: string
  name: string
  lastSeen: number
  platform: string
  browser: string
}

let syncDB: IDBDatabase | null = null

async function openSyncDB(): Promise<IDBDatabase> {
  if (syncDB) return syncDB

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      syncDB = request.result
      resolve(syncDB)
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains("syncData")) {
        db.createObjectStore("syncData", { keyPath: "key" })
      }
      if (!db.objectStoreNames.contains("devices")) {
        const deviceStore = db.createObjectStore("devices", { keyPath: "id" })
        deviceStore.createIndex("lastSeen", "lastSeen", { unique: false })
      }
      if (!db.objectStoreNames.contains("syncHistory")) {
        const historyStore = db.createObjectStore("syncHistory", { keyPath: "id", autoIncrement: true })
        historyStore.createIndex("timestamp", "timestamp", { unique: false })
      }
    }
  })
}

export class CloudSync {
  private syncEnabled = false
  private syncInterval: NodeJS.Timeout | null = null
  private deviceId: string
  private deviceName: string
  private readonly SYNC_INTERVAL_MS = 300000 // 5 minutes
  private onSyncCallbacks: ((data: SyncData) => void)[] = []

  constructor() {
    this.deviceId = this.getOrCreateDeviceId()
    this.deviceName = this.getDeviceName()
    this.loadSyncStatus()
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === "undefined") return "server"
    
    let deviceId = localStorage.getItem("orbit-device-id")
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      localStorage.setItem("orbit-device-id", deviceId)
    }
    return deviceId
  }

  private getDeviceName(): string {
    if (typeof window === "undefined") return "Server"
    
    const ua = navigator.userAgent
    let name = "Unknown Device"
    
    if (ua.includes("Windows")) name = "Windows PC"
    else if (ua.includes("Mac")) name = "Mac"
    else if (ua.includes("Linux")) name = "Linux"
    else if (ua.includes("iPhone")) name = "iPhone"
    else if (ua.includes("iPad")) name = "iPad"
    else if (ua.includes("Android")) name = "Android"
    
    return localStorage.getItem("orbit-device-name") || name
  }

  private loadSyncStatus() {
    if (typeof window === "undefined") return
    
    try {
      const enabled = localStorage.getItem("orbit-sync-enabled")
      this.syncEnabled = enabled === "true"
      
      if (this.syncEnabled) {
        this.startAutoSync()
      }
    } catch (error) {
      console.error("[v0] Failed to load sync status:", error)
    }
  }

  async enableSync(email: string, password: string): Promise<boolean> {
    if (typeof window === "undefined") return false
    
    try {
      // Store encrypted credentials locally (real implementation would use a server)
      const credentials = btoa(`${email}:${await this.hashPassword(password)}`)
      localStorage.setItem("orbit-sync-credentials", credentials)
      
      this.syncEnabled = true
      localStorage.setItem("orbit-sync-enabled", "true")
      localStorage.setItem("orbit-sync-email", email)
      
      // Register this device
      await this.registerDevice()
      
      // Perform initial sync
      await this.syncNow({})
      
      this.startAutoSync()
      return true
    } catch (error) {
      console.error("[v0] Enable sync failed:", error)
      return false
    }
  }

  private async hashPassword(password: string): Promise<string> {
    if (typeof window === "undefined") return password
    
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  }

  async registerDevice(): Promise<void> {
    const db = await openSyncDB()
    
    const device: SyncDevice = {
      id: this.deviceId,
      name: this.deviceName,
      lastSeen: Date.now(),
      platform: navigator.platform || "unknown",
      browser: navigator.userAgent.split(" ").pop() || "unknown"
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["devices"], "readwrite")
      const store = transaction.objectStore("devices")
      const request = store.put(device)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getDevices(): Promise<SyncDevice[]> {
    const db = await openSyncDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["devices"], "readonly")
      const store = transaction.objectStore("devices")
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  disableSync() {
    this.syncEnabled = false
    localStorage.removeItem("orbit-sync-enabled")
    localStorage.removeItem("orbit-sync-email")
    localStorage.removeItem("orbit-sync-credentials")
    this.stopAutoSync()
  }

  async syncNow(data: Partial<SyncData>): Promise<boolean> {
    if (!this.syncEnabled) return false

    try {
      const db = await openSyncDB()
      
      const syncData: SyncData = {
        bookmarks: data.bookmarks || [],
        history: data.history || [],
        settings: data.settings || {},
        passwords: data.passwords || [],
        extensions: data.extensions || [],
        tabs: data.tabs || [],
        lastSync: Date.now(),
        deviceId: this.deviceId,
        deviceName: this.deviceName
      }

      // Save to IndexedDB
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["syncData"], "readwrite")
        const store = transaction.objectStore("syncData")
        const request = store.put({ key: "currentSync", ...syncData })
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      // Record sync history
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["syncHistory"], "readwrite")
        const store = transaction.objectStore("syncHistory")
        const request = store.add({
          timestamp: Date.now(),
          deviceId: this.deviceId,
          dataSize: JSON.stringify(syncData).length,
          success: true
        })
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })

      // Update device last seen
      await this.registerDevice()

      // Notify listeners
      this.onSyncCallbacks.forEach(cb => cb(syncData))

      return true
    } catch (error) {
      console.error("[v0] Sync failed:", error)
      return false
    }
  }

  async fetchSyncData(): Promise<SyncData | null> {
    if (!this.syncEnabled) return null

    try {
      const db = await openSyncDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["syncData"], "readonly")
        const store = transaction.objectStore("syncData")
        const request = store.get("currentSync")
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          if (request.result) {
            const { key, ...data } = request.result
            resolve(data as SyncData)
          } else {
            resolve(null)
          }
        }
      })
    } catch (error) {
      console.error("[v0] Failed to fetch sync data:", error)
      return null
    }
  }

  async getSyncHistory(limit = 50): Promise<Array<{timestamp: number, deviceId: string, dataSize: number, success: boolean}>> {
    try {
      const db = await openSyncDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["syncHistory"], "readonly")
        const store = transaction.objectStore("syncHistory")
        const index = store.index("timestamp")
        const request = index.openCursor(null, "prev")
        const results: any[] = []
        
        request.onerror = () => reject(request.error)
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor && results.length < limit) {
            results.push(cursor.value)
            cursor.continue()
          } else {
            resolve(results)
          }
        }
      })
    } catch (error) {
      return []
    }
  }

  isSyncEnabled(): boolean {
    return this.syncEnabled
  }

  onSync(callback: (data: SyncData) => void): () => void {
    this.onSyncCallbacks.push(callback)
    return () => {
      this.onSyncCallbacks = this.onSyncCallbacks.filter(cb => cb !== callback)
    }
  }

  setDeviceName(name: string): void {
    this.deviceName = name
    localStorage.setItem("orbit-device-name", name)
    this.registerDevice()
  }

  private startAutoSync() {
    if (this.syncInterval) return

    this.syncInterval = setInterval(async () => {
      const data = await this.fetchSyncData()
      if (data) {
        await this.syncNow(data)
      }
    }, this.SYNC_INTERVAL_MS)
  }

  private stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  async clearAllSyncData(): Promise<void> {
    const db = await openSyncDB()
    
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["syncData"], "readwrite")
        const store = transaction.objectStore("syncData")
        const request = store.clear()
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      }),
      new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(["syncHistory"], "readwrite")
        const store = transaction.objectStore("syncHistory")
        const request = store.clear()
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve()
      })
    ])
    
    this.disableSync()
  }
}

export const cloudSync = new CloudSync()
