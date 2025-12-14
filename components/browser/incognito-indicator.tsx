"use client"

import { EyeOff } from "lucide-react"
import { useBrowser } from "../orbit-browser"

export function IncognitoIndicator() {
  const { translate } = useBrowser()

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm animate-fade-in">
      <EyeOff className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{translate("incognitoMode")}</span>
    </div>
  )
}
