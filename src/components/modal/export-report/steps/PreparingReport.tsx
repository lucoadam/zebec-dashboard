import React, { FC, useEffect } from "react"
import { useTranslation } from "next-i18next"

import * as Icons from "assets/icons/index"
import Loading from "assets/images/gifs/withdrawing.gif"
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
        <img {...Loading} />
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
