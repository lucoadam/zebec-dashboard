import { useAccount, useSignMessage } from "wagmi"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

export interface ZebecWalletContext {
  connected: boolean
  publicKey: string | PublicKey | undefined
  network: string
  signMessage: (message: string) => Promise<string | null>
}
export const useZebecWallet = (): ZebecWalletContext => {
  const ethAccount = useAccount()
  const solAccount = useWallet()
  const connected = solAccount.connected || ethAccount.isConnected
  const publicKey = solAccount.publicKey || ethAccount.address
  const network = solAccount.connected
    ? "solana"
    : ethAccount.isConnected
    ? "ethereum"
    : ""
  const { signMessageAsync } = useSignMessage()

  const signMessage = async (message: string) => {
    if (network === "solana" && solAccount) {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = solAccount.signMessage
        ? await solAccount.signMessage(encodedMessage)
        : ""
      return Buffer.from(signedMessage).toString("base64")
    } else if (network === "ethereum") {
      const signed = await signMessageAsync({ message })
      return Buffer.from(new TextEncoder().encode(signed)).toString("base64")
    }
    return null
  }
  return {
    connected,
    publicKey,
    network,
    signMessage
  }
}
