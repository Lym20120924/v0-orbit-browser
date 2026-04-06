"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, FolderPlus, ChevronDown, ChevronRight } from "lucide-react"
import { type TabGroup, GROUP_COLORS, TabGroupManager } from "@/lib/tab-groups"
import { playSound } from "@/lib/sounds"

interface TabGroupsPanelProps {
  isOpen: boolean
  onClose: () => void
  tabs: any[]
  onUpdateTabs: (tabs: any[]) => void
}

export function TabGroupsPanel({ isOpen, onClose, tabs, onUpdateTabs }: TabGroupsPanelProps) {
  const [groups, setGroups] = useState<TabGroup[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0].value)
  const [groupManager] = useState(() => new TabGroupManager())

  useEffect(() => {
    setGroups(groupManager.getAllGroups())
  }, [groupManager])

  if (!isOpen) return null

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const group = groupManager.createGroup(newGroupName, selectedColor, [])
      setGroups(groupManager.getAllGroups())
      setNewGroupName("")
      playSound("success")
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    groupManager.deleteGroup(groupId)
    setGroups(groupManager.getAllGroups())
    playSound("delete")
  }

  const handleToggleCollapse = (groupId: string) => {
    groupManager.toggleCollapse(groupId)
    setGroups(groupManager.getAllGroups())
    playSound("click")
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Tab Groups</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-73px)]">
        {/* Create new group */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <Input
            placeholder="Group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
          />

          <div className="flex gap-2">
            {GROUP_COLORS.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full transition-transform ${
                  selectedColor === color.value ? "scale-125 ring-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.value)}
              />
            ))}
          </div>

          <Button onClick={handleCreateGroup} className="w-full">
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Existing groups */}
        <div className="space-y-2">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No tab groups yet</p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                style={{ borderLeftColor: group.color, borderLeftWidth: 4 }}
              >
                <div className="flex items-center justify-between">
                  <button onClick={() => handleToggleCollapse(group.id)} className="flex items-center gap-2 flex-1">
                    {group.collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="font-medium">{group.name}</span>
                    <span className="text-xs text-muted-foreground">({group.tabIds.length} tabs)</span>
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
