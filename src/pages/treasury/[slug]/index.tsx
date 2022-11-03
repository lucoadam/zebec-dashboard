import { useAppDispatch, useAppSelector } from "app/hooks"
import Overview from "components/treasury/detail/components/overview/Overview"
import TreasuryDetailsLayout from "components/treasury/detail/TreasuryDetailsLayout"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { fetchTreasuryPendingTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { useZebecWallet } from "hooks/useWallet"
import type { NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Treasury: NextPage = () => {
  const dispatch = useAppDispatch()
  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  useEffect(() => {
    if (tokens.length > 0 && activeTreasury) {
      //Treasury Pending Transactions
      dispatch(
        fetchTreasuryPendingTransactions({
          treasury_uuid: activeTreasury.uuid
        })
      )
    }
    // eslint-disable-next-line
  }, [tokens, activeTreasury])

  const history = useRouter()
  const walletObject = useZebecWallet()

  useEffect(() => {
    if (walletObject.chainId !== "solana") {
      history.replace("/")
    }
  }, [walletObject, history])

  return (
    <TreasuryLayout pageTitle="Zebec - Treasury">
      <TreasuryDetailsLayout>
        <Overview />
      </TreasuryDetailsLayout>
    </TreasuryLayout>
  )
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "treasury",
        "treasuryOverview",
        "treasurySettings",
        "validation",
        "transactions",
        "exportReport",
        "send"
      ]))
    }
  }
}

export default Treasury
