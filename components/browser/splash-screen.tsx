"use client"

import { useState, useEffect } from "react"
import { Rocket } from "lucide-react"
import { playSound } from "@/lib/sounds"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "ready" | "fadeout">("loading")

  useEffect(() => {
    playSound("startup")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase("ready")
          return 100
        }
        const increment = Math.random() * 15 + 5
        if (Math.floor(prev / 25) !== Math.floor((prev + increment) / 25)) {
          playSound("pop")
        }
        return Math.min(prev + increment, 100)
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phase === "ready") {
      playSound("chime")
      const timeout = setTimeout(() => setPhase("fadeout"), 500)
      return () => clearTimeout(timeout)
    }
    if (phase === "fadeout") {
      playSound("whoosh")
      const timeout = setTimeout(() => onComplete(), 800)
      return () => clearTimeout(timeout)
    }
  }, [phase, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-all duration-700 ${
        phase === "fadeout" ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Multiple orbital rings with varying speeds */}
          {[600, 500, 400, 300, 200].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                borderColor: `rgba(var(--primary), ${0.05 + i * 0.05})`,
                animation: `orbit-spin ${30 - i * 5}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
              }}
            />
          ))}
        </div>

        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "var(--primary)" : i % 3 === 1 ? "var(--accent)" : "white",
              opacity: 0.4,
              animation: `${i % 2 === 0 ? "float" : "particle-float"} ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              width: 100 + Math.random() * 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              transform: "rotate(-45deg)",
              animation: `shimmer ${1 + Math.random()}s ease-out infinite`,
              animationDelay: `${i * 1.5}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          {/* Multi-layer glow */}
          <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-[2] animate-pulse" />
          <div
            className="absolute inset-0 blur-2xl bg-accent/20 rounded-full scale-150 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-2xl shadow-primary/50 animate-morph">
            {/* Surface highlights */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/30" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-transparent to-black/20" />

            {/* Main orbiting satellite */}
            <div className="absolute w-full h-full" style={{ animation: "orbit-spin 3s linear infinite" }}>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/50">
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
                {/* Satellite trail */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-l from-accent/50 to-transparent" />
              </div>
            </div>

            {/* Second orbit */}
            <div className="absolute w-[150%] h-[150%]" style={{ animation: "orbit-spin 5s linear infinite reverse" }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/60 shadow-lg">
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
              </div>
            </div>

            {/* Third orbit */}
            <div className="absolute w-[180%] h-[180%]" style={{ animation: "orbit-spin 7s linear infinite" }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent/40" />
            </div>

            {/* Center rocket icon with heartbeat */}
            <Rocket className="h-12 w-12 text-primary-foreground relative z-10 animate-heartbeat" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold tracking-tight">
            <span
              className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient"
              style={{ backgroundSize: "200% auto" }}
            >
              Orbit
            </span>
            <span className="text-foreground/80 ml-3">Browser</span>
          </h1>
          <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
            Explore the universe of the web
          </p>
        </div>

        <div className="w-72 flex flex-col items-center gap-3">
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            {/* Progress fill */}
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--primary), var(--accent), var(--primary))",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s linear infinite",
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Status text with animations */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground h-5">
            {phase === "loading" && (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-loading-dot"
                      style={{ animationDelay: `${i * 0.16}s` }}
                    />
                  ))}
                </span>
                <span className="animate-pulse">
                  {progress < 30 && "Initializing engines..."}
                  {progress >= 30 && progress < 60 && "Loading star maps..."}
                  {progress >= 60 && progress < 90 && "Calibrating navigation..."}
                  {progress >= 90 && "Preparing for launch..."}
                </span>
              </div>
            )}
            {phase === "ready" && (
              <div className="flex items-center gap-2 animate-bounce-in">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-heartbeat" />
                <span>Ready for liftoff!</span>
              </div>
            )}
            {phase === "fadeout" && (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>Launching...</span>
              </div>
            )}
          </div>
        </div>

        {/* Version */}
        <p className="text-xs text-muted-foreground/50 mt-4 animate-fade-in" style={{ animationDelay: "1s" }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  )
}
