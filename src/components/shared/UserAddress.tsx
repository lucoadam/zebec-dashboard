import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import { saveAddressBook } from "features/address-book/addressBookSlice"
import { useClickOutside } from "hooks"
import { useTranslation } from "next-i18next"
import React, { FC, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toSubstring } from "utils"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import { Button } from "./Button"
import { CollapseDropdown } from "./CollapseDropdown"
import CopyButton from "./CopyButton"
import { IconButton } from "./IconButton"
import { InputField } from "./InputField"

const walletAddressMap = [
  {
    wallet: "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX",
    name: "Maxim Roye"
  },
  {
    wallet: "22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv",
    name: "Lucid Dreamer"
  }
]

export const UserAddress: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallet: string,
  dropDown: boolean
}> = ({ wallet,dropDown }) => {
  const isInAddressBook = walletAddressMap.some(
    (item) => item.wallet === wallet
  )
  const AddressDropdownWrapperRef = useRef(null)

  const { t } = useTranslation()
 
 

  const dispatch = useAppDispatch()


  const [toggleAddressDropdown, setToggleAddressDropdown] =
    useState<boolean>(false)
    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(addOwnersSchema)
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = (data: any) => {
      dispatch(saveAddressBook(data));
      
      
    }

  const handleClose = () => {
    setToggleAddressDropdown(false)
  }

  //handle clicking outside
  useClickOutside(AddressDropdownWrapperRef, {
    onClickOutside: handleClose
  })
  return (
    <div className="flex gap-x-1 items-center text-body text-content-primary" ref={AddressDropdownWrapperRef}>
      <span data-tip={wallet}>
        {isInAddressBook
          ? toSubstring(
              walletAddressMap.find((item) => item.wallet === wallet)?.name,
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
      <div className="relative ">

{dropDown && (<CollapseDropdown
          show={toggleAddressDropdown}
          className="w-[306px]"
          autoPosition={false}
        >
          <div className="p-5 max-w-96">
          <div className="text-content-secondary text-subtitle font-semibold">
                {t("addressBook:add-an-address")}
              </div>
              <div className="text-caption text-content-secondary pt-2 ">
              {t("addressBook:add-address-to-your-addressBook")}
              </div>

           <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="pt-4 pb-4">
                  <InputField
                    label={t("addressBook:wallet-address")}
                    className="relative text-content-secondary"
                    error={!!errors.wallet}
                    helper={t(
                      errors.wallet?.message?.toString() || ""
                    ).toString()}
                  >
                    <div>
                      <input
                        className={`w-full h-10 ${
                          !!errors.name?.message && "error"
                        }`}
                        placeholder={t("addressBook:enter-wallet-address")}
                        type="text"
                        {...register("wallet")}
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
                    title={`${t("addressBook:add-address")}`}
                  />
                </div>
                </form>
                </div>

        </CollapseDropdown>
       
)} 
 </div>
     <CopyButton className="min-w-7" content={wallet} />
    </div>
  )
}
