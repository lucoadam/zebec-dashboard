import React, { FC, useEffect } from "react"
import Image from "next/image"
import { withdrawProps } from "../data.d"
import { useTranslation } from "next-i18next"
import * as Icons from "assets/icons"
import * as Images from "assets/images"

const Withdrawing: FC<withdrawProps> = ({ setCurrentStep, withdrawAmount }) => {
  const { t } = useTranslation("transactions")
  useEffect(() => {
    setTimeout(() => {
      setCurrentStep(-1)
    }, 1000)
    // eslint-disable-next-line
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-16">
        <Image
          src={Images.LoadingGif}
          alt="loading"
          layout="fixed"
          width={64}
          height={64}
        />
      </div>
      <div className="text-content-secondary text-heading-5 pt-4 font-semibold">
        {t("withdraw.withdrawing")}
      </div>
      <div className="text-primary-contrast text-heading-5 ">
        {withdrawAmount} SOL
      </div>
      <div className="flex justify-center pt-4">
        <div>
          <Icons.Asterik />
        </div>
        <div className="text-warning text-caption pl-2 font-semibold">
          {t("withdraw.dont-close-window")}
        </div>
      </div>
    </div>
  )
}
export default Withdrawing
