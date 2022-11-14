import api from "api/api"
import { ZebecWalletContext } from "hooks/useWallet"
import TokenService from "./token.service"

export const login = async (walletObject: ZebecWalletContext) => {
  const { publicKey, signMessage, network, originalAddress } = walletObject
  if (publicKey && originalAddress && signMessage) {
    try {
      const message =
        "Zebec Wallet Verification" +
        "(" +
        `${Math.floor(Date.now() / 1000)}` +
        ")" +
        ":" +
        `${originalAddress.toString()}`

      const encodedMessage = new TextEncoder().encode(message)

      const b64 = await signMessage(message)

      const pubKey = Buffer.from(publicKey.toBytes()).toString("base64")

      const evm_address = Buffer.from(
        new TextEncoder().encode(originalAddress.toString())
      ).toString("base64")

      const messagetob = Buffer.from(encodedMessage).toString("base64")

      const data = {
        wallet_address: pubKey,
        signature: b64,
        message: messagetob,
        network,
        ...(network !== "solana"
          ? {
              evm_address
            }
          : {})
      }

      try {
        const response = await api.post(`/user/auth/login/`, data)
        // commented console.log(response)
        TokenService.setTokens(response.data)
        return response
      } catch (error) {
        // commented console.log(error)
      }
    } catch (error) {
      // commented console.log(error)
    }
  }
}
