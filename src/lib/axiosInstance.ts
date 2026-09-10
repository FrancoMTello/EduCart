import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor — agrega el token automáticamente en cada request
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem("educart.auth.session")
  if (stored) {
    const session = JSON.parse(stored)
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

export default axiosInstance