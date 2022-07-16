import React, { FC, useEffect } from "react"
import { useTranslation } from "next-i18next"
import Image from "next/image"

import * as Icons from "assets/icons/index"
import * as Images from "assets/images"
import { exportProps } from "../ExportModal"

const PreparingReport: FC<exportProps> = ({ setCurrentStep }) => {
  useEffect(() => {
    setTimeout(() => {
      setCurrentStep(2)
    }, 5000)
  }, [setCurrentStep])

  const { t } = useTranslation("")
  return (
    <div className="flex flex-col items-center justify-center h-full ">
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
        {t("exportReport:preparing-report")}
      </div>
      <div className="pt-1 text-content-tertiary ">
        {t("exportReport:preparing-report-description")}
      </div>

      <div className="flex justify-center pt-4 text-warning">
        <div>
          <Icons.Asterik />
        </div>
        <div className="text-warning text-caption pl-2 font-semibold pb-5">
          {t("exportReport:please-dont-close-window")}
        </div>
      </div>
    </div>
  )
}
export default PreparingReport
