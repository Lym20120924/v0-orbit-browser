// Sound effects system for Orbit Browser - Enhanced with 120+ sound effects
const audioContext =
  typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

const soundConfigs = {
  // Basic UI sounds (1-15)
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

  // Navigation sounds (16-30)
  refresh: { startFreq: 600, endFreq: 1200, duration: 0.25, type: "sine" as OscillatorType, gain: 0.04 },
  startup: { frequencies: [262, 330, 392, 523], duration: 0.2, type: "sine" as OscillatorType, gain: 0.08 },
  shutdown: { frequencies: [523, 392, 330, 262], duration: 0.25, type: "sine" as OscillatorType, gain: 0.07 },
  navigate: { startFreq: 300, endFreq: 900, duration: 0.12, type: "sine" as OscillatorType, gain: 0.05 },
  back: { startFreq: 800, endFreq: 400, duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },
  forward: { startFreq: 400, endFreq: 800, duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },
  home: { frequencies: [523, 659, 523], duration: 0.1, type: "sine" as OscillatorType, gain: 0.06 },
  search: { frequencies: [880, 1100, 880], duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  focus: { frequency: 1500, duration: 0.03, type: "sine" as OscillatorType, gain: 0.04 },
  blur: { frequency: 800, duration: 0.03, type: "sine" as OscillatorType, gain: 0.03 },
  scroll: { frequency: 200, duration: 0.02, type: "sine" as OscillatorType, gain: 0.01 },
  scrollEnd: { frequency: 300, duration: 0.04, type: "sine" as OscillatorType, gain: 0.02 },
  zoom: { startFreq: 500, endFreq: 1000, duration: 0.15, type: "sine" as OscillatorType, gain: 0.04 },
  zoomOut: { startFreq: 1000, endFreq: 500, duration: 0.15, type: "sine" as OscillatorType, gain: 0.04 },
  fullscreen: { frequencies: [400, 600, 800, 1000], duration: 0.1, type: "sine" as OscillatorType, gain: 0.06 },

  // Effects sounds (31-50)
  sparkle: { frequencies: [1568, 1976, 2349], duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  laser: { startFreq: 2000, endFreq: 400, duration: 0.12, type: "sawtooth" as OscillatorType, gain: 0.06 },
  power: { startFreq: 100, endFreq: 800, duration: 0.3, type: "sine" as OscillatorType, gain: 0.07 },
  glitch: { frequencies: [220, 440, 330], duration: 0.05, type: "square" as OscillatorType, gain: 0.06 },
  bubble: { frequencies: [880, 1100, 1320, 880], duration: 0.06, type: "sine" as OscillatorType, gain: 0.04 },
  coin: { frequencies: [659, 988], duration: 0.1, type: "square" as OscillatorType, gain: 0.07 },
  ding: { frequency: 2093, duration: 0.15, type: "sine" as OscillatorType, gain: 0.06 },
  bleep: { frequency: 1760, duration: 0.04, type: "square" as OscillatorType, gain: 0.05 },
  swoopUp: { startFreq: 200, endFreq: 1200, duration: 0.25, type: "sine" as OscillatorType, gain: 0.05 },
  swoopDown: { startFreq: 1200, endFreq: 200, duration: 0.25, type: "sine" as OscillatorType, gain: 0.05 },
  ambient: { frequencies: [262, 330, 392], duration: 0.8, type: "sine" as OscillatorType, gain: 0.02 },
  tap: { frequency: 800, duration: 0.02, type: "triangle" as OscillatorType, gain: 0.08 },
  knock: { frequency: 150, duration: 0.05, type: "triangle" as OscillatorType, gain: 0.1 },
  spring: { frequencies: [400, 600, 800, 1000], duration: 0.04, type: "sine" as OscillatorType, gain: 0.05 },
  magic: { frequencies: [1047, 1319, 1568, 2093], duration: 0.1, type: "sine" as OscillatorType, gain: 0.04 },
  warp: { startFreq: 100, endFreq: 2000, duration: 0.3, type: "sine" as OscillatorType, gain: 0.05 },
  teleport: {
    frequencies: [2000, 1500, 1000, 500, 1000, 1500, 2000],
    duration: 0.05,
    type: "sine" as OscillatorType,
    gain: 0.04,
  },
  portal: { startFreq: 200, endFreq: 1500, duration: 0.4, type: "sine" as OscillatorType, gain: 0.04 },
  vortex: {
    frequencies: [300, 600, 900, 1200, 900, 600, 300],
    duration: 0.06,
    type: "sine" as OscillatorType,
    gain: 0.04,
  },
  pulse: { frequencies: [440, 440, 440], duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },

  // Alert sounds (51-65)
  alert: { frequencies: [880, 880, 880], duration: 0.15, type: "square" as OscillatorType, gain: 0.08 },
  warning: { frequencies: [440, 550, 440, 550], duration: 0.12, type: "square" as OscillatorType, gain: 0.07 },
  danger: { frequencies: [220, 330, 220, 330], duration: 0.15, type: "square" as OscillatorType, gain: 0.08 },
  info: { frequencies: [660, 880], duration: 0.1, type: "sine" as OscillatorType, gain: 0.06 },
  question: { frequencies: [523, 659, 784, 880], duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  confirm: { frequencies: [523, 784], duration: 0.12, type: "sine" as OscillatorType, gain: 0.07 },
  cancel: { frequencies: [400, 300], duration: 0.1, type: "square" as OscillatorType, gain: 0.06 },
  complete: { frequencies: [523, 659, 784, 1047], duration: 0.1, type: "sine" as OscillatorType, gain: 0.07 },
  incomplete: { frequencies: [400, 350, 300], duration: 0.12, type: "square" as OscillatorType, gain: 0.05 },
  locked: { frequencies: [200, 150], duration: 0.15, type: "square" as OscillatorType, gain: 0.08 },
  unlocked: { frequencies: [400, 600, 800], duration: 0.1, type: "sine" as OscillatorType, gain: 0.07 },
  denied: { frequencies: [200, 150, 100], duration: 0.2, type: "square" as OscillatorType, gain: 0.08 },
  granted: { frequencies: [400, 600, 800, 1000], duration: 0.08, type: "sine" as OscillatorType, gain: 0.06 },
  timeout: { frequencies: [300, 250, 200], duration: 0.15, type: "square" as OscillatorType, gain: 0.06 },
  retry: { frequencies: [500, 700, 500], duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },

  // Music notes (66-80)
  noteC: { frequency: 261.63, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteD: { frequency: 293.66, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteE: { frequency: 329.63, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteF: { frequency: 349.23, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteG: { frequency: 392.0, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteA: { frequency: 440.0, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteB: { frequency: 493.88, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  noteC5: { frequency: 523.25, duration: 0.2, type: "sine" as OscillatorType, gain: 0.06 },
  majorChord: { frequencies: [261.63, 329.63, 392.0], duration: 0.3, type: "sine" as OscillatorType, gain: 0.05 },
  minorChord: { frequencies: [261.63, 311.13, 392.0], duration: 0.3, type: "sine" as OscillatorType, gain: 0.05 },
  arpeggio: { frequencies: [261.63, 329.63, 392.0, 523.25], duration: 0.1, type: "sine" as OscillatorType, gain: 0.04 },
  fanfare: { frequencies: [392, 523, 659, 784, 1047], duration: 0.12, type: "sine" as OscillatorType, gain: 0.06 },
  victory: {
    frequencies: [523, 659, 784, 1047, 1319, 1568],
    duration: 0.1,
    type: "sine" as OscillatorType,
    gain: 0.06,
  },
  defeat: { frequencies: [400, 350, 300, 250, 200], duration: 0.15, type: "sine" as OscillatorType, gain: 0.05 },
  levelUp: { frequencies: [523, 659, 784, 1047, 1319], duration: 0.08, type: "sine" as OscillatorType, gain: 0.07 },

  // Mechanical sounds (81-95)
  machineStart: { startFreq: 50, endFreq: 400, duration: 0.5, type: "sawtooth" as OscillatorType, gain: 0.04 },
  machineStop: { startFreq: 400, endFreq: 50, duration: 0.5, type: "sawtooth" as OscillatorType, gain: 0.04 },
  gear: { frequencies: [100, 150, 100, 150], duration: 0.05, type: "square" as OscillatorType, gain: 0.04 },
  servo: { startFreq: 800, endFreq: 1200, duration: 0.08, type: "sawtooth" as OscillatorType, gain: 0.03 },
  motor: { frequency: 80, duration: 0.3, type: "sawtooth" as OscillatorType, gain: 0.03 },
  switch: { frequency: 1800, duration: 0.02, type: "square" as OscillatorType, gain: 0.08 },
  relay: { frequencies: [2000, 100], duration: 0.02, type: "square" as OscillatorType, gain: 0.06 },
  click2: { frequency: 2500, duration: 0.01, type: "square" as OscillatorType, gain: 0.08 },
  snap: { frequency: 3000, duration: 0.01, type: "square" as OscillatorType, gain: 0.1 },
  clunk: { frequency: 80, duration: 0.08, type: "triangle" as OscillatorType, gain: 0.1 },
  thud: { frequency: 60, duration: 0.1, type: "triangle" as OscillatorType, gain: 0.12 },
  tick: { frequency: 4000, duration: 0.005, type: "square" as OscillatorType, gain: 0.06 },
  tock: { frequency: 2000, duration: 0.008, type: "square" as OscillatorType, gain: 0.06 },
  ratchet: { frequencies: [1000, 800, 1000, 800], duration: 0.02, type: "square" as OscillatorType, gain: 0.05 },
  hydraulic: { startFreq: 100, endFreq: 300, duration: 0.4, type: "sawtooth" as OscillatorType, gain: 0.04 },

  // Digital sounds (96-110)
  beep: { frequency: 1000, duration: 0.1, type: "sine" as OscillatorType, gain: 0.06 },
  beepHigh: { frequency: 2000, duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },
  beepLow: { frequency: 500, duration: 0.1, type: "sine" as OscillatorType, gain: 0.06 },
  beepDouble: { frequencies: [1000, 1200], duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  beepTriple: { frequencies: [800, 1000, 1200], duration: 0.06, type: "sine" as OscillatorType, gain: 0.05 },
  scan: { startFreq: 500, endFreq: 2000, duration: 0.5, type: "sine" as OscillatorType, gain: 0.03 },
  radar: { frequencies: [1000, 1200, 1000], duration: 0.15, type: "sine" as OscillatorType, gain: 0.04 },
  sonar: { frequency: 1500, duration: 0.3, type: "sine" as OscillatorType, gain: 0.04 },
  ping: { frequency: 2500, duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  pong: { frequency: 1800, duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  dataTransfer: { frequencies: [1000, 1500, 2000, 2500], duration: 0.03, type: "square" as OscillatorType, gain: 0.03 },
  upload: { startFreq: 400, endFreq: 1600, duration: 0.3, type: "sine" as OscillatorType, gain: 0.04 },
  downloadComplete: {
    frequencies: [800, 1000, 1200, 1600],
    duration: 0.08,
    type: "sine" as OscillatorType,
    gain: 0.06,
  },
  sync: { frequencies: [600, 900, 600, 900], duration: 0.06, type: "sine" as OscillatorType, gain: 0.04 },
  connect: { frequencies: [400, 800, 1200], duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },

  // Futuristic sounds (111-125)
  disconnect: { frequencies: [1200, 800, 400], duration: 0.1, type: "sine" as OscillatorType, gain: 0.05 },
  hologram: {
    frequencies: [2000, 2200, 2400, 2600, 2400, 2200, 2000],
    duration: 0.04,
    type: "sine" as OscillatorType,
    gain: 0.03,
  },
  matrix: { frequencies: [100, 200, 400, 800, 1600], duration: 0.04, type: "square" as OscillatorType, gain: 0.03 },
  cyber: { frequencies: [1500, 1800, 1500, 1200], duration: 0.05, type: "sawtooth" as OscillatorType, gain: 0.04 },
  neon: { frequencies: [2000, 2200, 2000, 1800], duration: 0.06, type: "sine" as OscillatorType, gain: 0.04 },
  plasma: { startFreq: 100, endFreq: 3000, duration: 0.4, type: "sawtooth" as OscillatorType, gain: 0.03 },
  quantum: { frequencies: [440, 880, 440, 880, 1760], duration: 0.03, type: "sine" as OscillatorType, gain: 0.04 },
  dimension: { startFreq: 2000, endFreq: 100, duration: 0.5, type: "sine" as OscillatorType, gain: 0.04 },
  timewarp: {
    frequencies: [200, 400, 800, 1600, 800, 400, 200],
    duration: 0.08,
    type: "sine" as OscillatorType,
    gain: 0.04,
  },
  flux: { frequencies: [300, 600, 300, 900, 300], duration: 0.06, type: "sine" as OscillatorType, gain: 0.04 },
  energy: { startFreq: 200, endFreq: 2000, duration: 0.2, type: "sine" as OscillatorType, gain: 0.05 },
  shield: { frequencies: [800, 1000, 1200, 1000, 800], duration: 0.08, type: "sine" as OscillatorType, gain: 0.05 },
  weapon: { startFreq: 1500, endFreq: 200, duration: 0.15, type: "sawtooth" as OscillatorType, gain: 0.06 },
  explosion: { frequencies: [100, 80, 60, 40], duration: 0.2, type: "sawtooth" as OscillatorType, gain: 0.08 },
  impact: { frequency: 50, duration: 0.15, type: "triangle" as OscillatorType, gain: 0.12 },
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

export function useSounds() {
  return {
    // Basic UI sounds
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

    // Navigation sounds
    playRefresh: () => playSound("refresh"),
    playStartup: () => playSound("startup"),
    playShutdown: () => playSound("shutdown"),
    playNavigate: () => playSound("navigate"),
    playBack: () => playSound("back"),
    playForward: () => playSound("forward"),
    playHome: () => playSound("home"),
    playSearch: () => playSound("search"),
    playFocus: () => playSound("focus"),
    playBlur: () => playSound("blur"),
    playScroll: () => playSound("scroll"),
    playScrollEnd: () => playSound("scrollEnd"),
    playZoom: () => playSound("zoom"),
    playZoomOut: () => playSound("zoomOut"),
    playFullscreen: () => playSound("fullscreen"),

    // Effects sounds
    playSparkle: () => playSound("sparkle"),
    playLaser: () => playSound("laser"),
    playPower: () => playSound("power"),
    playGlitch: () => playSound("glitch"),
    playBubble: () => playSound("bubble"),
    playCoin: () => playSound("coin"),
    playDing: () => playSound("ding"),
    playBleep: () => playSound("bleep"),
    playSwoopUp: () => playSound("swoopUp"),
    playSwoopDown: () => playSound("swoopDown"),
    playAmbient: () => playSound("ambient"),
    playTap: () => playSound("tap"),
    playKnock: () => playSound("knock"),
    playSpring: () => playSound("spring"),
    playMagic: () => playSound("magic"),
    playWarp: () => playSound("warp"),
    playTeleport: () => playSound("teleport"),
    playPortal: () => playSound("portal"),
    playVortex: () => playSound("vortex"),
    playPulse: () => playSound("pulse"),

    // Alert sounds
    playAlert: () => playSound("alert"),
    playWarning: () => playSound("warning"),
    playDanger: () => playSound("danger"),
    playInfo: () => playSound("info"),
    playQuestion: () => playSound("question"),
    playConfirm: () => playSound("confirm"),
    playCancel: () => playSound("cancel"),
    playComplete: () => playSound("complete"),
    playIncomplete: () => playSound("incomplete"),
    playLocked: () => playSound("locked"),
    playUnlocked: () => playSound("unlocked"),
    playDenied: () => playSound("denied"),
    playGranted: () => playSound("granted"),
    playTimeout: () => playSound("timeout"),
    playRetry: () => playSound("retry"),

    // Music notes
    playNoteC: () => playSound("noteC"),
    playNoteD: () => playSound("noteD"),
    playNoteE: () => playSound("noteE"),
    playNoteF: () => playSound("noteF"),
    playNoteG: () => playSound("noteG"),
    playNoteA: () => playSound("noteA"),
    playNoteB: () => playSound("noteB"),
    playNoteC5: () => playSound("noteC5"),
    playMajorChord: () => playSound("majorChord"),
    playMinorChord: () => playSound("minorChord"),
    playArpeggio: () => playSound("arpeggio"),
    playFanfare: () => playSound("fanfare"),
    playVictory: () => playSound("victory"),
    playDefeat: () => playSound("defeat"),
    playLevelUp: () => playSound("levelUp"),

    // Mechanical sounds
    playMachineStart: () => playSound("machineStart"),
    playMachineStop: () => playSound("machineStop"),
    playGear: () => playSound("gear"),
    playServo: () => playSound("servo"),
    playMotor: () => playSound("motor"),
    playSwitch: () => playSound("switch"),
    playRelay: () => playSound("relay"),
    playClick2: () => playSound("click2"),
    playSnap: () => playSound("snap"),
    playClunk: () => playSound("clunk"),
    playThud: () => playSound("thud"),
    playTick: () => playSound("tick"),
    playTock: () => playSound("tock"),
    playRatchet: () => playSound("ratchet"),
    playHydraulic: () => playSound("hydraulic"),

    // Digital sounds
    playBeep: () => playSound("beep"),
    playBeepHigh: () => playSound("beepHigh"),
    playBeepLow: () => playSound("beepLow"),
    playBeepDouble: () => playSound("beepDouble"),
    playBeepTriple: () => playSound("beepTriple"),
    playScan: () => playSound("scan"),
    playRadar: () => playSound("radar"),
    playSonar: () => playSound("sonar"),
    playPing: () => playSound("ping"),
    playPong: () => playSound("pong"),
    playDataTransfer: () => playSound("dataTransfer"),
    playUpload: () => playSound("upload"),
    playDownloadComplete: () => playSound("downloadComplete"),
    playSync: () => playSound("sync"),
    playConnect: () => playSound("connect"),

    // Futuristic sounds
    playDisconnect: () => playSound("disconnect"),
    playHologram: () => playSound("hologram"),
    playMatrix: () => playSound("matrix"),
    playCyber: () => playSound("cyber"),
    playNeon: () => playSound("neon"),
    playPlasma: () => playSound("plasma"),
    playQuantum: () => playSound("quantum"),
    playDimension: () => playSound("dimension"),
    playTimewarp: () => playSound("timewarp"),
    playFlux: () => playSound("flux"),
    playEnergy: () => playSound("energy"),
    playShield: () => playSound("shield"),
    playWeapon: () => playSound("weapon"),
    playExplosion: () => playSound("explosion"),
    playImpact: () => playSound("impact"),
  }
}
