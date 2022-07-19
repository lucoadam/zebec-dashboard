import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import TreasuryDetail from "components/treasury/detail/TreasuryDetail"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { useClickOutside } from "hooks"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  CollapseDropdown
} from "components/shared"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import CancelModal from "components/modals/CancelModal"
import PauseModal from "components/modals/PauseModal"
import ResumeModal from "components/modals/ResumeModal"
import { fetchTokensPrice } from "features/tokenDetails/tokenDetailsSlice"

const Treasury: NextPage = () => {
  const { t } = useTranslation()
  const walletObject = useWallet()

  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const dispatch = useAppDispatch()

  const [toggleDropdown, setToggleDropdown] = useState(false)
  const dropdownWrapper = useRef(null)
  const handleDropdownClose = () => {
    setToggleDropdown(false)
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: handleDropdownClose
  })

  useEffect(() => {
    if (tokens.length > 0 && walletObject.publicKey) {
      dispatch(
        fetchTreasuryBalance({
          name: "my treasury",
          address: "DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"
        })
      )
      // dispatch(fetchZebecStreamingBalance(walletObject.publicKey));
      // dispatch(fetchTreasuryStreamingBalance("DNMTFn1Eag5wuYusuPHfcE9b7iCzQMz2avnC2eajv1Cf"));
    }
  }, [dispatch, tokens, walletObject])

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
          <Breadcrumb title="Zebec Safe" arrowBack={true}>
            <BreadcrumbRightContent>
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
                </CollapseDropdown>
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
        "send"
      ]))
    }
  }
}

export default Treasury
