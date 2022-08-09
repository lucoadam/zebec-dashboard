import { WalletContextState } from "@solana/wallet-adapter-react"
import api from "api/api"
import TokenService from "./token.service"

export const login = async (walletObject: WalletContextState) => {
  const { publicKey, signMessage } = walletObject
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

      const signedMessage = await signMessage(encodedMessage)

      const b64 = Buffer.from(signedMessage).toString("base64")
      const pubkey = Buffer.from(publicKey.toBytes()).toString("base64")
      const messagetob = Buffer.from(encodedMessage).toString("base64")

      const data = {
        wallet_address: pubkey,
        signature: b64,
        message: messagetob
      }

      try {
        const response = await api.post(`/user/auth/login/`, data)
        TokenService.setTokens(response.data)
        return response
      } catch (error) {
        console.log(error)
      }
    } catch (error) {}
  }
}
