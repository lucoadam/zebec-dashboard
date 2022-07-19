import React, { FC, useEffect, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, InputField } from "components/shared"
import { Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Icons from "assets/icons"
import { setLoading, toggleHarvestModal } from "features/modals/harvestSlice"

const HarvestModal: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")
  const [harvestAmount, setHarvestAmount] = useState<number>()
  const { show, loading } = useAppSelector((state) => state.harvest)
  const validationSchema = Yup.object().shape({
    harvestAmount: Yup.string()
      .required(t("yield-farming.enter-yield-farming-amount"))
      .test("is-not-zero", t("yield-farming.not-zero"), (value) => {
        {
          console.log("value", typeof value)
        }
        return typeof value === "string" && parseFloat(value) > 0
      })
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data)
  }
  useEffect(() => {
    if (harvestAmount != null && harvestAmount != 0) {
      setValue("harvestAmount", harvestAmount)
    }
  }, [harvestAmount, setValue])

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleHarvestModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("yield-farming.harvest-rewards")}
          </div>
          <div className="text-content-secondary text-caption ">
            {t("yield-farming.harvest-rewards-subtitle")}
          </div>
          <div className="flex mt-4">
            <div className="text-content-secondary text-caption font-medium">
              {t("yield-farming.token")}
            </div>
            <div className="ml-auto text-content-tertiary text-caption">
              {t("yield-farming.balance")} 240 {t("yield-farming.token")}
            </div>
          </div>
          {/* Input Field */}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="pt-3 pb-3">
              <InputField
                label={t("")}
                className="relative text-content-primary"
                helper={errors.harvestAmount?.message?.toString() ?? ""}
                error={!!errors.harvestAmount?.message}
              >
                <div>
                  <input
                    className={`w-full h-10 ${
                      !!errors.harvestAmount?.message && "error"
                    }`}
                    placeholder={t("yield-farming.enter-amount")}
                    type="number"
                    {...register("harvestAmount")}
                    autoFocus
                  />
                  <Button
                    size="small"
                    title={`${t("yield-farming.max")}`}
                    className={`absolute right-2.5 top-2 text-content-primary `}
                    onClick={() => {
                      setHarvestAmount(10)
                    }}
                    type="button"
                  />
                </div>
              </InputField>
            </div>
            <div className="pt-3 pb-3">
              <Button
                disabled={loading}
                endIcon={loading ? <Icons.Loading /> : <></>}
                className={`w-full `}
                variant="gradient"
                type="button"
                title={
                  loading
                    ? `${t("yield-farming.harvesting")}`
                    : `${t("yield-farming.harvest")}`
                }
                onClick={() => {
                  dispatch(setLoading(true))
                  setTimeout(() => {
                    dispatch(toggleHarvestModal())
                    dispatch(setLoading(false))
                  }, 5000)
                }}
              />
            </div>
          </form>
        </>
      }
    </Modal>
  )
}
export default HarvestModal
