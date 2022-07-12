import { yupResolver } from "@hookform/resolvers/yup"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import { Button, InputField, Modal } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import OwnerLists from "components/treasury/create/OwnerLists"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toSubstring } from "utils"
import * as Yup from "yup"

const Setting = () => {
  const { t } = useTranslation()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validation:treasury-name-required"))
  })

  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen((prev) => !prev)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "Zebec Name"
    }
  })
  useEffect(() => {
    setValue("name", "Zebec Safe")
  }, [setValue])
  return (
    <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap w-full justify-start">
      <div className="sm:w-full md:w-1/3">
        <div className="w-full flex">
          <Image
            src={AvatarImages.Avatar1}
            layout="fixed"
            width={48}
            height={48}
            objectFit="contain"
            alt="avatar"
          />
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col mx-3">
              <div className="text-subtitle text-content-primary font-semibold">
                Zebec Safe
              </div>
              <div className="flex gap-x-3 items-center">
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.UserGroupIcon className="text-sm font-normal" />
                  <div>
                    {5} {t("treasurySettings:owners")}
                  </div>
                </div>
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.NotebookIcon className="text-sm font-normal" />
                  <div>{toSubstring("23423sdfjsdlfjs234230423", 6, true)}</div>
                  <CopyButton content="23423sdfjsdlfjs234230423" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center  mt-[18px] text-content-primary text-sm mb-[50px]">
          <span className="text-sm font-normal text-content-secondary">
            {t("treasurySettings:minimum-confirmation")}:
          </span>
          &nbsp;2 {t("treasurySettings:out-of")} 3{" "}
          {t("treasurySettings:owners")}
        </div>
        <InputField
          error={!!errors?.name}
          helper={errors?.name?.message?.toString() || ""}
          label={t("treasurySettings:safe-name")}
          placeholder={t("treasurySettings:enter-safe-name")}
          className="h-[40px] w-full"
          type="text"
        >
          <input {...register("name")} autoFocus />
        </InputField>
        <Button
          title={t("treasurySettings:save-changes")}
          variant="gradient"
          size="medium"
          className="w-full justify-center mt-[32px]"
          type="submit"
        />

        <div className="mt-[30px]">
          <div className="text-subtitle text-content-primary font-semibold">
            {t("treasurySettings:archive-safe")}
          </div>
          <div className="text-xs font-normal text-content-secondary mb-[16px]">
            {t("treasurySettings:archive-safe-description")}
          </div>
          <Button
            className="w-full"
            variant="danger"
            title={t("treasurySettings:archive-safe")}
            endIcon={<Icons.TrashIcon />}
            onClick={() => setIsOpen(true)}
          />
          <Modal
            show={isOpen}
            toggleModal={toggleModal}
            className="rounded-2xl "
            hasCloseIcon={false}
          >
            <div className="">
              <div className="text-heading-5 text-content-primary pb-3">
                {t("treasurySettings:archive-modal-header")}
              </div>
              <div className="text-content-secondary pb-3">
                {t("treasurySettings:archiving-content")}
              </div>
              <div className="pt-[12px] pb-[12px]">
                <Button
                  className="w-full"
                  variant="danger"
                  title={t("treasurySettings:yes-archive-safe")}
                  startIcon={<Icons.TrashIcon />}
                  onClick={() => setIsOpen(true)}
                />
              </div>
              <div className="pb-[12px]">
                <Button
                  className="w-full"
                  title={t("treasurySettings:cancel")}
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="min-w-full md:min-w-[280px] lg:ml-[215px] mt-5 md:mt-0 sm:ml-0 md:ml-20">
        <div className="text-subtitle pb-[26px] text-content-primary font-semibold">
          {t("treasurySettings:owners")}
        </div>
        <OwnerLists
          maxItems={5}
          owners={[
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            },
            {
              name: "Subas Shrestha",
              wallet: "2sdfdsfsodfeorweorwerwenreworjweorewrweorjew"
            }
          ]}
          showCopy
        />
      </div>
    </div>
  )
}

export default Setting
