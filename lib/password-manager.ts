// Password Manager utilities
export interface SavedPassword {
  id: string
  website: string
  username: string
  password: string
  lastUsed: Date
  createdAt: Date
}

export interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
  suggestions: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0
  const suggestions: string[] = []

  if (password.length >= 8) score++
  else suggestions.push("Use at least 8 characters")

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  else suggestions.push("Use both uppercase and lowercase letters")

  if (/\d/.test(password)) score++
  else suggestions.push("Include at least one number")

  if (/[^a-zA-Z\d]/.test(password)) score++
  else suggestions.push("Add special characters")

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"]

  return {
    score,
    label: labels[score],
    color: colors[score],
    suggestions,
  }
}

export function generatePassword(length = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}

export function savePassword(website: string, username: string, password: string): SavedPassword {
  const savedPassword: SavedPassword = {
    id: Date.now().toString(),
    website,
    username,
    password,
    lastUsed: new Date(),
    createdAt: new Date(),
  }

  const passwords = getSavedPasswords()
  passwords.push(savedPassword)
  localStorage.setItem("orbit_passwords", JSON.stringify(passwords))

  return savedPassword
}

export function getSavedPasswords(): SavedPassword[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("orbit_passwords")
  if (!data) return []
  return JSON.parse(data)
}

export function deletePassword(id: string) {
  const passwords = getSavedPasswords().filter((p) => p.id !== id)
  localStorage.setItem("orbit_passwords", JSON.stringify(passwords))
}

export function getPasswordForWebsite(url: string): SavedPassword | null {
  const passwords = getSavedPasswords()
  const domain = new URL(url).hostname
  return passwords.find((p) => p.website.includes(domain)) || null
}
