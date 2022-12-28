import React, { useState, useRef } from "react"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import Link from "next/link"
import { CollapseDropdown } from "../shared"
import * as Icons from "../../assets/icons"
//hooks
import { useClickOutside, useCurrentTheme } from "../../hooks"
import { formatCurrency } from "utils"
import { constants } from "constants/constants"
import { useAppSelector } from "app/hooks"

const TPSHeader = () => {
  const router = useRouter()
  const { t } = useTranslation("common")
  const [currentTheme] = useCurrentTheme()
  const languageDropdownWrapperRef = useRef(null)

  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false)

  const tokensPrice = useAppSelector((state) => state.tokenDetails.prices)
  const { tpsValue } = useAppSelector((state) => state.common)

  useClickOutside(languageDropdownWrapperRef, {
    onClickOutside: () => setToggleDropdown(false)
  })

  return (
    <>
      <div
        className={`px-6  ${
          currentTheme === "dark" ? "bg-background-secondary" : "bg-[#F5F5F5]"
        }`}
      >
        <div className="flex justify-center py-2 text-caption text-content-secondary relative">
          <div className="flex">
            <span className="mr-4 uppercase">
              {t("tps-header.sol/usd")}{" "}
              <span
                className={`${
                  tpsValue >= constants.AVERAGE_TPS
                    ? "text-warning"
                    : "text-error"
                }`}
              >
                {formatCurrency(tokensPrice["SOL"], "$")}
              </span>
            </span>
            {t("tps-header.network")}:&nbsp;
            <span
              className={`flex items-center ${
                tpsValue >= constants.AVERAGE_TPS
                  ? "text-warning"
                  : "text-error"
              } `}
            >
              {tpsValue} TPS{" "}
              <Icons.WarningTriangleIcon
                className={`w-4 h-4 ${
                  tpsValue >= constants.AVERAGE_TPS && "hidden"
                }`}
              />
            </span>
          </div>
          <div
            className={`ml-2 ${
              tpsValue >= constants.AVERAGE_TPS ? "hidden" : "hidden lg:block"
            }`}
          >
            {t("tps-header.description")}
          </div>

          <div className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2">
            <div className="relative" ref={languageDropdownWrapperRef}>
              {/* Active Language */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setToggleDropdown(!toggleDropdown)}
              >
                <span className=" text-subtitle-sm leading-none text-content-primary uppercase">
                  {router.locale}
                </span>
                <Icons.CheveronDownIcon className="w-5 h-5 text-content-secondary" />
              </div>
              {/* Language Dropdown */}
              <CollapseDropdown show={toggleDropdown} className="top-7">
                {router.locales?.map((locale) => {
                  return (
                    <Link key={locale} href={router.asPath} locale={locale}>
                      <a
                        className="text-subtitle-sm text-content-secondary py-3 pl-4 pr-6 uppercase whitespace-nowrap"
                        onClick={() => setToggleDropdown(!toggleDropdown)}
                      >
                        {locale}
                      </a>
                    </Link>
                  )
                })}
              </CollapseDropdown>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TPSHeader
