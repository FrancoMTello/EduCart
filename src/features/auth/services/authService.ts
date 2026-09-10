import axiosInstance from "@/lib/axiosInstance"
import type { AuthSession } from "@/features/auth/types/authUser"

export const authService = {

  // Lee la sesión guardada en localStorage
  getSession(): AuthSession | null {
    const stored = localStorage.getItem("educart.auth.session")
    if (!stored) return null
    try {
      return JSON.parse(stored) as AuthSession
    } catch {
      localStorage.removeItem("educart.auth.session")
      return null
    }
  },

  // Llama al backend para registrarse
  async register(data: {
    email: string
    firstName: string
    lastName: string
    password: string
  }): Promise<AuthSession> {
    const response = await axiosInstance.post("/auth/register", {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password,
    })
    const session = response.data as AuthSession
    localStorage.setItem("educart.auth.session", JSON.stringify(session))
    return session
  },

  // Llama al backend para loguearse
  async login(data: {
    email: string
    password: string
  }): Promise<AuthSession> {
    const response = await axiosInstance.post("/auth/login", {
      email: data.email,
      password: data.password,
    })
    const session = response.data as AuthSession
    localStorage.setItem("educart.auth.session", JSON.stringify(session))
    return session
  },

  // Borra la sesión local
  logout(): void {
    localStorage.removeItem("educart.auth.session")
  }
}