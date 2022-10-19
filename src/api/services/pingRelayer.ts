import axios from "axios"

export const checkRelayerStatus = () => {
  const url = `https://zebec-relayer.alishdahal.com.np/ping`
  return axios
    .get(url)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })
}
