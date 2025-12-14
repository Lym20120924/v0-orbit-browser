"use client"

import { useState } from "react"
import { X, Key, Eye, EyeOff, Copy, Trash2, Plus, Check } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface PasswordManagerProps {
  isOpen: boolean
  onClose: () => void
}

interface SavedPassword {
  id: string
  site: string
  username: string
  password: string
  strength: "weak" | "medium" | "strong"
  createdAt: Date
}

export function PasswordManager({ isOpen, onClose }: PasswordManagerProps) {
  const { translate } = useBrowser()
  const [passwords, setPasswords] = useState<SavedPassword[]>([
    {
      id: "1",
      site: "github.com",
      username: "user@example.com",
      password: "MyStrongPass123!",
      strength: "strong",
      createdAt: new Date(),
    },
    {
      id: "2",
      site: "google.com",
      username: "myemail@gmail.com",
      password: "weakpass",
      strength: "weak",
      createdAt: new Date(),
    },
  ])
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const togglePasswordVisibility = (id: string) => {
    playSound("click")
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyPassword = (id: string, password: string) => {
    playSound("success")
    navigator.clipboard.writeText(password)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deletePassword = (id: string) => {
    playSound("click")
    setPasswords((prev) => prev.filter((p) => p.id !== id))
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "weak":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "strong":
        return "text-green-400 bg-green-500/10 border-green-500/30"
      default:
        return "text-muted-foreground bg-secondary/50 border-border"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("passwordManager")}</h2>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => playSound("hover")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {passwords.length} {translate("savedPasswords")}
            </span>
            <button
              onClick={() => playSound("click")}
              onMouseEnter={() => playSound("hover")}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              {translate("savePassword")}
            </button>
          </div>

          <div className="space-y-3">
            {passwords.map((pwd, index) => (
              <div
                key={pwd.id}
                className="rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:border-primary/50 hover:shadow-lg animate-stagger-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{pwd.site}</h3>
                    <p className="text-sm text-muted-foreground">{pwd.username}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-medium",
                      getStrengthColor(pwd.strength),
                    )}
                  >
                    {translate(pwd.strength)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-background px-3 py-2 font-mono text-sm">
                    {visiblePasswords.has(pwd.id) ? pwd.password : "••••••••••••"}
                  </div>
                  <button
                    onClick={() => togglePasswordVisibility(pwd.id)}
                    onMouseEnter={() => playSound("hover")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground"
                  >
                    {visiblePasswords.has(pwd.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyPassword(pwd.id, pwd.password)}
                    onMouseEnter={() => playSound("hover")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground"
                  >
                    {copiedId === pwd.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => deletePassword(pwd.id)}
                    onMouseEnter={() => playSound("hover")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
