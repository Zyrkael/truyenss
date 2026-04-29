import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// ─── Các phương thức hay dùng ─────────────────────────────────────────────────
const get = <T>(url: string, config?: AxiosRequestConfig) =>
  http.get<T>(url, config).then((res) => res.data)

const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  http.post<T>(url, data, config).then((res) => res.data)

const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  http.put<T>(url, data, config).then((res) => res.data)

const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  http.patch<T>(url, data, config).then((res) => res.data)

const del = <T>(url: string, config?: AxiosRequestConfig) =>
  http.delete<T>(url, config).then((res) => res.data)

export { get, post, put, patch, del }
export default http
