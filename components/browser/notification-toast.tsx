"use client"

import type React from "react"

import { useState, createContext, useContext, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error("useNotifications must be used within NotificationProvider")
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }

    // Play sound based on type
    if (notification.type === "success") playSound("success")
    else if (notification.type === "error") playSound("error")
    else playSound("notification")

    setNotifications((prev) => [...prev, newNotification])

    // Auto remove
    const duration = notification.duration ?? 4000
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, duration)
  }, [])

  const removeNotification = useCallback((id: string) => {
    playSound("whoosh")
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {notifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
          index={index}
        />
      ))}
    </div>
  )
}

function NotificationToast({
  notification,
  onRemove,
  index,
}: {
  notification: Notification
  onRemove: () => void
  index: number
}) {
  const [isLeaving, setIsLeaving] = useState(false)

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: "border-green-500/50 bg-green-500/10",
    error: "border-red-500/50 bg-red-500/10",
    info: "border-blue-500/50 bg-blue-500/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
  }

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  }

  const Icon = icons[notification.type]

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(onRemove, 300)
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
        "transition-all duration-300",
        colors[notification.type],
        isLeaving ? "opacity-0 translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100",
        "animate-notification-slide",
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={cn("mt-0.5", iconColors[notification.type])}>
        <Icon className="h-5 w-5 animate-bounce-in" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm">{notification.title}</p>
        {notification.message && <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>}
      </div>
      <button
        onClick={handleRemove}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
        <div
          className={cn("h-full", iconColors[notification.type].replace("text-", "bg-"))}
          style={{
            animation: `shrink-width ${notification.duration ?? 4000}ms linear forwards`,
          }}
        />
      </div>
    </div>
  )
}
