import {
  ZebecNativeStream,
  ZebecTokenStream,
  initAnchorProvider
} from "@zebec-io/stream"
import { createContext, FC, useState } from "react"
import { CLUSTER_API_URL } from "constants/cluster"
import { ZebecNativeStreamProps } from "../application/normal/stream.d"

interface ZebecContextProps {
  stream: ZebecNativeStreamProps | null
  token: ZebecNativeStreamProps | null
  initialize: (arg: any) => void
}

interface ZebecContextProviderProps {
  children: React.ReactNode
}

const ZebecContext = createContext<ZebecContextProps>({
  stream: null,
  token: null,
  initialize: () => {}
})

export const ZebecContextProvider: FC<ZebecContextProviderProps> = ({
  children
}) => {
  const [stream, setStream] = useState<ZebecNativeStreamProps | null>(null)
  const [token, setToken] = useState<ZebecNativeStreamProps | null>(null)
  const initializeHandler = (walletObject: any) => {
    const provider = initAnchorProvider(walletObject, CLUSTER_API_URL)
    const streamCtx = new ZebecNativeStream(
      provider,
      "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      true
    )
    setStream(streamCtx)
    const tokenCtx = new ZebecTokenStream(
      provider,
      "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      true
    )
    setToken(tokenCtx)
  }

  const contextValue = {
    stream: stream,
    token: token,
    initialize: initializeHandler
  }

  return (
    <ZebecContext.Provider value={contextValue}>
      {children}
    </ZebecContext.Provider>
  )
}

export default ZebecContext
