// Tipos globales compartidos entre features

export type ApiError = {
  message: string
  status: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}