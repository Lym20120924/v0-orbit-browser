"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Cloud, CloudOff, Check, Loader2 } from "lucide-react"
import { CloudSync } from "@/lib/cloud-sync"
import { playSound } from "@/lib/sounds"
import type { User } from "@/lib/auth"

interface CloudSyncPanelProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export function CloudSyncPanel({ isOpen, onClose, user }: CloudSyncPanelProps) {
  const [cloudSync] = useState(() => new CloudSync())
  const [isSyncEnabled, setIsSyncEnabled] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setIsSyncEnabled(cloudSync.isSyncEnabled())
  }, [cloudSync])

  const handleEnableSync = async () => {
    if (!email || !password) return

    setIsLoading(true)
    try {
      const success = await cloudSync.enableSync(email, password)
      if (success) {
        setIsSyncEnabled(true)
        playSound("success")
      } else {
        playSound("error")
      }
    } catch (error) {
      console.error("[v0] Sync enable error:", error)
      playSound("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisableSync = () => {
    cloudSync.disableSync()
    setIsSyncEnabled(false)
    playSound("click")
  }

  const handleSyncNow = async () => {
    setIsSyncing(true)
    playSound("click")

    try {
      const success = await cloudSync.syncNow({})
      if (success) {
        playSound("success")
      } else {
        playSound("error")
      }
    } catch (error) {
      console.error("[v0] Sync error:", error)
      playSound("error")
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Cloud Sync</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-73px)]">
        {!isSyncEnabled ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Cloud className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">Enable Cloud Sync</h3>
              <p className="text-sm text-muted-foreground">Sync your bookmarks, history, and settings across devices</p>
            </div>

            <div className="space-y-3">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnableSync()}
              />
              <Button onClick={handleEnableSync} disabled={isLoading || !email || !password} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Cloud className="h-4 w-4 mr-2" />}
                Enable Sync
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Sync Enabled</h3>
              </div>
              <p className="text-sm text-muted-foreground">Your data is being synced automatically</p>
            </div>

            <Button onClick={handleSyncNow} disabled={isSyncing} className="w-full">
              {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Cloud className="h-4 w-4 mr-2" />}
              Sync Now
            </Button>

            <Button onClick={handleDisableSync} variant="outline" className="w-full bg-transparent">
              <CloudOff className="h-4 w-4 mr-2" />
              Disable Sync
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
