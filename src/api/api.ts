import axios, { AxiosRequestConfig } from "axios"
import TokenService from "./token.service"

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
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
  (error) => {
    const originalConfig = error.config
    const refreshToken = TokenService.getLocalRefreshToken()
    if (error.response) {
      if (
        refreshToken &&
        error.response.status === 401 &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true
        try {
          // Do something, call refreshToken() request for example;
          // return a request
          return api(originalConfig)
        } catch (error) {
          return null
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
