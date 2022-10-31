import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import { Button, InputField, Modal } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import OwnerLists from "components/treasury/create/OwnerLists"
import {
  updateTreasury,
  archiveTreasury
} from "features/treasury/treasurySlice"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toSubstring } from "utils"
import { addTreasuryNameSchema } from "utils/validations/addTreasuryNameSchema"

const Setting = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTreasury, updating, updatingError, archiving } = useAppSelector(
    (state) => state.treasury
  )
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen((prev) => !prev)
  }

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit
  } = useForm<{
    name: string
  }>({
    mode: "onChange",
    resolver: yupResolver(addTreasuryNameSchema),
    defaultValues: {
      name: `${activeTreasury?.name}`
    }
  })
  useEffect(() => {
    setValue("name", activeTreasury?.name || "")
  }, [setValue, activeTreasury])

  const submitForm = (data: { name: string }) => {
    if (activeTreasury?.name !== data.name) {
      const backendData = {
        uuid: activeTreasury?.uuid || "",
        name: data.name
      }
      dispatch(updateTreasury(backendData))
    }
  }
  return (
    <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap w-full md:justify-start sm:justify-center">
      <div className="mt-[30px] md:w-96">
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
                {activeTreasury?.name}
              </div>
              <div className="flex gap-x-3 items-center">
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.UserGroupIcon className="text-sm font-normal" />
                  <div className="w-20">
                    {activeTreasury?.owners.length}{" "}
                    {t("treasurySettings:owners")}
                  </div>
                </div>
                <div className="flex gap-x-1.5 items-center text-sm font-normal text-content-primary">
                  <Icons.NotebookIcon className="text-sm font-normal" />
                  <div>
                    {toSubstring(activeTreasury?.treasury_address, 6, true)}
                  </div>
                  {activeTreasury?.treasury_address && (
                    <CopyButton content={activeTreasury.treasury_address} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block lg:flex mt-[18px] text-content-primary text-sm mb-[50px]">
          <span className="text-sm font-normal text-content-secondary block">
            {t("treasurySettings:minimum-confirmation")}:
          </span>
          &nbsp;{activeTreasury?.min_confirmations}{" "}
          {t("treasurySettings:out-of")} {activeTreasury?.owners.length}{" "}
          {t("treasurySettings:owners")}
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <InputField
            error={!!errors?.name || !!updatingError}
            helper={t(errors?.name?.message?.toString() || updatingError || "")}
            label={t("treasurySettings:safe-name")}
            placeholder={t("treasurySettings:enter-safe-name")}
            className="h-[40px] w-full"
            type="text"
            autoFocus={false}
          >
            <input {...register("name")} autoFocus />
          </InputField>
          <Button
            disabled={updating}
            loading={updating}
            title={`${t("treasurySettings:save-changes")}`}
            variant="gradient"
            size="medium"
            className="w-full justify-center mt-[32px]"
            type="submit"
          />
        </form>

        <div className="mt-[30px] order-last lg:order-2 md:w-96">
          <div className="text-subtitle text-content-primary font-semibold">
            {t("treasurySettings:archive-safe")}
          </div>
          <div className="text-xs font-normal text-content-secondary mb-[16px]">
            {t("treasurySettings:archive-safe-description")}
          </div>
          <Button
            className="w-full"
            variant="danger"
            title={`${t("treasurySettings:archive-safe")}`}
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
                  loading={archiving}
                  disabled={archiving}
                  title={`${t("treasurySettings:yes-archive-safe")}`}
                  startIcon={<Icons.TrashIcon />}
                  onClick={() =>
                    dispatch(
                      archiveTreasury({
                        uuid: activeTreasury?.uuid || "",
                        callback: () => {
                          setIsOpen(!isOpen)
                          setTimeout(() => {
                            router.push("/treasury")
                          }, 500)
                        }
                      })
                    )
                  }
                />
              </div>
              <div className="pb-[12px]">
                <Button
                  className="w-full"
                  title={`${t("treasurySettings:cancel")}`}
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="w-full md:min-w-[360px] lg:ml-[300px] mt-5 md:mt-0 sm:ml-0 md:ml-32">
        <div className="text-subtitle pb-[26px] text-content-primary font-semibold">
          {t("treasurySettings:owners")}
        </div>
        <OwnerLists
          maxItems={5}
          owners={
            activeTreasury?.owners.map((owner) => {
              return { name: owner.name, wallet: owner.wallet_address }
            }) || []
          }
          showCopy
        />
      </div>
    </div>
  )
}

export default Setting
