import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authService } from "@/features/auth/services/authService"
import type { LoginPayload, RegisterPayload, AuthSession} from "@/features/auth/types/authUser"

type AuthState = {
  session: AuthSession | null
  error: string | null
  isLoading: boolean
}

const initialState: AuthState = {
  session: authService.getSession(),
  error: null,
  isLoading: false
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authService.login(payload)
    } catch (error: any) {
        console.log("Error completo:", error)
  console.log("Response:", error.response)
  console.log("Data:", error.response?.data)
      return rejectWithValue(
        error.response?.data?.detail ?? "No se pudo iniciar sesion."
      )
    }
  }
)

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authService.register(payload)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ?? "No se pudo registrar."
      )
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout()
      state.session = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.session = action.payload
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.session = action.payload
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer