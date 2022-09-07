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
        const response = await api.post(`/user/auth/login/`, data)
        TokenService.setTokens(response.data)
        return response
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
