import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { LeftArrowIcon } from "assets/icons"
import {
  Breadcrumb,
  Button,
  IconButton,
  InputField,
  Table,
  TableBody
} from "components/shared"
import {
  saveAddressBook,
  updateAddressBook
} from "features/address-book/addressBookSlice"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import IndividualAddresesTableRow from "./IndividualAddressesTableRow"

export default function IndividualAddresses() {
  const { publicKey } = useWallet()
  const addressBooks = useAppSelector((state) => state.address.addressBooks)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [isEdit, setIsEdit] = useState(false)
  const [editAddressBookId, setEditAddressBookId] = useState("")

  const headers = [
    {
      label: "addressBook:name",
      width: "50"
    },
    {
      label: "addressBook:wallet-address",
      width: "50"
    },
    {
      label: "",
      width: "50"
    }
  ]

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    reset
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addOwnersSchema)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (!isEdit) {
      const addressBookData = {
        data: {
          user: publicKey?.toString(),
          ...data
        },
        callback: reset
      }
      dispatch(saveAddressBook(addressBookData))
    } else {
      const addressBookData = {
        data: {
          id: editAddressBookId,
          user: publicKey?.toString(),
          ...data
        },
        callback: () => {
          setIsEdit(false)
          setEditAddressBookId("")
          reset()
        }
      }
      dispatch(updateAddressBook(addressBookData))
    }
  }

  useEffect(() => {
    if (addressBooks) {
      setValue(
        "wallets",
        addressBooks.map((addressBook) => addressBook.wallet)
      )
      setValue(
        "names",
        addressBooks.map((addressBook) => addressBook.name)
      )
    }
  }, [addressBooks, setValue, trigger, getValues])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEdit = (data: any) => {
    setIsEdit(true)
    setEditAddressBookId(data.id)
    setValue(
      "wallets",
      addressBooks
        .map((addressBook) => addressBook.wallet)
        .filter((wallet) => wallet !== data.wallet)
    )
    setValue(
      "names",
      addressBooks
        .map((addressBook) => addressBook.name)
        .filter((name) => name !== data.name)
    )
    setValue("wallet", data.wallet)
    setValue("name", data.name)
  }

  return (
    <>
      <div className="container w-full ">
        <Breadcrumb title={`${t("addressBook:address-book")}`} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-hidden">
            <Table headers={headers}>
              <TableBody className="justify between">
                {addressBooks?.map((addressBook) => {
                  return (
                    <IndividualAddresesTableRow
                      key={addressBook.id}
                      addressBook={addressBook}
                      onEdit={onEdit}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="md:order-last order-first">
            <div className="rounded bg-background-secondary p-10 mt-12 max-w-96 h-96  ">
              <div className="flex gap-2 items-center text-content-secondary text-subtitle font-semibold">
                {isEdit && (
                  <IconButton
                    variant="plain"
                    size="small"
                    icon={<LeftArrowIcon className="text-content-secondary" />}
                    onClick={() => {
                      setIsEdit(false)
                      reset()
                    }}
                  />
                )}
                {isEdit
                  ? t("addressBook:update-an-address")
                  : t("addressBook:add-an-address")}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="pt-8">
                  <InputField
                    label={t("addressBook:address-name")}
                    className="relative text-content-secondary"
                    labelClassName="text-content-secondary ml-3"
                    error={!!errors.name}
                    helper={t(
                      errors.name?.message?.toString() || ""
                    ).toString()}
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

                <div className="pt-6 pb-8">
                  <InputField
                    label={t("addressBook:wallet-address")}
                    className="relative text-content-secondary"
                    labelClassName="text-content-secondary ml-3"
                    error={!!errors.wallet}
                    helper={t(
                      errors.wallet?.message?.toString() || ""
                    ).toString()}
                  >
                    <div>
                      <input
                        className={`w-full h-10 ${
                          !!errors.wallet?.message && "error"
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
                    title={`${
                      isEdit
                        ? t("addressBook:update-address")
                        : t("addressBook:add-address")
                    }`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
