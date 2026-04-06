"use client"

import { useEffect, useRef } from "react"

export type GestureType = "swipe-left" | "swipe-right" | "swipe-up" | "swipe-down" | "circle"

export interface Gesture {
  type: GestureType
  action: string
  enabled: boolean
}

export const DEFAULT_GESTURES: Gesture[] = [
  { type: "swipe-left", action: "back", enabled: true },
  { type: "swipe-right", action: "forward", enabled: true },
  { type: "swipe-up", action: "newTab", enabled: true },
  { type: "swipe-down", action: "closeTab", enabled: true },
]

export class GestureController {
  private startX = 0
  private startY = 0
  private isDrawing = false
  private path: Array<{ x: number; y: number }> = []
  private readonly THRESHOLD = 50

  handleMouseDown(e: MouseEvent) {
    if (e.button === 2) {
      // Right click
      this.isDrawing = true
      this.startX = e.clientX
      this.startY = e.clientY
      this.path = [{ x: e.clientX, y: e.clientY }]
      e.preventDefault()
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      this.path.push({ x: e.clientX, y: e.clientY })
    }
  }

  handleMouseUp(e: MouseEvent): GestureType | null {
    if (this.isDrawing) {
      this.isDrawing = false
      const deltaX = e.clientX - this.startX
      const deltaY = e.clientY - this.startY

      if (Math.abs(deltaX) > this.THRESHOLD || Math.abs(deltaY) > this.THRESHOLD) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          return deltaX > 0 ? "swipe-right" : "swipe-left"
        } else {
          return deltaY > 0 ? "swipe-down" : "swipe-up"
        }
      }

      this.path = []
    }
    return null
  }

  reset() {
    this.isDrawing = false
    this.path = []
  }
}

export function useGestureControls(callbacks: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<GestureController>(new GestureController())

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const controller = controllerRef.current

    const handleMouseDown = (e: MouseEvent) => {
      controller.handleMouseDown(e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      controller.handleMouseMove(e)
    }

    const handleMouseUp = (e: MouseEvent) => {
      const gestureType = controller.handleMouseUp(e)

      if (gestureType === "swipe-left" && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft()
      } else if (gestureType === "swipe-right" && callbacks.onSwipeRight) {
        callbacks.onSwipeRight()
      } else if (gestureType === "swipe-up" && callbacks.onSwipeUp) {
        callbacks.onSwipeUp()
      } else if (gestureType === "swipe-down" && callbacks.onSwipeDown) {
        callbacks.onSwipeDown()
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    element.addEventListener("mousedown", handleMouseDown as any)
    element.addEventListener("mousemove", handleMouseMove as any)
    element.addEventListener("mouseup", handleMouseUp as any)
    element.addEventListener("contextmenu", handleContextMenu as any)

    return () => {
      element.removeEventListener("mousedown", handleMouseDown as any)
      element.removeEventListener("mousemove", handleMouseMove as any)
      element.removeEventListener("mouseup", handleMouseUp as any)
      element.removeEventListener("contextmenu", handleContextMenu as any)
    }
  }, [callbacks])

  return ref
}
