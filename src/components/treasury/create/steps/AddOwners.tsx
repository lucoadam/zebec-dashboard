import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import * as Icons from "assets/icons"
import { Button, InputField } from "components/shared"
import SelectField from "components/shared/SelectField"
import { constants } from "constants/constants"
import { useTranslation } from "next-i18next"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import { isValidWallet } from "utils/isValidtWallet"
import * as Yup from "yup"
import { Owner, StepsComponentProps } from "../CreateTreasury.d"
import OwnerLists from "../OwnerLists"

const AddOwners: FC<StepsComponentProps> = ({
  setCurrentStep,
  setTreasury,
  treasury
}) => {
  const useWalletObject = useWallet()

  const { t } = useTranslation()

  const [owners, setOwners] = React.useState<Owner[]>(treasury.owners)
  const [selectError, setSelectionError] = React.useState<boolean>(false)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("validation:name-required"))
      .test("is-name-unique", t("validation:name-exists"), (value) =>
        owners.every((owner) => owner.name !== value)
      ),
    wallet: Yup.string()
      .required(t("validation:wallet-required"))
      .test("is-valid-address", t("validation:wallet-invalid"), (value) =>
        isValidWallet(value)
      )
      .test("is-wallet-exists", t("validation:wallet-exists"), (value) =>
        owners.every((owner) => owner.wallet !== value)
      )
  })
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  React.useEffect(() => {
    if (owners.length === 0) {
      setValue("wallet", useWalletObject?.publicKey?.toString())
    }
  }, [useWalletObject, owners, setValue])

  React.useEffect(() => {
    setTreasury((treasury) => ({
      ...treasury,
      minValidator: owners.length
    }))
  }, [owners, setTreasury])

  const onSubmit = (data: any) => {
    if (owners.length < constants.MAX_OWNERS) {
      setOwners([...owners, data])
      setTreasury((treasury) => ({
        ...treasury,
        owners: [...owners, data]
      }))
    }
    reset()
  }
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
          <div className="flex sm:w-auto">
            <div className="sm:w-full md:w-2/6 pr-2">
              <InputField
                error={!!errors.name}
                helper={errors?.name?.message?.toString() || ""}
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
            <div className="sm:w-full md:w-4/6">
              <InputField
                error={!!errors.wallet}
                helper={errors?.wallet?.message?.toString() || ""}
                label="Owner Address"
                className="flex items-center"
              >
                <div className="flex">
                  <div className="w-5/6">
                    <input
                      type="text"
                      className={`w-full h-[40px] ${
                        !!errors.wallet ? "error" : ""
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
                    <Icons.AddOwnerIcon className="text-base" />
                  </button>{" "}
                </div>
              </InputField>
            </div>
          </div>
          {/* <div className="w-full md:w-7 pt-2.5">
           
          </div> */}
        </div>
        <Button
          size="small"
          className="mt-[21px]"
          title={t(
            "createTreasury:second-steper.buttons.choose-from-address-book"
          )}
          endIcon={<Icons.ArrowIcon className="text-xs" />}
          type="button"
        />
        <p className="text-content-primary font-normal text-sm mt-6 mb-3">
          {t("createTreasury:added-owners")}
        </p>
        <OwnerLists className="w-full" owners={owners} setOwners={setOwners} />
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
          <p className="text-content-secondary text-xs ml-[12px] mt-1">
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
