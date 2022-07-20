import React, { FC, ReactElement } from "react"
import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import { withdrawProps } from "../data.d"
import * as Icons from "assets/icons"

export interface confirmWithdrawStep {
  text: string
  image: ReactElement
}

const ConfirmWithdraw: FC<withdrawProps> = ({ setCurrentStep, fees }) => {
  const { t } = useTranslation("transactions")

  const confirmWithdrawStepsList: confirmWithdrawStep[] = [
    {
      text: `${t("withdraw.withdrawing")}`,
      image: <Icons.WithdrawDownLeft />
    },
    {
      text: `${t("withdraw.fees")} (${fees}%)`,
      image: <Icons.Line />
    },
    {
      text: `${t("withdraw.withdraw-amount")}`,
      image: <Icons.Equals />
    }
  ]

  return (
    <div className="">
      <div className="text-content-secondary font-semibold pb-4">
        {t("withdraw.sure-you-want-to-withdraw")} 101 SOL?
      </div>

      <div className="bg-background-tertiary rounded-md p-4 ">
        {confirmWithdrawStepsList.map(
          (step: confirmWithdrawStep, index: number) => (
            <div
              className={`${
                index == confirmWithdrawStepsList.length - 1
                  ? "flex gap-x-2 text-content-secondary"
                  : "withdrawsteps-container flex gap-x-2 pb-4 text-content-secondary"
              }`}
              key={`withdrawsteps-${index}`}
            >
              {confirmWithdrawStepsList[index].image}
              <div className="text-caption">
                {" "}
                {confirmWithdrawStepsList[index].text} 20000 SOL
              </div>
            </div>
          )
        )}
      </div>
      <div className="pt-3 pb-3">
        <Button
          className="w-full "
          variant="gradient"
          title={`${t("withdraw.yes-withdraw")}`}
          onClick={() => {
            setCurrentStep(2)
          }}
        />
      </div>
      <div className="">
        <Button
          className="w-full "
          title={`${t("withdraw.cancel")}`}
          onClick={() => {
            setCurrentStep(-1)
          }}
        />
      </div>
    </div>
  )
}
export default ConfirmWithdraw
