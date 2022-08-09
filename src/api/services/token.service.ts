const getLocalAccessToken = () => {
  const token = localStorage.getItem("access_token")
  return token ? token : null
}
const getLocalRefreshToken = () => {
  const refreshToken = localStorage.getItem("refresh_token")
  return refreshToken ? refreshToken : null
}

const setTokens = (data: { access_key: string; refresh_key: string }) => {
  localStorage.setItem("access_token", data.access_key)
  localStorage.setItem("refresh_token", data.refresh_key)
}

const setAfterRefresh = (data: { access: string }) => {
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
  removeTokens,
  setAfterRefresh
}

export default TokenService
