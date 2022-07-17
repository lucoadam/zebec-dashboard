import React, { FC } from "react"
import Image from "next/image"
import { useTranslation } from "next-i18next"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import { Button } from "components/shared"
import { exportProps } from "../ExportModal"
import { toggleExportModal } from "features/export-report/exportSlice"
import { useAppDispatch } from "app/hooks"

const ReadyToExport: FC<exportProps> = ({ setCurrentStep }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

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
        {t("exportReport:report-ready")}
      </div>

      <div className="flex pt-2 text-content-tertiary text-center pb-8">
        {t("exportReport:report-ready-description")}
      </div>

      <Button
        className={`w-full `}
        variant="gradient"
        type="submit"
        title={`${t("exportReport:download-report")}`}
        endIcon={<Icons.Download />}
        onClick={() => {
          dispatch(toggleExportModal())
          setCurrentStep(0)
        }}
      />
    </div>
  )
}
export default ReadyToExport
