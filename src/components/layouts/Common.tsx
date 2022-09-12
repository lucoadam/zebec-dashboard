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
import { useZebecWallet } from "hooks/useWallet"

import { FC, useContext, useEffect } from "react"
import { useSigner } from "wagmi"
import { getRecentTPS } from "utils"
import { useWallet } from "@solana/wallet-adapter-react"

const Common: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenDetails: any
}> = ({ tokenDetails }) => {
  const walletObject = useZebecWallet()
  const solanaWalletObject = useWallet()
  const dispatch = useAppDispatch()
  const { tokens } = useAppSelector((state) => state.tokenDetails)
  const { isSigned } = useAppSelector((state) => state.common)
  const walletBalances = useAppSelector((state) => state.walletBalance.tokens)
  const zebecBalances = useAppSelector((state) => state.zebecBalance.tokens)
  const zebecStreamingBalances = useAppSelector(
    (state) => state.zebecStreamingBalance.tokens
  )
  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)
  const { data: signer } = useSigner()
  const zebecContext = useContext(ZebecContext)

  useEffect(() => {
    dispatch(fetchTokens(tokenDetails))
    // eslint-disable-next-line
  }, [tokenDetails])

  useEffect(() => {
    if (solanaWalletObject.connected) {
      zebecContext.initialize(solanaWalletObject)
    }
    // eslint-disable-next-line
  }, [solanaWalletObject.connected])

  useEffect(() => {
    if (
      isSigned &&
      tokens.length > 0 &&
      walletObject.publicKey &&
      (walletObject.chainId === "solana" || signer)
    ) {
      walletBalances.length === 0 &&
        dispatch(
          fetchWalletBalance({
            publicKey: walletObject.publicKey,
            chainId: walletObject.chainId,
            signer: walletObject.chainId !== "solana" && signer
          })
        )
      zebecBalances.length === 0 &&
        dispatch(fetchZebecBalance(walletObject.publicKey))
      if (zebecContext.token && zebecContext.stream) {
        zebecStreamingBalances.length === 0 &&
          dispatch(
            fetchZebecStreamingBalance({
              wallet: walletObject.publicKey.toString(),
              stream: zebecContext.stream,
              token: zebecContext.token
            })
          )
      }

      //fetch tokens price
      Object.keys(tokensPrice).length === 0 && dispatch(fetchTokensPrice())
      const interval = setInterval(() => {
        dispatch(fetchTokensPrice())
      }, 60000)

      return () => {
        clearInterval(interval)
      }
    }
    // eslint-disable-next-line
  }, [walletObject.publicKey, tokens, isSigned, zebecContext, signer])

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
