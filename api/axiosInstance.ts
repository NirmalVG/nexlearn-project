import axios, { InternalAxiosRequestConfig } from "axios"

const BASE_URL = "https://nexlearn.noviindusdemosites.in"

const api = axios.create({
  baseURL: BASE_URL,
})

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a real app, you might access the store here, or use localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
