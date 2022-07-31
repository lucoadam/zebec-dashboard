import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useEffect } from "react"

const Common = () => {
  const walletObject = useWallet()
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)

  useEffect(() => {
    dispatch(fetchTokens())
  }, [dispatch])

  useEffect(() => {
    if (tokens.length > 0 && walletObject.publicKey) {
      dispatch(fetchWalletBalance(walletObject.publicKey))
      dispatch(fetchZebecBalance(walletObject.publicKey))
    }
  }, [dispatch, walletObject.publicKey, tokens])
  return <></>
}

export default Common
