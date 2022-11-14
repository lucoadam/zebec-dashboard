/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZebecNativeStream,
  ZebecTokenStream,
  initAnchorProvider
} from "zebec-anchor-sdk-npmtest/packages/stream"
import {
  ZebecNativeTreasury,
  ZebecTokenTreasury
} from "zebec-anchor-sdk-npmtest/packages/multisig"
import { createContext, FC, useState } from "react"
import { CLUSTER_API_URL, RPC_NETWORK } from "constants/cluster"

const feeReceiverWallet = process.env.FEE_RECEIVER_WALLET || ""

interface ZebecContextProps {
  stream: ZebecNativeStream | null
  token: ZebecTokenStream | null
  treasury: ZebecNativeTreasury | null
  treasuryToken: ZebecTokenTreasury | null
  initialize: (arg: any) => void
}

interface ZebecContextProviderProps {
  children: React.ReactNode
}

const ZebecContext = createContext<ZebecContextProps>({
  stream: null,
  token: null,
  treasury: null,
  treasuryToken: null,
  initialize: () => null
})

export const ZebecContextProvider: FC<ZebecContextProviderProps> = ({
  children
}) => {
  const [stream, setStream] = useState<ZebecNativeStream | null>(null)
  const [token, setToken] = useState<ZebecTokenStream | null>(null)
  const [treasury, setTreasury] = useState<ZebecNativeTreasury | null>(null)
  const [treasuryToken, setTreasuryToken] = useState<ZebecTokenTreasury | null>(
    null
  )

  const initializeHandler = (walletObject: any) => {
    //Logger
    const logger =
      RPC_NETWORK === "devnet" || RPC_NETWORK === "testnet" ? true : false
    //Provider
    const provider = initAnchorProvider(walletObject, CLUSTER_API_URL, {
      commitment: "finalized",
      preflightCommitment: "confirmed"
    })
    //Normal
    const streamCtx = new ZebecNativeStream(provider, feeReceiverWallet, logger)
    setStream(streamCtx)
    const tokenCtx = new ZebecTokenStream(provider, feeReceiverWallet, logger)
    setToken(tokenCtx)
    //Treasury
    const treasuryCtx = new ZebecNativeTreasury(
      provider,
      feeReceiverWallet,
      logger
    )
    setTreasury(treasuryCtx)
    const treasuryTokenCtx = new ZebecTokenTreasury(
      provider,
      feeReceiverWallet,
      logger
    )
    setTreasuryToken(treasuryTokenCtx)
  }

  const contextValue = {
    stream: stream,
    token: token,
    treasury: treasury,
    treasuryToken: treasuryToken,
    initialize: initializeHandler
  }

  return (
    <ZebecContext.Provider value={contextValue}>
      {children}
    </ZebecContext.Provider>
  )
}

export default ZebecContext
