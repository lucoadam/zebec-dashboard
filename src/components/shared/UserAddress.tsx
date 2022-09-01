import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { saveAddressBook } from "features/address-book/addressBookSlice"
import { toast } from "features/toasts/toastsSlice"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toSubstring } from "utils"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import { Button } from "./Button"
import CopyButton from "./CopyButton"
import { IconButton } from "./IconButton"
import { InputField } from "./InputField"
import { Modal } from "./Modal"

export const UserAddress: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallet: string
}> = ({ wallet }) => {
  const { addressBooks } = useAppSelector((state) => state.address)
  const isInAddressBook = addressBooks.some((item) => item.address === wallet)

  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const [toggleAddressDropdown, setToggleAddressDropdown] =
    useState<boolean>(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addOwnersSchema)
  })

  useEffect(() => {
    setValue("wallet", wallet)
  }, [setValue, wallet])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const addressBookData = {
      data: {
        name: data.name,
        address: data.wallet
      },
      callback: (error: unknown) => {
        if (error) {
          dispatch(
            toast.error({
              message: t("addressBook:error-add")
            })
          )
          return
        }
        reset()
        dispatch(toast.success({ message: t("addressBook:success-add") }))
        handleClose()
      }
    }
    dispatch(saveAddressBook(addressBookData))
  }

  const handleClose = () => {
    setToggleAddressDropdown(false)
  }

  return (
    <div className="flex gap-x-1 items-center text-body text-content-primary">
      <span data-tip={wallet}>
        {isInAddressBook
          ? toSubstring(
              addressBooks.find((item) => item.address === wallet)?.name,
              12,
              false
            )
          : toSubstring(wallet, 5, true)}{" "}
      </span>
      {!isInAddressBook && (
        <IconButton
          icon={<Icons.UserAddIcon />}
          className="bg-background-primary min-w-7 h-7"
          onClick={() => setToggleAddressDropdown(!toggleAddressDropdown)}
        />
      )}

      <div className="relative">
        <Modal
          toggleModal={() => setToggleAddressDropdown(!toggleAddressDropdown)}
          show={toggleAddressDropdown}
          className="w-[306px]"
          hasCloseIcon={true}
          closeOnOutsideClick={true}
        >
          <div className="max-w-96">
            <div className="text-content-secondary text-subtitle font-semibold">
              {t("addressBook:add-an-address-name")}
            </div>
            <div className="text-caption text-content-secondary pt-2 ">
              {t("addressBook:add-address-name-to-your-addressBook")}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="pt-4 pb-4">
                <InputField
                  label={t("addressBook:name")}
                  className="relative text-content-secondary"
                  error={!!errors.name}
                  helper={t(errors.name?.message?.toString() || "").toString()}
                >
                  <div>
                    <input
                      className={`w-full h-10 ${
                        !!errors.name?.message && "error"
                      }`}
                      placeholder={t("addressBook:enter-name")}
                      type="text"
                      {...register("name")}
                    />
                  </div>
                </InputField>
              </div>

              {/* submit Button */}

              <div className="">
                <Button
                  className={`w-full`}
                  variant="gradient"
                  type="submit"
                  title={`${t("addressBook:add-address-name")}`}
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
      <CopyButton className="min-w-7" content={wallet} />
    </div>
  )
}
