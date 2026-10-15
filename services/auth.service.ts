import { apiClient } from "./api-client"

export interface UserDTO {
  id: string
  name: string
  email: string
  role: "user" | "admin" | "super_admin"
  isEmailVerified: boolean
}

export const AuthService = {
  /**
   * Log in user with credentials
   */
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post("/auth/login", credentials)
    return res.data
  },

  /**
   * Register a new user
   */
  async register(payload: { name: string; email: string; password: string }) {
    const res = await apiClient.post("/auth/register", payload)
    return res.data
  },

  /**
   * Get authenticated user profile
   */
  async getMe(): Promise<UserDTO | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: UserDTO }>("/auth/me")
      return res.data.data || null
    } catch {
      return null
    }
  },

  /**
   * Log out user and clear cookie
   */
  async logout() {
    const res = await apiClient.post("/auth/logout")
    return res.data
  },
}
