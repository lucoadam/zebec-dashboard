import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import Layout from "components/layouts/Layout"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import ResumeModal from "components/modals/ResumeModal"
import { setActiveTreasury } from "features/treasury/treasurySlice"
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
    if (treasuries.results.length > 0 && slug && typeof slug === "string") {
      dispatch(setActiveTreasury(slug))
    }
    // eslint-disable-next-line
  }, [slug, treasuries])

  useEffect(() => {
    if (tokens.length > 0 && activeTreasury && stream && token) {
      //Treasury Balance
      dispatch(
        fetchTreasuryBalance({
          name: activeTreasury.name,
          address: activeTreasury.treasury_address
        })
      )
      //Treasury Vault Balance
      dispatch(
        fetchTreasuryVaultBalance({
          name: activeTreasury.name,
          address: activeTreasury.treasury_vault_address
        })
      )
      //Treasury Vault Streaming Balance
      dispatch(
        fetchTreasuryStreamingBalance({
          wallet: activeTreasury.treasury_address,
          stream: stream,
          token: token
        })
      )
    }
    // eslint-disable-next-line
  }, [tokens, activeTreasury, stream, token])

  return (
    <>
      <Layout pageTitle={pageTitle}>
        <main>{children}</main>
        <PauseModal />
        <CancelModal />
        <ResumeModal />
      </Layout>
    </>
  )
}

export default TreasuryLayout
