import api from "api/api"
import { ZebecWalletContext } from "hooks/useWallet"
import TokenService from "./token.service"

export const login = async (walletObject: ZebecWalletContext) => {
  const { publicKey, signMessage, network } = walletObject
  if (publicKey && signMessage) {
    try {
      const message =
        "Zebec Wallet Verification" +
        "(" +
        `${Math.floor(Date.now() / 1000)}` +
        ")" +
        ":" +
        `${publicKey.toString()}`

      const encodedMessage = new TextEncoder().encode(message)

      const b64 = await signMessage(message)

      const pubkey = Buffer.from(
        typeof publicKey === "string"
          ? new TextEncoder().encode(publicKey)
          : publicKey.toBytes()
      ).toString("base64")
      const messagetob = Buffer.from(encodedMessage).toString("base64")

      const data = {
        wallet_address: network === "solana" ? pubkey : publicKey,
        signature: b64,
        message: network === "solana" ? messagetob : message,
        network
      }

      try {
        let response = {
          status: 200,
          data: {
            access:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjYyMzY4MDgwLCJpYXQiOjE3NjIyODE2ODAsImp0aSI6IjM5YzRkMWQ0YzczZjQxYzViNzQ0ZmVmMmI3NzE1Njk3Iiwid2FsbGV0X2FkZHJlc3MiOiIweDU4OEFkNTYxY0JkMzU2MTUzODlkYzMxMTUzMjk0NzMzOWRiZTVDRjgifQ.MndSw_FYj8QmSLyYeCU-Rq48eRpAAmyjr1Ioaza1kos",
            refresh: ""
          }
        }
        if (network === "solana") {
          response = await api.post(`/user/auth/login/`, data)
          TokenService.setTokens(response.data)
        } else if (network === "ethereum") {
          TokenService.setTokens(response.data)
        }
        return response
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
