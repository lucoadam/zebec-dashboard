import {
  ZebecNativeStream,
  ZebecTokenStream,
  initAnchorProvider
} from "zebec-anchor-sdk-npmtest/packages/stream"
import {
  ZebecNativeTreasury,
  initAnchorProvider as treasuryInitAnchorProvider
} from "zebec-anchor-sdk-npmtest/packages/multisig"
import { createContext, FC, useState } from "react"
import { CLUSTER_API_URL } from "constants/cluster"
import {
  ZebecNativeStreamProps,
  ZebecTreasuryProps
} from "../application/normal/stream.d"

const feeReceiverWallet = "4w41teXtLLxVc6ShSSgpu9pmxLvxrL1bsxNrFGm7f5BJ"

interface ZebecContextProps {
  stream: ZebecNativeStreamProps | null
  token: ZebecNativeStreamProps | null
  treasury: ZebecTreasuryProps | null
  initialize: (arg: any) => void
}

interface ZebecContextProviderProps {
  children: React.ReactNode
}

const ZebecContext = createContext<ZebecContextProps>({
  stream: null,
  token: null,
  treasury: null,
  initialize: () => {}
})

export const ZebecContextProvider: FC<ZebecContextProviderProps> = ({
  children
}) => {
  const [stream, setStream] = useState<ZebecNativeStreamProps | null>(null)
  const [token, setToken] = useState<ZebecNativeStreamProps | null>(null)
  const [treasury, setTreasury] = useState<ZebecTreasuryProps | null>(null)
  const initializeHandler = (walletObject: any) => {
    const provider = initAnchorProvider(walletObject, CLUSTER_API_URL)
    const streamCtx = new ZebecNativeStream(provider, feeReceiverWallet, true)
    setStream(streamCtx)
    const tokenCtx = new ZebecTokenStream(provider, feeReceiverWallet, true)
    setToken(tokenCtx)
    //Treasury
    const treasuryProvider = treasuryInitAnchorProvider(
      walletObject,
      CLUSTER_API_URL
    )
    const treasuryCtx = new ZebecNativeTreasury(
      treasuryProvider,
      feeReceiverWallet,
      true
    )
    setTreasury(treasuryCtx)
  }

  const contextValue = {
    stream: stream,
    token: token,
    treasury: treasury,
    initialize: initializeHandler
  }

  return (
    <ZebecContext.Provider value={contextValue}>
      {children}
    </ZebecContext.Provider>
  )
}

export default ZebecContext
