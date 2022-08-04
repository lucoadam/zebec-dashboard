import { yupResolver } from "@hookform/resolvers/yup"
import { useAppSelector } from "app/hooks"
import {
  Breadcrumb,
  BreadcrumbRightContent,
  Button,
  InputField,
  Table,
  TableBody
} from "components/shared"
import { useTranslation } from "next-i18next"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import IndividualAddresesTableRow from "./IndividualAddressesTableRow"

export interface Address {
  name: string
  wallet: string[]
}

export default function AddressesGroup() {
  const [addresses, setAddresses] = useState<Address>({
    name: "",
    wallet: []
  })
  const addressBooks = useAppSelector((state) => state.address.addressBooks)
  const [wallets, setWallets] = React.useState<string[]>(addresses.wallet)
  const { t } = useTranslation()
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
    setError
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(addOwnersSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (wallets.some((wallet) => wallet === data.wallet)) {
      setError(
        "wallet",
        { type: "custom", message: "validation:wallet-exists" },
        {
          shouldFocus: true
        }
      )
      return
    }
    setAddresses(data)
    setWallets([...wallets, data.wallet])
  }

  return (
    <>
      <div className="container w-full ">
        <Breadcrumb title={`${t("addressBook:address-group")}`}>
          <BreadcrumbRightContent>
            <Button
              title={`${t("addressBook:create-address-book")}`}
              onClick={() => alert("Create an Address Group")}
            />
          </BreadcrumbRightContent>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-hidden">
            <Table headers={headers}>
              <TableBody className="justify between">
                {addressBooks.map((addressBook) => {
                  return (
                    <IndividualAddresesTableRow
                      key={addressBook.id}
                      addressBook={addressBook}
                      onEdit={() => null}
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
