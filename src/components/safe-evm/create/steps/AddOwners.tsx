import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import {
  Button,
  CollapseDropdown,
  EmptyDataState,
  InputField
} from "components/shared"
import SelectField from "components/shared/SelectField"
import { constants } from "constants/constants"
import { useClickOutside } from "hooks"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toSubstring } from "utils"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import { Owner, StepsComponentProps } from "../CreateTreasury.d"
import OwnerLists from "../OwnerLists"

const AddOwners: FC<StepsComponentProps> = ({
  setCurrentStep,
  setTreasury,
  treasury
}) => {
  const receiverDropdownWrapper = useRef(null)
  const walletObject = useZebecWallet()
  const addressBook = useAppSelector((state) => state.address.addressBooks)

  const { t } = useTranslation()
  const router = useRouter()

  const [owners, setOwners] = useState<Owner[]>(treasury.owners)
  const [checkedOwners, setCheckedOwners] = useState<Owner[]>([])
  const [selectError, setSelectionError] = useState<boolean>(false)
  const [toggleReceiverDropdown, setToggleReceiverDropdown] = useState(false)
  const [receiverSearchData, setReceiverSearchData] = useState("")

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    setError
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addOwnersSchema)
  })

  useEffect(() => {
    if (owners.length === 0) {
      setValue("wallet", walletObject?.originalAddress?.toString())
    }
  }, [walletObject, owners, setValue])

  useEffect(() => {
    if (walletObject.chainId) {
      setValue("chainId", walletObject.chainId)
    }
  }, [walletObject.chainId, setValue])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (owners.some((owner) => owner.name === data.name)) {
      setError(
        "name",
        { type: "custom", message: "validation:name-exists" },
        {
          shouldFocus: true
        }
      )
      return
    }
    if (owners.some((owner) => owner.wallet === data.wallet)) {
      setError(
        "wallet",
        {
          type: "custom",
          message: "validation:wallet-exists"
        },
        {
          shouldFocus: true
        }
      )
      return
    }
    if (owners.length < constants.MAX_OWNERS) {
      if ([...owners, data].length > 1) {
        setSelectionError(false)
        clearErrors()
      }
      setTreasury((treasury) => ({
        ...treasury,
        owners: [...owners, data],
        minValidator: [...owners, data].length
      }))
      setOwners([...owners, data])
    }
    reset()
  }

  const handleReceiverClose = () => {
    setToggleReceiverDropdown(false)
  }
  useClickOutside(receiverDropdownWrapper, {
    onClickOutside: handleReceiverClose
  })
  const getFilteredAddressBook = () =>
    addressBook
      .filter((user) =>
        user.name.toLowerCase().includes(receiverSearchData.toLowerCase())
      )
      .filter(
        (user) => !owners.map((owner) => owner.wallet).includes(user.address)
      )

  return (
    <>
      <form
        onSubmit={
          owners.length !== constants.MAX_OWNERS
            ? handleSubmit(onSubmit)
            : (event) => event.preventDefault()
        }
        autoComplete="off"
      >
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          {t("createTreasury:second-steper.title")}
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[36px]">
          {t("createTreasury:second-steper.description")}
        </p>
        <div className="flex md:flex-nowrap sm:flex-wrap mb-2 justify-center items-center">
          <div className="flex flex-wrap wrap sm:w-auto">
            <div className="w-full lg:w-2/6 pr-2">
              <InputField
                error={!!errors.name}
                helper={t(errors?.name?.message?.toString() || "").toString()}
                label={t("createTreasury:second-steper.form.owner-name")}
                placeholder={t(
                  "createTreasury:second-steper.form.owner-name-placeholder"
                )}
                className={`w-full h-10 ${!!errors.name ? "error" : ""}`}
              >
                <input
                  type="text"
                  {...register("name")}
                  disabled={owners.length === constants.MAX_OWNERS}
                  autoFocus
                />
              </InputField>
            </div>
            <div className="w-full lg:w-4/6 mt-2 lg:mt-0">
              <InputField
                error={!!errors.wallet}
                helper={t(errors?.wallet?.message?.toString() || "").toString()}
                label="Owner Address"
                className="flex items-center"
              >
                <div className="flex">
                  <div className="flex-1">
                    <input
                      type="text"
                      className={`w-full h-[40px] ${!!errors.wallet ? "error" : ""
                        }`}
                      placeholder={t(
                        "createTreasury:second-steper.form.owner-address"
                      )}
                      {...register("wallet")}
                      disabled={
                        owners.length === 0 ||
                        owners.length === constants.MAX_OWNERS
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-7 h-7 grid ml-2 place-content-center border border-outline rounded-full cursor-pointer bg-primary"
                  >
                    <Icons.AddOwnerIcon className="text-base text-content-primary" />
                  </button>{" "}
                </div>
              </InputField>
            </div>
          </div>
        </div>
        <div ref={receiverDropdownWrapper} className="mt-[21px] relative">
          <div
            onClick={() => {
              if (toggleReceiverDropdown) setToggleReceiverDropdown(false)
            }}
            className="w-full"
          >
            <Button
              size="small"
              className=""
              title={`${t(
                "createTreasury:second-steper.buttons.choose-from-address-book"
              )}`}
              endIcon={<Icons.ArrowIcon className="text-xs" />}
              onClick={() => {
                if (owners.length === 0) {
                  trigger("name")
                  return
                }
                setToggleReceiverDropdown(!toggleReceiverDropdown)
              }}
              type="button"
            />
          </div>

          <CollapseDropdown
            show={toggleReceiverDropdown}
            className="w-full z-[99]"
            position="left"
          >
            <div className="rounded-lg bg-background-primary border border-outline">
              <Icons.SearchIcon className="text-lg absolute left-[20px] top-[16px] text-content-secondary" />
              <input
                className="is-search w-full h-[48px] bg-background-primary !border-t-0 !border-l-0 !border-r-0 !rounded-none"
                placeholder={t(
                  "createTreasury:second-steper.search-address-book"
                )}
                type="text"
                onChange={(e) => setReceiverSearchData(e.target.value)}
              />
              <div className="divide-y divide-outline h-[206px] overflow-auto">
                {getFilteredAddressBook().map((user) => (
                  <div
                    key={user.address}
                    className="w-full h-[68px] flex gap-[15px] border-outline p-4 justify-start items-center hover:bg-background-light"
                  >
                    <input
                      type="checkbox"
                      className="hover:cursor-pointer h-5 w-5 rounded focus:ring-offset-0 focus:ring-0 shadow-none outline-none border-2 border-outline bg-transparent"
                      checked={
                        owners.some((owner) => owner.wallet === user.address)
                          ? true
                          : undefined
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCheckedOwners([
                            ...checkedOwners,
                            {
                              name: user.name,
                              wallet: user.address
                            }
                          ])
                        } else {
                          setCheckedOwners(
                            checkedOwners.filter(
                              (owner) => owner.wallet !== user.address
                            )
                          )
                        }
                      }}
                    />
                    <div>
                      <p className="text-sm text-content-primary">
                        {user.name}
                      </p>
                      <p className="text-xs text-content-tertiary">
                        {toSubstring(user.address, 28, false)}
                      </p>
                    </div>
                  </div>
                ))}
                {addressBook.length === 0 && (
                  <EmptyDataState
                    className="bg-transparent !px-[56px] !py-[28px] text-sm"
                    emptyStateClassName="w-[114px] h-[80px]"
                    messageClassName="w-[239px] mt-2 text-content-primary text-center"
                    message={t(
                      "createTreasury:second-steper.empty-address-book"
                    )}
                  />
                )}
                {addressBook.length > 0 &&
                  getFilteredAddressBook().length === 0 && (
                    <EmptyDataState
                      className="bg-transparent !px-[56px] !py-[28px] text-sm"
                      emptyStateClassName="w-[114px] h-[80px]"
                      messageClassName="w-[239px] mt-2 text-content-primary text-center"
                      message={t(
                        "createTreasury:second-steper.all-address-added"
                      )}
                    />
                  )}
              </div>
              {getFilteredAddressBook().length !== 0 ? (
                <div
                  onClick={() => {
                    if ([...owners, ...checkedOwners].length > 1) {
                      setSelectionError(false)
                      clearErrors()
                    }
                    setTreasury((treasury) => ({
                      ...treasury,
                      owners: [...owners, ...checkedOwners],
                      minValidator: [...owners, ...checkedOwners].length
                    }))
                    setOwners([...owners, ...checkedOwners])
                    setCheckedOwners([])
                    setToggleReceiverDropdown(false)
                  }}
                  className="cursor-pointer hover:bg-background-light text-content-primary grid place-items-center p-[15px] border-t border-outline"
                >
                  {t("createTreasury:second-steper.title")}
                </div>
              ) : (
                <div
                  className="cursor-pointer hover:bg-background-light text-content-primary grid place-items-center p-4 border-t border-outline rounded-b-lg"
                  onClick={() => router.push("/address-book")}
                >
                  {t("createTreasury:second-steper.add-address")}
                </div>
              )}
            </div>
          </CollapseDropdown>
        </div>
        <p className="text-content-primary font-normal text-sm mt-6 mb-3">
          {t("createTreasury:added-owners")}
        </p>
        <OwnerLists
          className="w-full"
          owners={owners}
          setOwners={setOwners}
          setTreasury={setTreasury}
        />
        <p className="text-content-primary font-normal text-sm mt-[32px] mb-[12px]">
          {t("createTreasury:min-confirmation-required-text")}
        </p>
        <div className="flex ">
          {/* dropdown */}
          <div className="w-full sm:w-full flex justify-start items-center text-content-primary">
            <SelectField
              value={treasury.minValidator}
              onSelected={(value, error = false) => {
                setTreasury((treasury) => ({
                  ...treasury,
                  minValidator: value
                }))
                setSelectionError(error)
              }}
              className="mr-3 w-[70px]"
              totalItems={owners.length}
            />{" "}
            {`${t("createTreasury:sub-text-out-of")} ${owners.length} ${t(
              "createTreasury:owners"
            )}`}
          </div>
        </div>
        {selectError && (
          <p className="text-error text-xs ml-[12px] mt-1">
            {t("validation:at-least-two-owners-required")}
          </p>
        )}
        <Button
          title="Continue"
          variant="gradient"
          type="button"
          size="medium"
          className="w-full justify-center mt-[32px]"
          onClick={() => {
            if (owners.length >= 2 && !selectError) {
              setCurrentStep(2)
            } else {
              if (owners.length < 2) {
                trigger("name")
                trigger("wallet")
              }
              setSelectionError(true)
            }
          }}
        />
      </form>
      <Button
        title="Go Back"
        size="medium"
        className="w-full justify-center mt-[12px]"
        onClick={() => setCurrentStep(0)}
      />
    </>
  )
}

export default AddOwners
