import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { logout, clearError, loginThunk, registerThunk } from "@/features/auth/slice/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()

  const session = useSelector((state: RootState) => state.auth.session)
  const error = useSelector((state: RootState) => state.auth.error)
  const isLoading = useSelector((state: RootState) => state.auth.isLoading)

  return {
    isAuthenticated: Boolean(session),
    session,
    user: session?.user ?? null,
    error,
    isLoading,

    // Devuelve la promesa para poder hacer await en el componente
    login: (email: string, password: string) => {
      return dispatch(loginThunk({ email, password }))
    },

    logout: () => {
      dispatch(logout())
    },

    // Devuelve la promesa para poder hacer await en el componente
    register: (firstName: string, lastName: string, email: string, password: string) => {
      return dispatch(registerThunk({ firstName, lastName, email, password }))
    },

    clearError: () => {
      dispatch(clearError())
    }
  }
}