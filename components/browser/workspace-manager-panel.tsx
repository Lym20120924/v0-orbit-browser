"use client"

import { useState } from "react"
import { X, Plus, Trash2, Check, FolderKanban, Briefcase, Home, Code, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n"
import type { Workspace } from "@/lib/workspace-manager"
import { playSound } from "@/lib/sounds"

interface WorkspaceManagerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkspaceManagerPanel({ isOpen, onClose }: WorkspaceManagerPanelProps) {
  const { t: translate } = useLanguage()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "work",
      name: "Work",
      icon: "briefcase",
      color: "#3b82f6",
      tabs: [],
      bookmarks: [],
      extensions: [],
    },
    {
      id: "personal",
      name: "Personal",
      icon: "home",
      color: "#10b981",
      tabs: [],
      bookmarks: [],
      extensions: [],
    },
  ])
  const [activeWorkspace, setActiveWorkspace] = useState("work")
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")

  if (!isOpen) return null

  const icons = {
    briefcase: Briefcase,
    home: Home,
    code: Code,
    coffee: Coffee,
    folder: FolderKanban,
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return

    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName,
      icon: "folder",
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tabs: [],
      bookmarks: [],
      extensions: [],
    }

    setWorkspaces((prev) => [...prev, newWorkspace])
    setNewWorkspaceName("")
    setIsCreating(false)
    playSound("success")
  }

  const handleDeleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return
    setWorkspaces((prev) => prev.filter((w) => w.id !== id))
    if (activeWorkspace === id) {
      setActiveWorkspace(workspaces[0].id)
    }
    playSound("success")
  }

  const handleSwitchWorkspace = (id: string) => {
    setActiveWorkspace(id)
    playSound("toggle")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("workspaceManager")}</h2>
          </div>
          <button
            onClick={() => {
              playSound("click")
              onClose()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => {
              const Icon = icons[workspace.icon as keyof typeof icons] || FolderKanban
              return (
                <div
                  key={workspace.id}
                  className={cn(
                    "group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:scale-105",
                    activeWorkspace === workspace.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  onMouseEnter={() => playSound("hover")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: workspace.color + "20", color: workspace.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{workspace.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {workspace.tabs.length} {translate("tabs")}
                        </p>
                      </div>
                    </div>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playSound("click")
                          handleDeleteWorkspace(workspace.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {activeWorkspace === workspace.id && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              )
            })}

            {isCreating ? (
              <div className="rounded-xl border border-primary bg-primary/5 p-4">
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                  placeholder={translate("workspaceName")}
                  autoFocus
                  className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateWorkspace}
                    onMouseEnter={() => playSound("hover")}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {translate("create")}
                  </button>
                  <button
                    onClick={() => {
                      playSound("click")
                      setIsCreating(false)
                      setNewWorkspaceName("")
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    {translate("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  playSound("pop")
                  setIsCreating(true)
                }}
                onMouseEnter={() => playSound("hover")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-105"
              >
                <Plus className="h-8 w-8" />
                <span className="text-sm font-medium">{translate("newWorkspace")}</span>
              </button>
            )}
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <h3 className="mb-3 font-medium text-foreground">{translate("workspaceInfo")}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• {translate("separateTabs")}</p>
              <p>• {translate("separateBookmarks")}</p>
              <p>• {translate("separateExtensions")}</p>
              <p>• {translate("quickSwitch")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
