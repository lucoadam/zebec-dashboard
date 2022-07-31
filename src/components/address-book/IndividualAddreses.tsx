import { yupResolver } from "@hookform/resolvers/yup"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  Breadcrumb,
  Button,
  InputField,
  Table,
  TableBody
} from "components/shared"
import {
  fetchAddressBook,
  saveAddressBook
} from "features/address-book/addressBookSlice"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import IndividualAddresesTableRow from "./IndividualAddressesTableRow"

export default function IndividualAddresses() {
  const { publicKey } = useWallet()
  const addressBooks = useAppSelector((state) => state.address.addressBooks)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (publicKey) {
      dispatch(fetchAddressBook(publicKey?.toString()))
    }
  }, [dispatch, publicKey])

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
    getValues
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addOwnersSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    dispatch(saveAddressBook({ user: publicKey?.toString(), ...data }))
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
                    />
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="md:order-last order-first">
            <div className="rounded bg-background-secondary p-10 mt-12 max-w-96 h-96  ">
              <div className="text-content-secondary text-subtitle font-semibold">
                {t("addressBook:add-an-address")}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="pt-6 ">
                  <InputField
                    label={t("addressBook:address-name")}
                    className="relative text-content-secondary"
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

                <div className="pt-6 pb-6 ">
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
                    title={`${t("addressBook:add-address")}`}
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
