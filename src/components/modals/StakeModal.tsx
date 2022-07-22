import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button, InputField, Modal } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

import * as Icons from "assets/icons"
import { setLoading, toggleStakeModal } from "features/modals/stakeSlice"

const StakeModal: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")
  const [stakeAmount, setStakeAmount] = useState<number>()
  const { show, loading } = useAppSelector((state) => state.stake)
  const validationSchema = Yup.object().shape({
    stakeAmount: Yup.string()
      .required(t("yield-farming.enter-yield-farming-amount"))
      .test(
        "is-not-zero",
        t("yield-farming.not-zero"),
        (value) => typeof value === "string" && parseFloat(value) > 0
      )
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
  const onSubmit = () => {
    // on data submit
  }
  useEffect(() => {
    if (stakeAmount != null && stakeAmount != 0) {
      setValue("stakeAmount", stakeAmount)
    }
  }, [stakeAmount, setValue])

  return (
    <Modal
      closeOnOutsideClick
      show={show}
      toggleModal={() => dispatch(toggleStakeModal())}
      className="rounded "
      hasCloseIcon
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("yield-farming.stake-lp-token")}
          </div>
          <div className="text-content-secondary text-caption ">
            {t("yield-farming.stake-lp-token-subtitle")}
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
                helper={errors.stakeAmount?.message?.toString() ?? ""}
                error={!!errors.stakeAmount?.message}
              >
                <div>
                  <input
                    className={`w-full h-10 ${
                      !!errors.stakeAmount?.message && "error"
                    }`}
                    placeholder={t("yield-farming.enter-amount")}
                    type="number"
                    {...register("stakeAmount")}
                    autoFocus
                  />
                  <Button
                    size="small"
                    title={`${t("yield-farming.max")}`}
                    className={`absolute right-2.5 top-2 text-content-primary `}
                    onClick={() => {
                      setStakeAmount(10)
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
                    ? `${t("yield-farming.staking")}`
                    : `${t("yield-farming.stake")}`
                }
                onClick={() => {
                  dispatch(setLoading(true))
                  setTimeout(() => {
                    dispatch(toggleStakeModal())
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
export default StakeModal
