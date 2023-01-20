import { yupResolver } from "@hookform/resolvers/yup"
import { Button, InputField } from "components/shared"
import { useTranslation } from "next-i18next"
import { FC, useEffect } from "react"
import { useForm } from "react-hook-form"
import { addTreasuryNameSchema } from "utils/validations/addTreasuryNameSchema"
import { StepsComponentProps } from "../CreateTreasury.d"

const AddTreasuryName: FC<StepsComponentProps> = (props) => {
  const { t } = useTranslation("createTreasury")
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addTreasuryNameSchema)
  })

  useEffect(() => {
    if (props.treasury.name !== "") {
      setValue("name", props.treasury.name)
    }
  }, [props.treasury.name, setValue])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    props.setCurrentStep(1)
    props.setTreasury((treasury) => ({ ...treasury, name: data.name }))
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h3 className="leading-7 font-semibold text-base text-content-primary">
          {t("createTreasury:first-steper.title")}
        </h3>
        <p className="text-content-secondary font-normal text-sm mb-[32px]">
          {t("createTreasury:first-steper.description")}
        </p>
        <InputField
          error={!!errors.name}
          helper={t(errors.name?.message?.toString() || "").toString()}
          label={t("treasury:treasury-name")}
          placeholder={t("treasury:name-placeholder")}
          type="text"
          className="h-[40px] w-full"
        >
          <input {...register("name")} autoFocus />
        </InputField>
        <Button
          title={`${t("common:buttons.continue")}`}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />
      </form>
    </>
  )
}

export default AddTreasuryName
