// Utility to safely access browser storage (guards against server-side rendering)

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error("[v0] localStorage access error:", e)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error("[v0] localStorage write error:", e)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error("[v0] localStorage remove error:", e)
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.clear()
    } catch (e) {
      console.error("[v0] localStorage clear error:", e)
    }
  },
}

export const isClient = typeof window !== "undefined"
