import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import {
  WalletApprovalMessageModal,
  XWalletApprovalMessageModal
} from "components/modals"
import { Toasts } from "components/shared"
// import { createVault } from "application/normal/createFeeVault"
import { fetchAddressBook } from "features/address-book/addressBookSlice"
import { setTPSValue } from "features/common/commonSlice"
import { getPreferences } from "features/settings/settingsSlice"
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
import { fetchPdaBalance } from "features/pdaBalance/pdaBalanceSlice"
import { InitializePDAModal } from "components/modals/InitializePDAModal"
import { checkPDAinitialized } from "utils/checkPDAinitialized"
import {
  setPdaBalance,
  setShowPdaInitialize
} from "features/modals/pdaInitializeModalSlice"

const Common: FC = () => {
  const walletObject = useZebecWallet()
  const solanaWalletObject = useWallet()
  const dispatch = useAppDispatch()
  const { tokens } = useAppSelector((state) => state.tokenDetails)
  const { isSigned } = useAppSelector((state) => state.common)
  const walletBalances = useAppSelector((state) => state.walletBalance.tokens)
  const zebecBalances = useAppSelector((state) => state.zebecBalance.tokens)
  const pdaBalances = useAppSelector((state) => state.pdaBalance.tokens)

  const zebecStreamingBalances = useAppSelector(
    (state) => state.zebecStreamingBalance.tokens
  )
  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)
  const { data: signer } = useSigner()
  const zebecContext = useContext(ZebecContext)

  useEffect(() => {
    dispatch(fetchTokens())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    zebecContext.initialize(solanaWalletObject)
    // eslint-disable-next-line
  }, [solanaWalletObject.connected])

  useEffect(() => {
    if (
      isSigned &&
      tokens.length > 0 &&
      walletObject.publicKey &&
      (walletObject.chainId === "solana" || signer)
    ) {
      walletBalances?.length === 0 &&
        dispatch(
          fetchWalletBalance({
            publicKey: walletObject.originalAddress,
            chainId: walletObject.chainId,
            network: walletObject.network,
            signer: walletObject.chainId !== "solana" && signer
          })
        )
      zebecBalances.length === 0 &&
        dispatch(
          fetchZebecBalance({
            publicKey: walletObject.publicKey.toString(),
            network: walletObject.network
          })
        )
      pdaBalances.length === 0 &&
        walletObject.chainId !== "solana" &&
        dispatch(
          fetchPdaBalance({
            publicKey: walletObject.publicKey.toString(),
            network: walletObject.network
          })
        )

      if (zebecContext.token && zebecContext.stream) {
        zebecStreamingBalances.length === 0 &&
          dispatch(
            fetchZebecStreamingBalance({
              wallet: walletObject.publicKey.toString(),
              stream: zebecContext.stream,
              token: zebecContext.token,
              network: walletObject.network
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
      dispatch(getPreferences())
      if (walletObject.chainId !== "solana") {
        checkPDAinitialized(walletObject.publicKey?.toString() || "").then(
          (res) => {
            if (res.isBalanceRequired) {
              dispatch(setShowPdaInitialize(true))
              dispatch(setPdaBalance(res.balance))
            } else {
              dispatch(setShowPdaInitialize(false))
            }
          }
        )
      }
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
      <XWalletApprovalMessageModal />
      <InitializePDAModal />
      {/* Fixed Divs */}
      <Toasts />
    </>
  )
}

export default Common
