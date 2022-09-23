import { useAccount, useSignMessage, useDisconnect, useNetwork } from "wagmi"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { supportedEVMChains } from "constants/supportedEVMChains"
import { ZebecSolBridgeClient } from "@zebec-io/zebec-wormhole-sdk"
import { EVMToWormholeChainMapping } from "constants/wormholeChains"
import { ChainId } from "@certusone/wormhole-sdk"
import { useMemo } from "react"

export interface ZebecWalletContext {
  connected: boolean
  publicKey: PublicKey | undefined
  network: string | undefined
  adapter: string | undefined
  chainId: string | undefined
  originalAddress: string | PublicKey | undefined
  signMessage: (message: string) => Promise<string | null>
  disconnect: () => void
}
export const useZebecWallet = (): ZebecWalletContext => {
  const ethAccount = useAccount()
  const solAccount = useWallet()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const connected = useMemo(() => {
    return solAccount.connected || ethAccount.isConnected
  }, [solAccount.connected, ethAccount.isConnected])

  const network = useMemo(() => {
    return solAccount.connected
      ? "solana"
      : ethAccount.isConnected
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supportedEVMChains.find((c: any) => c.chainId === chain?.id.toString())
          ?.chainName
      : ""
  }, [solAccount.connected, ethAccount.isConnected, chain])

  const chainId = useMemo(() => {
    return solAccount.connected
      ? "solana"
      : ethAccount.isConnected
      ? chain?.id.toString() || ""
      : ""
  }, [solAccount.connected, ethAccount.isConnected, chain])

  const publicKey = useMemo(() => {
    const pubKey =
      solAccount.publicKey ||
      (ethAccount.isConnected
        ? new PublicKey(
            ZebecSolBridgeClient.getXChainUserKey(
              ethAccount.address as string,
              EVMToWormholeChainMapping[
                chain?.id as keyof typeof EVMToWormholeChainMapping
              ] as ChainId
            ).toString()
          )
        : undefined)
    return pubKey
  }, [
    ethAccount.address,
    chain?.id,
    ethAccount.isConnected,
    solAccount.publicKey
  ])

  const originalAddress = useMemo(() => {
    return solAccount.publicKey || ethAccount.address
  }, [solAccount.publicKey, ethAccount.address])

  const adapter = useMemo(() => {
    return solAccount.connected
      ? solAccount.wallet?.adapter.name
      : ethAccount.isConnected
      ? ethAccount.connector?.name
      : ""
  }, [
    solAccount.connected,
    solAccount.wallet?.adapter.name,
    ethAccount.isConnected,
    ethAccount.connector?.name
  ])

  const disconnectWallet = useMemo(() => {
    return solAccount.connected ? solAccount.disconnect : disconnect
  }, [solAccount.connected, solAccount.disconnect, disconnect])

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
    originalAddress,
    signMessage,
    disconnect: disconnectWallet
  }
}
