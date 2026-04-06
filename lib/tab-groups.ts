export interface TabGroup {
  id: string
  name: string
  color: string
  tabIds: string[]
  collapsed: boolean
  createdAt: number
}

export const GROUP_COLORS = [
  { name: "blue", value: "#3b82f6" },
  { name: "green", value: "#10b981" },
  { name: "red", value: "#ef4444" },
  { name: "yellow", value: "#f59e0b" },
  { name: "purple", value: "#8b5cf6" },
  { name: "pink", value: "#ec4899" },
  { name: "cyan", value: "#06b6d4" },
  { name: "orange", value: "#f97316" },
]

export class TabGroupManager {
  private groups: TabGroup[] = []

  getAllGroups(): TabGroup[] {
    return this.groups
  }

  createGroup(name: string, color: string, tabIds: string[]): TabGroup {
    const group: TabGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      tabIds,
      collapsed: false,
      createdAt: Date.now(),
    }
    this.groups.push(group)
    return group
  }

  deleteGroup(groupId: string): void {
    const index = this.groups.findIndex((g) => g.id === groupId)
    if (index !== -1) this.groups.splice(index, 1)
  }

  addTabToGroup(groupId: string, tabId: string): void {
    const group = this.groups.find((g) => g.id === groupId)
    if (group && !group.tabIds.includes(tabId)) {
      group.tabIds.push(tabId)
    }
  }

  removeTabFromGroup(groupId: string, tabId: string): void {
    const group = this.groups.find((g) => g.id === groupId)
    if (group) {
      group.tabIds = group.tabIds.filter((id) => id !== tabId)
    }
  }

  toggleCollapse(groupId: string): void {
    const group = this.groups.find((g) => g.id === groupId)
    if (group) group.collapsed = !group.collapsed
  }

  renameGroup(groupId: string, newName: string): void {
    const group = this.groups.find((g) => g.id === groupId)
    if (group) group.name = newName
  }

  getGroup(groupId: string): TabGroup | undefined {
    return this.groups.find((g) => g.id === groupId)
  }
}
