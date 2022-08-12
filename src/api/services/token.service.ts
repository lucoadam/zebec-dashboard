const getLocalAccessToken = () => {
  const token = localStorage.getItem("access_token")
  return token ? token : null
}
const getLocalRefreshToken = () => {
  const refreshToken = localStorage.getItem("refresh_token")
  return refreshToken ? refreshToken : null
}

const setTokens = (data: { access: string; refresh: string }) => {
  localStorage.setItem("access_token", data.access)
  localStorage.setItem("refresh_token", data.refresh)
}
const setAccessToken = (data: { access: string }) => {
  localStorage.setItem("access_token", data.access)
}

const removeTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

const TokenService = {
  getLocalAccessToken,
  getLocalRefreshToken,
  setTokens,
  setAccessToken,
  removeTokens
}

export default TokenService
