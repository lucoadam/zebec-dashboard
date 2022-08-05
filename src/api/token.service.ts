const getLocalAccessToken = () => {
  const token = localStorage.getItem("token")
  return token ? token : null
}
const getLocalRefreshToken = () => {
  const refreshToken = localStorage.getItem("refresh_token")
  return refreshToken ? refreshToken : null
}

const removeToken = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
}

const TokenService = {
  getLocalAccessToken,
  getLocalRefreshToken,
  removeToken
}

export default TokenService
