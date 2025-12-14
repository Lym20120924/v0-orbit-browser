export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  createdAt: Date
}

// 模拟用户数据存储（实际应用中应使用数据库）
const users: Map<string, { user: User; password: string }> = new Map()

export function registerUser(
  email: string,
  username: string,
  password: string,
): { success: boolean; user?: User; error?: string } {
  if (users.has(email)) {
    return { success: false, error: "Email already registered" }
  }

  const user: User = {
    id: Date.now().toString(),
    email,
    username,
    createdAt: new Date(),
  }

  users.set(email, { user, password })
  return { success: true, user }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const userData = users.get(email)

  if (!userData) {
    return { success: false, error: "User not found" }
  }

  if (userData.password !== password) {
    return { success: false, error: "Invalid password" }
  }

  return { success: true, user: userData.user }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" }
  }
  return { valid: true }
}
