import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import Layout from "components/layouts/Layout"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import RejectTransactionModal from "components/modals/RejectTransactionModal"
import ResumeModal from "components/modals/ResumeModal"
import SignTransactionModal from "components/modals/SignTransactionModal"
import {
  fetchTreasuryOverallActivity,
  fetchTreasuryWeeklyActivity,
  setActiveTreasury
} from "features/treasury/treasurySlice"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { fetchTreasuryVaultBalance } from "features/treasuryBalance/treasuryVaultBalanceSlice"
import { fetchTreasuryStreamingBalance } from "features/treasuryStreamingBalance/treasuryStreamingSlice"
import { useRouter } from "next/router"
import React, { useContext, useEffect } from "react"

const TreasuryLayout = ({
  pageTitle,
  children
}: {
  pageTitle: string
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { stream, token } = useContext(ZebecContext)
  const { slug } = router.query
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { treasuries, activeTreasury } = useAppSelector(
    (state) => state.treasury
  )

  useEffect(() => {
    if (treasuries.count !== null && slug && typeof slug === "string") {
      const isTreasuryValid = treasuries.results.some(
        (treasury) => treasury.uuid === slug
      )
      if (isTreasuryValid) {
        dispatch(setActiveTreasury(slug))
      } else {
        router.push("/404")
      }
    }
    // eslint-disable-next-line
  }, [slug, treasuries])

  useEffect(() => {
    if (tokens.length > 0 && activeTreasury && stream && token) {
      //Treasury Balance
      dispatch(
        fetchTreasuryBalance({
          name: activeTreasury.name,
          address: activeTreasury.treasury_address,
          network: "solana"
        })
      )
      //Treasury Vault Balance
      dispatch(
        fetchTreasuryVaultBalance({
          name: activeTreasury.name,
          address: activeTreasury.treasury_vault_address,
          network: "solana"
        })
      )
      //Treasury Vault Streaming Balance
      dispatch(
        fetchTreasuryStreamingBalance({
          wallet: activeTreasury.treasury_address,
          stream: stream,
          token: token,
          network: "solana"
        })
      )
      //Overall Activity
      dispatch(
        fetchTreasuryOverallActivity({
          uuid: activeTreasury.uuid
        })
      )
      //Weekly Activity
      dispatch(
        fetchTreasuryWeeklyActivity({
          uuid: activeTreasury.uuid
        })
      )
    }
    // eslint-disable-next-line
  }, [tokens, activeTreasury, stream, token])

  return (
    <>
      <Layout pageTitle={pageTitle}>
        <main>{children}</main>
        {/* Pause Resume and Cancel */}
        <PauseModal />
        <CancelModal />
        <ResumeModal />
        {/* Sign Reject Modals */}
        <SignTransactionModal />
        <RejectTransactionModal />
      </Layout>
    </>
  )
}

export default TreasuryLayout
