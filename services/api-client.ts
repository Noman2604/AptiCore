import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import { ApiResponse } from "@/lib/api-response"

/**
 * Centralized API client configured for AptiCore.
 * Automatically handles credentials, base URLs, and normalized error responses.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Response interceptor to unwrap data and normalize API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const errorData = error.response?.data
    const message =
      errorData?.error ||
      errorData?.message ||
      error.message ||
      "An unexpected network error occurred."

    // Normalize error message for easier consumption in UI and mutation handlers
    const normalizedError = new Error(message)
    ;(normalizedError as any).status = error.response?.status
    ;(normalizedError as any).details = errorData?.details

    return Promise.reject(normalizedError)
  }
)

/**
 * Typed wrapper around apiClient for safe requests
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.request<ApiResponse<T>>(config)
  return response.data
}
