"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Lock, User, Rocket, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrowser } from "../orbit-browser"
import { registerUser, loginUser, validateEmail, validatePassword, type User as UserType } from "@/lib/auth"

interface AuthPanelProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
}

export function AuthPanel({ isOpen, onClose, onLogin }: AuthPanelProps) {
  const { translate } = useBrowser()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // 验证
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || "Invalid password")
      setIsLoading(false)
      return
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (!username.trim()) {
        setError("Please enter a username")
        setIsLoading(false)
        return
      }

      // 模拟注册延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = registerUser(email, username, password)
      if (result.success && result.user) {
        setSuccess(translate("registerSuccess"))
        setTimeout(() => {
          onLogin(result.user!)
          onClose()
        }, 1000)
      } else {
        setError(result.error || "Registration failed")
      }
    } else {
      // 模拟登录延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = loginUser(email, password)
      if (result.success && result.user) {
        setSuccess(translate("loginSuccess"))
        setTimeout(() => {
          onLogin(result.user!)
          onClose()
        }, 1000)
      } else {
        setError(result.error || "Login failed")
      }
    }

    setIsLoading(false)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUsername("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="relative flex flex-col items-center border-b border-border p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent shadow-lg">
            <Rocket className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {mode === "login" ? translate("login") : translate("register")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? translate("welcomeBack") : translate("createAccount")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
              <Check className="h-4 w-4" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">{translate("username")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={translate("username")}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{translate("email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">{translate("password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">{translate("confirmPassword")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-secondary"
                  />
                  {translate("rememberMe")}
                </label>
                <button type="button" className="text-sm text-primary hover:underline">
                  {translate("forgotPassword")}
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "mt-6 w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90",
              isLoading && "cursor-not-allowed opacity-50",
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {translate("loading")}
              </span>
            ) : mode === "login" ? (
              translate("login")
            ) : (
              translate("register")
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? translate("noAccount") : translate("hasAccount")}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login")
                resetForm()
              }}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? translate("register") : translate("login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
