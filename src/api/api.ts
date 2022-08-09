import axios, { AxiosRequestConfig } from "axios"
import TokenService from "./services/token.service"

const api = axios.create({
  baseURL: process.env.DB_HOST,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8"
  }
})

//Request Interceptors
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

//Response Interceptors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalConfig = error.config
    const refreshToken = TokenService.getLocalRefreshToken()
    const accessToken = TokenService.getLocalAccessToken()
    if (error.response) {
      if (
        refreshToken &&
        error.response.status === 403 &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true
        try {
          const response = await api.post("/user/auth/refresh/", {
            refresh: refreshToken,
            access: accessToken
          })
          TokenService.setAfterRefresh(response.data)
          return api(originalConfig)
        } catch (error) {
          localStorage.clear()
          return null
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
