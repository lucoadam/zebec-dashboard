import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchAddressBook } from "features/address-book/addressBookSlice"
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice"
import { fetchTreasury } from "features/treasury/treasurySlice"
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
      dispatch(fetchWalletBalance(walletObject.publicKey))
      dispatch(fetchZebecBalance(walletObject.publicKey))
    }
    // eslint-disable-next-line
  }, [walletObject.publicKey, tokens])
  useEffect(() => {
    if (walletObject.connected) {
      zebecContext.initialize(walletObject)
    }
    // eslint-disable-next-line
  }, [walletObject.connected])

  useEffect(() => {
    if (walletObject.publicKey) {
      dispatch(fetchAddressBook(walletObject.publicKey?.toString()))
      dispatch(fetchTreasury(walletObject.publicKey?.toString()))
    }
    // eslint-disable-next-line
  }, [walletObject.publicKey])

  return <></>
}

export default Common
