"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"

interface AnimatedButtonProps {
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  title?: string
  badge?: number
  children: React.ReactNode
  className?: string
  variant?: "default" | "primary" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  soundEffect?: "click" | "tab" | "toggle" | "bookmark" | "refresh" | "pop" | "whoosh"
}

export function AnimatedButton({
  onClick,
  disabled,
  active,
  title,
  badge,
  children,
  className,
  variant = "default",
  size = "md",
  soundEffect = "click",
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    // Play sound
    playSound(soundEffect)

    // Animation
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 150)

    // Ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      setRipples((prev) => [...prev, { x, y, id }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }

    onClick?.()
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      playSound("hover")
    }
  }

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const variantClasses = {
    default: active ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-secondary hover:text-foreground",
    destructive: "text-destructive hover:bg-destructive/10",
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      title={title}
      className={cn(
        "relative flex items-center justify-center rounded-lg transition-all duration-200 overflow-hidden",
        sizeClasses[size],
        disabled ? "cursor-not-allowed text-muted-foreground/30" : variantClasses[variant],
        isPressed && !disabled && "scale-90",
        !disabled && "hover:scale-105 active:scale-95",
        className,
      )}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-primary/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      ))}

      {/* Content */}
      <div className={cn("transition-transform duration-200", !disabled && "group-hover:scale-110")}>{children}</div>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-badge-pop">
          {badge}
        </span>
      )}

      {/* Active indicator */}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary animate-scale-in" />
      )}
    </button>
  )
}
