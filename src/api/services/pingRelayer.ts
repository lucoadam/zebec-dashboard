import axios from "axios"

export const checkRelayerStatus = () => {
  return axios
    .get(`${process.env.RELAYER_API_URL}/ping`)
    .then(() => {
      return true
    })
    .catch(() => {
      return false
    })
}
