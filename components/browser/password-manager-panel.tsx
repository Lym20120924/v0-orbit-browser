"use client"

import { useState } from "react"
import { X, Key, Plus, Trash2, Eye, EyeOff, Copy, RefreshCw, Shield } from "lucide-react"
import { useBrowser } from "../orbit-browser"
import { playSound } from "@/lib/sounds"
import {
  getSavedPasswords,
  deletePassword,
  generatePassword,
  checkPasswordStrength,
  savePassword,
  type SavedPassword,
} from "@/lib/password-manager"

interface PasswordManagerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordManagerPanel({ isOpen, onClose }: PasswordManagerPanelProps) {
  const { translate } = useBrowser()
  const [passwords, setPasswords] = useState<SavedPassword[]>(getSavedPasswords())
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPassword, setNewPassword] = useState({
    website: "",
    username: "",
    password: "",
  })

  if (!isOpen) return null

  const handleClose = () => {
    playSound("whoosh")
    onClose()
  }

  const handleDelete = (id: string) => {
    playSound("click")
    deletePassword(id)
    setPasswords(getSavedPasswords())
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    playSound("success")
  }

  const handleGenerate = () => {
    const generated = generatePassword()
    setNewPassword({ ...newPassword, password: generated })
    playSound("click")
  }

  const handleSave = () => {
    if (newPassword.website && newPassword.username && newPassword.password) {
      savePassword(newPassword.website, newPassword.username, newPassword.password)
      setPasswords(getSavedPasswords())
      setNewPassword({ website: "", username: "", password: "" })
      setShowAddForm(false)
      playSound("success")
    }
  }

  const passwordStrength = newPassword.password ? checkPasswordStrength(newPassword.password) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-backdrop-fade">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl animate-zoom-in-bounce">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{translate("passwordManager")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound("click")
                setShowAddForm(!showAddForm)
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              {translate("addPassword")}
            </button>
            <button
              onClick={handleClose}
              onMouseEnter={() => playSound("hover")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground hover:scale-110 hover:rotate-90 active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-thin">
          {showAddForm && (
            <div className="mb-4 rounded-xl border border-border bg-secondary/30 p-4 animate-fade-in-up">
              <h3 className="mb-4 font-medium text-foreground">{translate("addNewPassword")}</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newPassword.website}
                  onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                  placeholder={translate("website")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                  placeholder={translate("username")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <div className="relative">
                  <input
                    type="text"
                    value={newPassword.password}
                    onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                    placeholder={translate("password")}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleGenerate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Generate
                  </button>
                </div>
                {passwordStrength && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Strength:</span>
                      <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {translate("save")}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 rounded-lg bg-secondary py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
                  >
                    {translate("cancel")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {passwords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <Shield className="mb-4 h-16 w-16 text-muted-foreground/20 animate-float" />
              <p className="font-medium text-muted-foreground">{translate("noPasswordsSaved")}</p>
              <p className="mt-1 text-sm text-muted-foreground/70">{translate("addPasswordToStart")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {passwords.map((password, index) => (
                <div
                  key={password.id}
                  className="rounded-xl border border-border bg-secondary/30 p-4 hover:border-primary/50 transition-all animate-stagger-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{password.website}</h4>
                      <p className="text-sm text-muted-foreground">{password.username}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                          {showPasswords[password.id] ? password.password : "••••••••"}
                        </code>
                        <button
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, [password.id]: !showPasswords[password.id] })
                          }
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {showPasswords[password.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => handleCopy(password.password)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(password.id)}
                      className="rounded p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last used: {password.lastUsed.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {passwords.length > 0 && (
          <div className="border-t border-border p-4">
            <p className="text-center text-xs text-muted-foreground">
              {passwords.length} {translate("passwordsSaved")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
