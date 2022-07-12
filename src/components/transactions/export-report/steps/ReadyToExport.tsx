import React, { FC, Fragment, useEffect, useRef, useState } from "react"
import { exportProps } from "../data"
import { useTranslation } from "next-i18next"
import * as Icons from "assets/icons"
import Loading from "assets/images/gifs/withdrawing.gif"

const ReadyToExport: FC<exportProps> = ({
  setCurrentStep,

}) => {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-16">
        <img {...Loading} />
      </div>
      <div className="text-content-secondary text-heading-5 pt-4 font-semibold">
        {t("withdraw.withdrawing")}
      </div>
      <div className="text-primary-contrast text-heading-5 ">
        
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
export default ReadyToExport
