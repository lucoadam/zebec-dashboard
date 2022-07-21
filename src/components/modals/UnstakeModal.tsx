import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button, InputField, Modal } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

import * as Icons from "assets/icons"
import { setLoading, toggleUnStakeModal } from "features/modals/unStakeSlice"

const UnStakeModal: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")
  const [unStakeAmount, setUnStakeAmount] = useState<number>()
  const { show, loading } = useAppSelector((state) => state.unstake)
  const validationSchema = Yup.object().shape({
    unStakeAmount: Yup.string()
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
    if (unStakeAmount != null && unStakeAmount != 0) {
      setValue("unStakeAmount", unStakeAmount)
    }
  }, [unStakeAmount, setValue])

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleUnStakeModal())}
      className="rounded "
      hasCloseIcon
      closeOnOutsideClick
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("yield-farming.unstake-header")}
          </div>
          <div className="text-content-secondary text-caption ">
            {t("yield-farming.unstake-subtitle")}
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
                helper={errors.unStakeAmount?.message?.toString() ?? ""}
                error={!!errors.unStakeAmount?.message}
              >
                <div>
                  <input
                    className={`w-full h-10 ${
                      !!errors.unStakeAmount?.message && "error"
                    }`}
                    placeholder={t("yield-farming.enter-amount")}
                    type="number"
                    {...register("unStakeAmount")}
                    autoFocus
                  />
                  <Button
                    size="small"
                    title={`${t("yield-farming.max")}`}
                    className={`absolute right-2.5 top-2 text-content-primary `}
                    onClick={() => {
                      setUnStakeAmount(10)
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
                    ? `${t("yield-farming.unstaking")}`
                    : `${t("yield-farming.unstake")}`
                }
                onClick={() => {
                  dispatch(setLoading(true))
                  setTimeout(() => {
                    dispatch(toggleUnStakeModal())
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
export default UnStakeModal
