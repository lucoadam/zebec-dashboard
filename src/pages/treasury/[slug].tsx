import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import ResumeModal from "components/modals/ResumeModal"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  CollapseDropdown
} from "components/shared"
import TreasuryDetail from "components/treasury/detail/TreasuryDetail"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import { fetchTokensPrice } from "features/tokenDetails/tokenDetailsSlice"
import { setActiveTreasury } from "features/treasury/treasurySlice"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { useClickOutside } from "hooks"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

const Treasury: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const { t } = useTranslation()
  const walletObject = useWallet()
  const dispatch = useAppDispatch()

  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { treasuries, activeTreasury } = useAppSelector(
    (state) => state.treasury
  )

  const [toggleDropdown, setToggleDropdown] = useState(false)
  const dropdownWrapper = useRef(null)

  const handleDropdownClose = () => {
    setToggleDropdown(false)
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: handleDropdownClose
  })

  useEffect(() => {
    if (treasuries.results.length > 0 && slug && typeof slug === "string") {
      dispatch(setActiveTreasury(slug))
    }
    // eslint-disable-next-line
  }, [slug, treasuries])

  useEffect(() => {
    if (tokens.length > 0 && walletObject.publicKey && activeTreasury) {
      dispatch(
        fetchTreasuryBalance({
          name: activeTreasury.name,
          address: activeTreasury.treasury_address
        })
      )
    }
    // eslint-disable-next-line
  }, [tokens, walletObject, activeTreasury])

  useEffect(() => {
    dispatch(fetchTokensPrice())
    const interval = setInterval(() => {
      dispatch(fetchTokensPrice())
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch])

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb
            title={`${activeTreasury?.name}`}
            arrowBack={true}
            className="md:flex"
          >
            <BreadcrumbRightContent>
              {/* Deposit NFT and Send from treasury | Hidden for now (flex) */}
              <div className="gap-4 hidden">
                <Link href="/treasury/deposit-nft">
                  <Button
                    title={`${t("treasury:deposit-nft")}`}
                    endIcon={<Icons.PlusIncircleIcon />}
                    type="button"
                  />
                </Link>
                <div ref={dropdownWrapper} className="relative">
                  <Button
                    title={`${t("send:send-from-treasury")}`}
                    variant="gradient"
                    endIcon={<Icons.ArrowUpRightIcon />}
                    onClick={() => setToggleDropdown(!toggleDropdown)}
                  />
                  <CollapseDropdown
                    className="p-2 mt-4 w-[232px]"
                    position="right"
                    show={toggleDropdown}
                  >
                    <div className="pb-2">
                      <Link href="/treasury/send">
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(0))}
                          className="flex gap-2 px-5 py-3 items-center hover:bg-background-tertiary rounded-lg cursor-pointer text-content-primary"
                        >
                          <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                          <span>{t("send:continuous-stream")}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="pt-2">
                      <Link href="/treasury/send">
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(1))}
                          className="flex gap-2 px-5 py-3 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                        >
                          <Icons.ThunderIcon className="w-6 h-6" />
                          <span>{t("send:instant-transfer")}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="pt-2">
                      <Link href="/treasury/send">
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(2))}
                          className="flex gap-2 px-5 py-3 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                        >
                          <Icons.SquareBlockMove className="w-6 h-6" />
                          <span>{t("send:nft")}</span>
                        </div>
                      </Link>
                    </div>
                  </CollapseDropdown>
                </div>
              </div>
            </BreadcrumbRightContent>
          </Breadcrumb>

          <TreasuryDetail />
        </div>
      </div>
      <PauseModal />
      <CancelModal />
      <ResumeModal />
    </Layout>
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
