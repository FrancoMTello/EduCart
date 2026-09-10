export type UserRole = "CLIENT" | "ADMIN"

export type AuthUser = {
  id: number        // ← ahora es number, no string
  email: string
  first_name: string  // ← snake_case como la API
  last_name: string   // ← snake_case como la API
  role: UserRole
}

export type AuthSession = {
  token: string
  user: AuthUser
}

export type RegisterPayload = {
  email: string
  firstName: string
  lastName: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}