import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import TreasuryDetail from "components/treasury/detail/TreasuryDetail"
import { fetchTreasuryBalance } from "features/treasuryBalance/treasuryBalanceSlice"
import { useClickOutside } from "hooks"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import * as Icons from "assets/icons"
import Layout from "components/layouts/Layout"
import { Button, CollapseDropdown, IconButton } from "components/shared"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import CancelModal from "components/transactions/outgoing-modals/CancelModal/CancelModal"
import PauseModal from "components/transactions/outgoing-modals/PauseModal/PauseModal"
import ResumeModal from "components/transactions/outgoing-modals/ResumeModal/ResumeModal"

const Treasury: NextPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
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

  return (
    <Layout pageTitle="Zebec - Treasury">
      <div className="pt-[76px]">
        <div className="container">
          <div className="flex justify-between items-center px-[35px] pb-[24px]">
            <div className="flex justify-start items-center">
              <IconButton
                className="cursor-pointer mr-[19px]"
                onClick={() => {
                  router.push("/treasury")
                }}
                variant="plain"
                icon={<Icons.LeftArrowIcon />}
              />

              <h4 className="text-heading-4 font-semibold text-content-primary">
                Zebec Safe
              </h4>
            </div>
            <div ref={dropdownWrapper} className="flex gap-x-3 relative">
              <Button
                title="Send from Treasury"
                variant="gradient"
                endIcon={<Icons.ArrowUpRightIcon />}
                onClick={() => setToggleDropdown(!toggleDropdown)}
              />
              <CollapseDropdown
                className="p-2 mt-4"
                position="right"
                show={toggleDropdown}
              >
                <div className="pb-2">
                  <Link href="/treasury/send">
                    <div
                      onClick={() => dispatch(setTreasurySendActiveTab(0))}
                      className="flex gap-2 px-5 py-3 items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                    >
                      <Icons.DoubleCircleDottedLineIcon />
                      <span className="text-content-primary">
                        {t("send:continuous-stream")}
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="pt-2">
                  <Link href="/treasury/send">
                    <div
                      onClick={() => dispatch(setTreasurySendActiveTab(1))}
                      className="flex gap-2 px-5 py-3 items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                    >
                      <Icons.ThunderIcon />
                      <span className="text-content-primary">
                        {t("send:instant-transfer")}
                      </span>
                    </div>
                  </Link>
                </div>
              </CollapseDropdown>
            </div>
          </div>
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
