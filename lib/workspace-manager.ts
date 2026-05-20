export interface Workspace {
  id: string
  name: string
  icon: string
  color: string
  tabs: string[]
  bookmarks: string[]
  settings: Record<string, any>
  createdAt: number
}

export class WorkspaceManager {
  private workspaces: Map<string, Workspace> = new Map()
  private activeWorkspaceId: string | null = null

  constructor() {
    this.loadWorkspaces()
    if (this.workspaces.size === 0) {
      this.createWorkspace("Default", "🏠", "#3b82f6")
    }
  }

  createWorkspace(name: string, icon = "📁", color = "#6366f1"): Workspace {
    const workspace: Workspace = {
      id: Date.now().toString() + Math.random().toString(36),
      name,
      icon,
      color,
      tabs: [],
      bookmarks: [],
      settings: {},
      createdAt: Date.now(),
    }

    this.workspaces.set(workspace.id, workspace)
    if (!this.activeWorkspaceId) {
      this.activeWorkspaceId = workspace.id
    }
    this.saveWorkspaces()

    return workspace
  }

  getWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values())
  }

  getActiveWorkspace(): Workspace | null {
    if (!this.activeWorkspaceId) return null
    return this.workspaces.get(this.activeWorkspaceId) || null
  }

  switchWorkspace(workspaceId: string): void {
    if (this.workspaces.has(workspaceId)) {
      this.activeWorkspaceId = workspaceId
      this.saveWorkspaces()
    }
  }

  updateWorkspace(workspaceId: string, updates: Partial<Workspace>): void {
    const workspace = this.workspaces.get(workspaceId)
    if (workspace) {
      Object.assign(workspace, updates)
      this.saveWorkspaces()
    }
  }

  deleteWorkspace(workspaceId: string): void {
    this.workspaces.delete(workspaceId)
    if (this.activeWorkspaceId === workspaceId) {
      const remaining = Array.from(this.workspaces.keys())
      this.activeWorkspaceId = remaining[0] || null
    }
    this.saveWorkspaces()
  }

  addTabToWorkspace(workspaceId: string, tabUrl: string): void {
    const workspace = this.workspaces.get(workspaceId)
    if (workspace && !workspace.tabs.includes(tabUrl)) {
      workspace.tabs.push(tabUrl)
      this.saveWorkspaces()
    }
  }

  removeTabFromWorkspace(workspaceId: string, tabUrl: string): void {
    const workspace = this.workspaces.get(workspaceId)
    if (workspace) {
      workspace.tabs = workspace.tabs.filter((t) => t !== tabUrl)
      this.saveWorkspaces()
    }
  }

  private saveWorkspaces(): void {
    const data = {
      workspaces: Array.from(this.workspaces.entries()),
      activeWorkspaceId: this.activeWorkspaceId,
    }
    localStorage.setItem("orbit_workspaces", JSON.stringify(data))
  }

  private loadWorkspaces(): void {
    const data = localStorage.getItem("orbit_workspaces")
    if (data) {
      const parsed = JSON.parse(data)
      this.workspaces = new Map(parsed.workspaces)
      this.activeWorkspaceId = parsed.activeWorkspaceId
    }
  }
}
