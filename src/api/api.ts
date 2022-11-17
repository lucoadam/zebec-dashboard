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
    if (error.response) {
      if (
        refreshToken &&
        error.response.status === 403 &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true
        try {
          const response = await api.post("/user/auth/refresh/", {
            refresh: refreshToken
          })
          TokenService.setAccessToken(response.data)
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

export class CancelRequestAxios {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cancelRequest: any

  constructor() {
    // reference to API call
    this.cancelRequest = null
  }

  // Cancel API call if reference is there and create a new cancelToken for new API call
  cancelAndCreateToken = () => {
    if (this.cancelRequest) {
      this.cancelRequest.cancel()
    }
    this.cancelRequest = axios.CancelToken.source()
  }

  // reset Cancel token
  resetCancelToken = () => {
    this.cancelRequest = null
  }
}

export default api
