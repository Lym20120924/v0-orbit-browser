export interface Shortcut {
  key: string
  modifiers: string[]
  action: string
  description: string
}

export class KeyboardShortcutsManager {
  private shortcuts: Map<string, Shortcut> = new Map()
  private listeners: Map<string, () => void> = new Map()

  constructor() {
    this.initDefaultShortcuts()
  }

  private initDefaultShortcuts() {
    this.addShortcut("ctrl+t", [], "newTab", "Open new tab")
    this.addShortcut("ctrl+w", [], "closeTab", "Close current tab")
    this.addShortcut("ctrl+tab", [], "nextTab", "Switch to next tab")
    this.addShortcut("ctrl+shift+tab", [], "prevTab", "Switch to previous tab")
    this.addShortcut("ctrl+r", [], "refresh", "Refresh page")
    this.addShortcut("ctrl+h", [], "history", "Open history")
    this.addShortcut("ctrl+d", [], "bookmark", "Bookmark page")
    this.addShortcut("ctrl+f", [], "find", "Find in page")
    this.addShortcut("ctrl+shift+i", [], "devtools", "Open developer tools")
    this.addShortcut("f11", [], "fullscreen", "Toggle fullscreen")
  }

  addShortcut(key: string, modifiers: string[], action: string, description: string) {
    this.shortcuts.set(action, { key, modifiers, action, description })
  }

  removeShortcut(action: string) {
    this.shortcuts.delete(action)
  }

  getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values())
  }

  registerListener(action: string, callback: () => void) {
    this.listeners.set(action, callback)
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey
    const alt = event.altKey

    for (const [action, shortcut] of this.shortcuts.entries()) {
      const matchesKey = shortcut.key === key || shortcut.key === `ctrl+${key}` || shortcut.key === `ctrl+shift+${key}`

      if (matchesKey) {
        const listener = this.listeners.get(action)
        if (listener) {
          event.preventDefault()
          listener()
          return true
        }
      }
    }

    return false
  }
}
