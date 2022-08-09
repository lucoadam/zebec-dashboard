import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { fetchAddressBook } from "features/address-book/addressBookSlice"
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice"
import { fetchTreasury } from "features/treasury/treasurySlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useContext, useEffect } from "react"

const Common = () => {
  const walletObject = useWallet()
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { isSigned } = useAppSelector((state) => state.signTransaction)

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
    if (isSigned) {
      dispatch(fetchAddressBook(walletObject.publicKey?.toString()))
      dispatch(fetchTreasury(walletObject.publicKey?.toString()))
    }
    console.log("signning wallet and fetching data", isSigned)
    // eslint-disable-next-line
  }, [isSigned])

  return <></>
}

export default Common
