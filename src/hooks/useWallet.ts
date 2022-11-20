import { useAccount, useSignMessage, useDisconnect, useNetwork } from "wagmi"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction } from "@solana/web3.js"
import { supportedEVMChains } from "constants/supportedEVMChains"
import {
  SOL_ZEBEC_BRIDGE_ADDRESS,
  ZebecSolBridgeClient
} from "zebec-wormhole-sdk-test"
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
  signTransaction: (transaction: Transaction) => Promise<Transaction | null>
  getCorrespondingWalletAddress: (address: string) => PublicKey | undefined
  disconnect: () => void
  isSupportedChain: boolean
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

  const isSupportedChain = supportedEVMChains
    .map((c) => c.chainId)
    .includes(chainId.toString())

  const wormholeChain = EVMToWormholeChainMapping[
    chain?.id as keyof typeof EVMToWormholeChainMapping
  ] as ChainId
  const publicKey = useMemo(() => {
    const pubKey =
      solAccount.publicKey ||
      (ethAccount.isConnected && isSupportedChain
        ? new PublicKey(
            ZebecSolBridgeClient.getProxyUserKey(
              ethAccount.address as string,
              wormholeChain,
              SOL_ZEBEC_BRIDGE_ADDRESS
            ).toString()
          )
        : undefined)
    return pubKey
  }, [
    ethAccount.address,
    ethAccount.isConnected,
    solAccount.publicKey,
    wormholeChain,
    isSupportedChain
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

  const signTransaction = async (transaction: Transaction) => {
    if (network === "solana" && solAccount.signTransaction) {
      return solAccount.signTransaction(transaction)
    }
    return null
  }

  const getCorrespondingWalletAddress = (ethAddress: string) => {
    return new PublicKey(
      ZebecSolBridgeClient.getProxyUserKey(
        ethAddress as string,
        wormholeChain,
        SOL_ZEBEC_BRIDGE_ADDRESS
      ).toString()
    )
  }

  return {
    connected,
    publicKey,
    network,
    adapter,
    chainId,
    originalAddress,
    signMessage,
    signTransaction,
    disconnect: disconnectWallet,
    getCorrespondingWalletAddress,
    isSupportedChain
  }
}
