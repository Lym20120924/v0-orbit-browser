"use client"

import { Smartphone, Tablet, Monitor, RotateCcw, X, ChevronDown } from "lucide-react"
import { devicePresets, getDevicesByType, type DevicePreset } from "@/lib/devices"
import { useBrowser } from "../orbit-browser"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DeviceEmulatorProps {
  currentDevice: DevicePreset | null
  isRotated: boolean
  onDeviceChange: (device: DevicePreset | null) => void
  onRotate: () => void
  onClose: () => void
}

export function DeviceEmulator({ currentDevice, isRotated, onDeviceChange, onRotate, onClose }: DeviceEmulatorProps) {
  const { translate } = useBrowser()
  const [activeCategory, setActiveCategory] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [showDropdown, setShowDropdown] = useState(false)

  const mobileDevices = getDevicesByType("mobile")
  const tabletDevices = getDevicesByType("tablet")
  const desktopDevices = getDevicesByType("desktop")

  const categories = [
    { id: "mobile" as const, label: translate("mobile"), icon: Smartphone, devices: mobileDevices },
    { id: "tablet" as const, label: translate("tablet"), icon: Tablet, devices: tabletDevices },
    { id: "desktop" as const, label: translate("desktop"), icon: Monitor, devices: desktopDevices },
  ]

  const currentDevices = categories.find((c) => c.id === activeCategory)?.devices || []

  return (
    <div className="flex h-12 items-center gap-3 border-b border-border bg-secondary/50 px-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-background p-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <category.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Device Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
        >
          <span className="max-w-[150px] truncate">{currentDevice?.name || translate("deviceEmulation")}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-56 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
              {currentDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => {
                    onDeviceChange(device)
                    setShowDropdown(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                    currentDevice?.id === device.id && "bg-primary/10 text-primary",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{device.name}</span>
                    {device.width > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {device.width} x {device.height}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Current Size Display */}
      {currentDevice && currentDevice.width > 0 && (
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="rounded bg-background px-2 py-1 font-mono">
            {isRotated ? currentDevice.height : currentDevice.width} x{" "}
            {isRotated ? currentDevice.width : currentDevice.height}
          </span>
        </div>
      )}

      {/* Rotate Button */}
      {currentDevice && currentDevice.type !== "desktop" && currentDevice.width > 0 && (
        <button
          onClick={onRotate}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
            isRotated ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
          title={translate("rotateDevice")}
        >
          <RotateCcw className={cn("h-4 w-4 transition-transform", isRotated && "rotate-90")} />
        </button>
      )}

      {/* Quick Device Buttons */}
      <div className="ml-auto hidden items-center gap-1 lg:flex">
        {[
          { device: devicePresets.find((d) => d.id === "iphone-15-pro"), icon: "📱" },
          { device: devicePresets.find((d) => d.id === "ipad-pro-11"), icon: "📱" },
          { device: devicePresets.find((d) => d.id === "laptop-15"), icon: "💻" },
          { device: devicePresets.find((d) => d.id === "responsive"), icon: "🖥️" },
        ].map(
          ({ device, icon }) =>
            device && (
              <button
                key={device.id}
                onClick={() => onDeviceChange(device)}
                className={cn(
                  "flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors",
                  currentDevice?.id === device.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <span>{icon}</span>
                <span className="hidden xl:inline">{device.name}</span>
              </button>
            ),
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
