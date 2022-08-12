import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
// import { createVault } from "application/normal/createFeeVault"
import { fetchAddressBook } from "features/address-book/addressBookSlice"
import { fetchTokens } from "features/tokenDetails/tokenDetailsSlice"
import { fetchTreasury } from "features/treasury/treasurySlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"

import { FC, useContext, useEffect } from "react"

const Common: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenDetails: any
}> = ({ tokenDetails }) => {
  const walletObject = useWallet()
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { isSigned } = useAppSelector((state) => state.signTransaction)

  const zebecContext = useContext(ZebecContext)

  useEffect(() => {
    dispatch(fetchTokens(tokenDetails))
  }, [dispatch, tokenDetails])

  useEffect(() => {
    if (isSigned && tokens.length > 0 && walletObject.publicKey) {
      dispatch(fetchWalletBalance(walletObject.publicKey))
      dispatch(fetchZebecBalance(walletObject.publicKey))
    }
    // eslint-disable-next-line
  }, [walletObject.publicKey, tokens, isSigned])
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
    // eslint-disable-next-line
  }, [isSigned])

  // const createVaultFunction = async () => {
  //   const data = {
  //     fee_percentage: 0.25
  //   }
  //   if (zebecContext.stream) await createVault(data, zebecContext.stream)
  // }

  return <></>
}

export default Common
