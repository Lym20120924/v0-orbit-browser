"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Save, Folder, Trash2, Clock } from "lucide-react"
import { SessionManager, type BrowserSession } from "@/lib/session-manager"
import { playSound } from "@/lib/sounds"

interface SessionManagerPanelProps {
  isOpen: boolean
  onClose: () => void
  tabs?: Array<{ url: string; title: string }>
  onRestoreSession?: (session: BrowserSession) => void
}

export function SessionManagerPanel({ isOpen, onClose, tabs = [], onRestoreSession }: SessionManagerPanelProps) {
  const [sessionManager] = useState(() => new SessionManager())
  const [sessions, setSessions] = useState<BrowserSession[]>([])
  const [newSessionName, setNewSessionName] = useState("")

  useEffect(() => {
    const loadedSessions = sessionManager.getSessions() || []
    setSessions(loadedSessions)
  }, [sessionManager])

  const handleSaveSession = () => {
    if (newSessionName.trim() && tabs && tabs.length > 0) {
      sessionManager.saveSession(newSessionName, tabs)
      setSessions(sessionManager.getSessions() || [])
      setNewSessionName("")
      playSound("success")
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    sessionManager.deleteSession(sessionId)
    setSessions(sessionManager.getSessions() || [])
    playSound("delete")
  }

  const handleRestoreSession = (session: BrowserSession) => {
    if (onRestoreSession) {
      onRestoreSession(session)
    }
    playSound("success")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">会话管理器</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-73px)]">
        {/* Save current session */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">保存当前标签页 ({tabs?.length || 0})</p>
          <Input
            placeholder="会话名称..."
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveSession()}
          />
          <Button onClick={handleSaveSession} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            保存会话
          </Button>
        </div>

        {/* Saved sessions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">已保存的会话</h3>
          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>没有已保存的会话</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{session.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(session.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{session.tabs?.length || 0} 个标签页</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleRestoreSession(session)} title="恢复会话">
                      <Folder className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSession(session.id)}
                      title="删除会话"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
