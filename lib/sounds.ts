// Sound effects system for Orbit Browser
const audioContext =
  typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

// Sound configurations
const soundConfigs = {
  click: { frequency: 800, duration: 0.05, type: "sine" as OscillatorType, gain: 0.1 },
  hover: { frequency: 1200, duration: 0.02, type: "sine" as OscillatorType, gain: 0.03 },
  success: { frequencies: [523, 659, 784], duration: 0.15, type: "sine" as OscillatorType, gain: 0.08 },
  error: { frequencies: [330, 262], duration: 0.2, type: "square" as OscillatorType, gain: 0.06 },
  notification: { frequencies: [880, 1047], duration: 0.1, type: "sine" as OscillatorType, gain: 0.07 },
  tab: { frequency: 600, duration: 0.04, type: "triangle" as OscillatorType, gain: 0.08 },
  tabClose: { frequency: 400, duration: 0.06, type: "triangle" as OscillatorType, gain: 0.06 },
  typing: { frequency: 1000, duration: 0.01, type: "sine" as OscillatorType, gain: 0.02 },
  whoosh: { startFreq: 400, endFreq: 800, duration: 0.15, type: "sine" as OscillatorType, gain: 0.05 },
  pop: { frequency: 1000, duration: 0.03, type: "sine" as OscillatorType, gain: 0.1 },
  swoosh: { startFreq: 200, endFreq: 600, duration: 0.2, type: "sine" as OscillatorType, gain: 0.04 },
  chime: { frequencies: [1047, 1319, 1568], duration: 0.3, type: "sine" as OscillatorType, gain: 0.06 },
  toggle: { frequencies: [600, 800], duration: 0.05, type: "triangle" as OscillatorType, gain: 0.07 },
  bookmark: { frequencies: [784, 988, 1175], duration: 0.12, type: "sine" as OscillatorType, gain: 0.07 },
  download: { frequencies: [523, 659, 784, 1047], duration: 0.08, type: "sine" as OscillatorType, gain: 0.06 },
  refresh: { startFreq: 600, endFreq: 1200, duration: 0.25, type: "sine" as OscillatorType, gain: 0.04 },
  startup: { frequencies: [262, 330, 392, 523], duration: 0.2, type: "sine" as OscillatorType, gain: 0.08 },
}

type SoundName = keyof typeof soundConfigs

// Play a simple tone
function playTone(frequency: number, duration: number, type: OscillatorType, gain: number) {
  if (!audioContext) return

  try {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

    gainNode.gain.setValueAtTime(gain, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (e) {
    // Silently fail if audio context is not available
  }
}

// Play a sweep sound (whoosh effect)
function playSweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType, gain: number) {
  if (!audioContext) return

  try {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration)

    gainNode.gain.setValueAtTime(gain, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (e) {
    // Silently fail
  }
}

// Play a chord or sequence
function playSequence(frequencies: number[], duration: number, type: OscillatorType, gain: number) {
  if (!audioContext) return

  frequencies.forEach((freq, index) => {
    setTimeout(
      () => {
        playTone(freq, duration, type, gain)
      },
      index * (duration * 500),
    )
  })
}

// Sound state
let soundEnabled = true

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
}

export function getSoundEnabled() {
  return soundEnabled
}

// Main play sound function
export function playSound(name: SoundName) {
  if (!soundEnabled || !audioContext) return

  // Resume audio context if suspended (needed for some browsers)
  if (audioContext.state === "suspended") {
    audioContext.resume()
  }

  const config = soundConfigs[name]

  if ("frequencies" in config) {
    playSequence(config.frequencies, config.duration, config.type, config.gain)
  } else if ("startFreq" in config) {
    playSweep(config.startFreq, config.endFreq, config.duration, config.type, config.gain)
  } else {
    playTone(config.frequency, config.duration, config.type, config.gain)
  }
}

// Hook for using sounds
export function useSounds() {
  return {
    playClick: () => playSound("click"),
    playHover: () => playSound("hover"),
    playSuccess: () => playSound("success"),
    playError: () => playSound("error"),
    playNotification: () => playSound("notification"),
    playTab: () => playSound("tab"),
    playTabClose: () => playSound("tabClose"),
    playTyping: () => playSound("typing"),
    playWhoosh: () => playSound("whoosh"),
    playPop: () => playSound("pop"),
    playSwoosh: () => playSound("swoosh"),
    playChime: () => playSound("chime"),
    playToggle: () => playSound("toggle"),
    playBookmark: () => playSound("bookmark"),
    playDownload: () => playSound("download"),
    playRefresh: () => playSound("refresh"),
    playStartup: () => playSound("startup"),
  }
}
