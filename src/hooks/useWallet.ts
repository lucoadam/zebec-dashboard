import { useAccount, useSignMessage, useDisconnect, useNetwork } from "wagmi"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { supportedEVMChains } from "constants/supportedEVMChains"

export interface ZebecWalletContext {
  connected: boolean
  publicKey: string | PublicKey | undefined
  network: string | undefined
  adapter: string | undefined
  chainId: string | undefined
  signMessage: (message: string) => Promise<string | null>
  disconnect: () => void
}
export const useZebecWallet = (): ZebecWalletContext => {
  const ethAccount = useAccount()
  const solAccount = useWallet()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const connected = solAccount.connected || ethAccount.isConnected
  const publicKey = solAccount.publicKey || ethAccount.address
  const network = solAccount.connected
    ? "solana"
    : ethAccount.isConnected
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supportedEVMChains.find((c: any) => c.chainId === chain?.id.toString())
        ?.chainName
    : ""
  const chainId = solAccount.connected
    ? "solana"
    : ethAccount.isConnected
    ? chain?.id.toString()
    : ""
  const adapter = solAccount.connected
    ? solAccount.wallet?.adapter.name
    : ethAccount.isConnected
    ? ethAccount.connector?.name
    : ""
  const disconnectWallet = solAccount.connected
    ? solAccount.disconnect
    : disconnect
  const { signMessageAsync } = useSignMessage()

  const signMessage = async (message: string) => {
    if (network === "solana" && solAccount) {
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = solAccount.signMessage
        ? await solAccount.signMessage(encodedMessage)
        : ""
      return Buffer.from(signedMessage).toString("base64")
    } else {
      const signed = await signMessageAsync({ message })
      return signed
    }
  }
  return {
    connected,
    publicKey,
    network,
    adapter,
    chainId,
    signMessage,
    disconnect: disconnectWallet
  }
}
