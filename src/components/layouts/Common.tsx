import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useEffect, useContext } from "react"
import ZebecContext from "app/zebecContext"

const Common = () => {
  const walletObject = useWallet()
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const zebecContext = useContext(ZebecContext)

  useEffect(() => {
    dispatch(fetchTokens())
  }, [dispatch])

  useEffect(() => {
    if (tokens.length > 0 && walletObject.publicKey) {
      dispatch(
        fetchWalletBalance("Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs")
      )
      dispatch(fetchZebecBalance(walletObject.publicKey))
    }
  }, [dispatch, walletObject.publicKey, tokens])
  useEffect(() => {
    if (walletObject.connected) {
      zebecContext.initialize(walletObject)
    }
  }, [walletObject.connected])
  return <></>
}

export default Common
