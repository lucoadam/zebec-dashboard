import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  CollapseDropdown
} from "components/shared"
import TreasuryDetail from "components/treasury/detail/TreasuryDetail"
import TreasuryLayout from "components/treasury/detail/TreasuryLayout"
import { setTreasurySendActiveTab } from "features/common/commonSlice"
import { fetchTreasuryPendingTransactions } from "features/treasuryTransactions/treasuryTransactionsSlice"
import { useClickOutside } from "hooks"
import { useZebecWallet } from "hooks/useWallet"
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
  const dispatch = useAppDispatch()

  const tokens = useAppSelector((state) => state.tokenDetails.tokens)
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { pendingTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
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
    if (tokens.length > 0 && activeTreasury) {
      //Treasury Transactions
      pendingTransactions.count === null &&
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
      <div className="pt-[76px]">
        <div className="container">
          <Breadcrumb
            title={activeTreasury?.name || ""}
            arrowBack={true}
            className="md:flex"
          >
            <BreadcrumbRightContent>
              {/* Deposit NFT and Send from treasury */}
              <div className="flex gap-4">
                {/* <Link href="/treasury/deposit-nft">
                  <Button
                    title={`${t("treasury:deposit-nft")}`}
                    endIcon={<Icons.PlusIncircleIcon />}
                    type="button"
                  />
                </Link> */}
                <div ref={dropdownWrapper} className="relative">
                  <Button
                    title={`${t("send:send-from-treasury-vault")}`}
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
                      <Link href={`/treasury/${slug}/send`}>
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
                      <Link href={`/treasury/${slug}/send`}>
                        <div
                          onClick={() => dispatch(setTreasurySendActiveTab(1))}
                          className="flex gap-2 px-5 py-3 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                        >
                          <Icons.ThunderIcon className="w-6 h-6" />
                          <span>{t("send:instant-transfer")}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="pt-2 hidden">
                      <Link href={`/treasury/${slug}/send`}>
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

          {/* Treasury Details */}
          <TreasuryDetail />
        </div>
      </div>
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
