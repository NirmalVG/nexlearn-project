import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import api from "../../api/axiosInstance"
import {
  VerifyOtpResponse,
  CreateProfilePayload,
  CreateProfileResponse,
  UserProfile,
  SendOtpResponse,
  ApiErrorResponse,
} from "../types"
import axios, { AxiosError } from "axios"

interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  authStep: "INPUT_MOBILE" | "INPUT_OTP" | "CREATE_PROFILE" | "LOGGED_IN"
  mobile: string | null
  loading: boolean
  error: string | null
  message: string | null
}

const initialState: AuthState = {
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  isAuthenticated:
    typeof window !== "undefined" && !!localStorage.getItem("access_token"),
  authStep: "INPUT_MOBILE",
  mobile: null,
  loading: false,
  error: null,
  message: null,
}

export const sendOtp = createAsyncThunk<
  SendOtpResponse,
  string,
  { rejectValue: string }
>("auth/sendOtp", async (mobile, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("mobile", mobile)
    const response = await api.post<SendOtpResponse>("/auth/send-otp", formData)
    return response.data
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP"
    )
  }
})

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,
  { mobile: string; otp: string },
  { rejectValue: string }
>("auth/verifyOtp", async ({ mobile, otp }, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("mobile", mobile)
    formData.append("otp", otp)
    const response = await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      formData
    )
    return response.data
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>
    return rejectWithValue(error.response?.data?.message || "Invalid OTP")
  }
})

export const createProfile = createAsyncThunk<
  CreateProfileResponse,
  CreateProfilePayload,
  { rejectValue: string }
>("auth/createProfile", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("mobile", payload.mobile)
    formData.append("name", payload.name)
    formData.append("email", payload.email)
    formData.append("qualification", payload.qualification)
    if (payload.profile_image) {
      formData.append("profile_image", payload.profile_image)
    }

    const response = await api.post<CreateProfileResponse>(
      "/auth/create-profile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>
    return rejectWithValue(
      error.response?.data?.message || "Profile creation failed"
    )
  }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout")
  } catch (error) {
    console.error("Backend logout failed, proceeding with local logout", error)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthMessage: (state) => {
      state.message = null
      state.error = null
    },
    setAuthStep: (state, action: PayloadAction<AuthState["authStep"]>) => {
      state.authStep = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false
        state.authStep = "INPUT_OTP"
        state.mobile = action.meta.arg
        state.message = action.payload.message
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error sending OTP"
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.login && action.payload.access_token) {
          state.token = action.payload.access_token
          state.isAuthenticated = true
          state.authStep = "LOGGED_IN"
          localStorage.setItem("access_token", action.payload.access_token)
        } else {
          state.authStep = "CREATE_PROFILE"
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Invalid OTP"
      })

      .addCase(createProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.access_token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.authStep = "LOGGED_IN"
        localStorage.setItem("access_token", action.payload.access_token)
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error creating profile"
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.authStep = "INPUT_MOBILE"
        state.mobile = null

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token")
        }
      })
  },
})

export const { resetAuthMessage, setAuthStep } = authSlice.actions
export default authSlice.reducer
