"use client"

import { useState } from "react"
import { OrbitBrowser } from "@/components/orbit-browser"
import { SplashScreen } from "@/components/browser/splash-screen"
import { NotificationProvider } from "@/components/browser/notification-toast"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <NotificationProvider>
      <main className="h-screen w-screen overflow-hidden">
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <OrbitBrowser />
      </main>
    </NotificationProvider>
  )
}
