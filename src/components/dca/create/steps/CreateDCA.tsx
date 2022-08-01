import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { AmountField } from "components/dca/components/AmountField"
import { StepsComponentProps } from "components/dca/create/CreateDCA.d"
import { Button, CollapseDropdown } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useRef, useState } from "react"
import { useForm } from "react-hook-form"

export const CreateDCA: FC<StepsComponentProps> = ({ setCurrentStep }) => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const dropdownWrapper = useRef(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [depositFrom, setDepositFrom] = useState("Zebec balance")

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          {t("createDCA:first-steper.title")}
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[32px]">
          {t("createDCA:first-steper.description")}
        </p>
        <div className="flex flex-col gap-6">
          <div className="relative" ref={dropdownWrapper}>
            <label
              className={`text-content-secondary text-xs font-medium mb-1`}
            >
              Deposit From
            </label>
            <div
              onClick={() => setToggleDropdown(!toggleDropdown)}
              className="cursor-pointer relative text-content-primary"
            >
              <input
                type="text"
                value={depositFrom}
                className={`cursor-pointer h-[40px] w-full !pr-12`}
                placeholder={"Select where you’re depositing from"}
                readOnly
              />
              <Icons.CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
            </div>
            <CollapseDropdown
              show={toggleDropdown}
              className="mt-8 w-full z-[99]"
              position="left"
            >
              <div className="bg-background-primary border border-outline rounded-lg divide-y divide-outline max-h-[206px] overflow-auto">
                {["Wallet", "Zebec balance"].map((item) => (
                  <div
                    key={item}
                    onClick={(event) => {
                      event.stopPropagation()
                      setToggleDropdown(false)
                      setDepositFrom(item)
                    }}
                    className={`border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light`}
                  >
                    <div className="text-sm text-content-primary">{item}</div>
                  </div>
                ))}
              </div>
            </CollapseDropdown>
          </div>
          <div className="relative">
            <label
              className={`text-content-secondary text-xs font-medium mb-1`}
            >
              Token to Deposit
            </label>
            <AmountField
              register={register}
              setValue={setValue}
              tokenSymbol={"SOL"}
              tokens={tokenDetails}
              name="amount"
              error={errors.amount1?.message?.toString()}
            />
          </div>
        </div>
        <Button
          title={`${t("common:buttons.deposit-and-create-dca")}`}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="button"
          onClick={() => {
            setCurrentStep(1)
          }}
        />
      </form>
    </>
  )
}
