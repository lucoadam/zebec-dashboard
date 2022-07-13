import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { exportProps } from "../data"
import { useTranslation } from "next-i18next"
import * as Icons from "assets/icons"
import Loading from "assets/images/gifs/withdrawing.gif"
import { Button } from "components/shared"

const ReadyToExport: FC<exportProps> = ({ setCurrentStep }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-16">
        <img {...Loading} />
      </div>
      <div className="text-content-secondary text-heading-5 pt-4 font-semibold">
        {t("exportReport:report-ready")}
      </div>

      <div className="flex pt-2 text-content-tertiary text-center pb-8">
        {t("exportReport:report-ready-description")}
      </div>

      <Button
        className={`w-full `}
        variant="gradient"
        type="submit"
        title={t("exportReport:download-report")}
        endIcon={<Icons.Download />}
        onClick={() => setCurrentStep(-1)}
      />
    </div>
  )
}
export default ReadyToExport
