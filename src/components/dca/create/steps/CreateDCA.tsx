import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import { AmountField } from "components/dca/components/AmountField"
import { StepsComponentProps } from "components/dca/create/CreateDCA.d"
import { Button, CollapseDropdown } from "components/shared"
import { WalletToken } from "features/walletBalance/walletBalanceSlice.d"
import { useTranslation } from "next-i18next"
import { StaticImageData } from "next/image"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { formatCurrency } from "utils"
import { getBalance } from "utils/getBalance"
import * as Yup from "yup"

export const CreateDCA: FC<StepsComponentProps> = ({
  setCurrentStep,
  setDCA
}) => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]
  const { t } = useTranslation()
  const [balances, setBalances] = useState<WalletToken[]>([])
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const walletBalance = useAppSelector((state) => state.walletBalance.tokens)
  const zebecBalance = useAppSelector((state) => state.zebecBalance.tokens)
  const dropdownWrapper = useRef(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [depositFrom, setDepositFrom] = useState("Zebec balance")
  const [currentToken, setCurrentToken] = useState({
    symbol: "SOL",
    image: ""
  })

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required(t(`validation:tokenAmount-required`))
      .typeError(t("validation:tokenAmount-invalid"))
      .min(0, "Must be greater than zero")
      .test("is-max", t("validation:max"), (value) => {
        if (depositFrom === "Zebec balance") {
          return (
            !!value &&
            value <= getBalance(zebecBalance, currentToken.symbol ?? "SOL")
          )
        } else {
          return (
            !!value &&
            value <= getBalance(walletBalance, currentToken.symbol ?? "SOL")
          )
        }
      })
  })

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
    setDCA({
      depositFrom,
      symbol: currentToken.symbol,
      depositAmount: data.amount
    })
    setCurrentStep(1)
  }

  useEffect(() => {
    if (depositFrom === "Zebec balance") {
      setBalances(zebecBalance)
    } else {
      setBalances(walletBalance)
    }
  }, [depositFrom, zebecBalance, walletBalance])

  const [showTreasuryList, setShowTreasuryList] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [treasury, setTreasury] = useState({})

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
                {!showTreasuryList &&
                  ["Wallet", "Zebec balance", "Treasury"].map((item) => (
                    <div
                      key={item}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (item === "Treasury") {
                          setShowTreasuryList(true)
                        } else {
                          setDepositFrom(item)
                          setToggleDropdown(false)
                        }
                      }}
                      className={`border-outline cursor-pointer overflow-hidden p-4 justify-start items-center hover:bg-background-light`}
                    >
                      <div
                        className={twMerge(
                          "text-sm  flex justify-between",
                          item === depositFrom ||
                            (depositFrom.includes("Treasury") &&
                              item === "Treasury")
                            ? "text-primary"
                            : "text-content-primary",
                          item === "Treasury" ? "relative" : ""
                        )}
                      >
                        {depositFrom.includes("Treasury") && item === "Treasury"
                          ? depositFrom
                          : item}{" "}
                        <div className="flex gap-3">
                          {item === depositFrom && <Icons.CheckIcon />}
                          {item === "Treasury" && (
                            <>
                              <Icons.CheveronDownIcon className="text-content-primary -rotate-90" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {showTreasuryList && (
                  <div className="py-[17px]">
                    <div
                      onClick={() => {
                        setShowTreasuryList(false)
                      }}
                      className="flex px-[17px] items-center mb-2 gap-[18.52px] cursor-pointer hover:text-primary"
                    >
                      <Icons.CheveronDownIcon className="rotate-90" /> All
                    </div>
                    {[
                      {
                        name: "Zebec Safe",
                        balance: 20000
                      },
                      {
                        name: "Kalpanik Treasury",
                        balance: 20000
                      }
                    ].map((item, index) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          setTreasury(item)
                          setDepositFrom(`Treasury: ${item.name}`)
                          setShowTreasuryList(false)
                          setToggleDropdown(false)
                        }}
                        className="flex justify-between p-2.5 px-[17px]  hover:bg-background-light cursor-pointer"
                      >
                        <div
                          className={twMerge(
                            "flex text-body justify-start items-center gap-1.5",
                            depositFrom.includes(item.name)
                              ? "text-primary"
                              : ""
                          )}
                        >
                          <img
                            src={Avatars[index % 3].src}
                            width={16}
                            height={16}
                            className="object-contain"
                            alt={`Avatar ${index + 1}`}
                          />
                          {item.name}
                        </div>
                        <div className="text-content-tertiary text-caption">
                          {formatCurrency(item.balance, "$", 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              tokens={tokenDetails}
              walletBalance={balances}
              currentToken={currentToken}
              setCurrentToken={setCurrentToken}
              name="amount"
              error={errors.amount?.message?.toString()}
            />
          </div>
        </div>
        <Button
          title={`${t("common:buttons.deposit-and-create-dca")}`}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />
      </form>
    </>
  )
}
