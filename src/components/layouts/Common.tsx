import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { WalletApprovalMessageModal } from "components/modals"
import { Toasts } from "components/shared"
// import { createVault } from "application/normal/createFeeVault"
import { fetchAddressBook } from "features/address-book/addressBookSlice"
import { setTPSValue } from "features/common/commonSlice"
import {
  fetchTokens,
  fetchTokensPrice
} from "features/tokenDetails/tokenDetailsSlice"
import { fetchTreasury } from "features/treasury/treasurySlice"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { fetchZebecStreamingBalance } from "features/zebecStreamingBalance/zebecStreamingSlice"

import { FC, useContext, useEffect } from "react"
import { getRecentTPS } from "utils"

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
      if (zebecContext.token && zebecContext.stream) {
        dispatch(
          fetchZebecStreamingBalance({
            wallet: walletObject.publicKey.toString(),
            stream: zebecContext.stream,
            token: zebecContext.token
          })
        )
      }
    }
    // eslint-disable-next-line
  }, [walletObject.publicKey, tokens, isSigned, zebecContext])
  useEffect(() => {
    if (walletObject.connected) {
      zebecContext.initialize(walletObject)
    }
    // eslint-disable-next-line
  }, [walletObject.connected])

  useEffect(() => {
    if (isSigned) {
      dispatch(fetchAddressBook())
      dispatch(fetchTreasury())
      // TPS Value
      const fetchTPS = async () => {
        const tpsValue = await getRecentTPS()
        dispatch(setTPSValue(tpsValue))
      }
      fetchTPS()
      const interval = setInterval(fetchTPS, 60000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line
  }, [isSigned])

  // const createVaultFunction = async () => {
  //   const data = {
  //     fee_percentage: 0.25
  //   }
  //   if (zebecContext.stream) await createVault(data, zebecContext.stream)
  // }

  useEffect(() => {
    if (tokens.length > 0) {
      dispatch(fetchTokensPrice())
      const interval = setInterval(() => {
        dispatch(fetchTokensPrice())
      }, 30000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [dispatch, tokens])
  return (
    <>
      {/* Common Modals */}
      <WalletApprovalMessageModal />
      {/* Fixed Divs */}
      <Toasts />
    </>
  )
}

export default Common
