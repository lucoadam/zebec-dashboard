import { useTranslation } from "next-i18next"
import React, { useState } from "react"
import { Button, InputField, Table, TableBody } from "components/shared"
import { individualAddressBook } from "fakedata"
import IndividualAddresesTableRow from "./IndividualAddressesTableRow"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { isValidWallet } from "utils/isValidtWallet"
import { yupResolver } from "@hookform/resolvers/yup"

interface Address {
  name: string
  wallet: string[]
}

export default function IndividualAddresses() {
  const [addresses, setAddresses] = useState<Address>({
    name: "",
    wallet: []
  })
  const [wallets, setWallets] = React.useState<string[]>(addresses.wallet)
  const { t } = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("validation:name-required")),
    wallet: Yup.string()
      .required(t("validation:wallet-required"))
      .test("is-valid-address", t("validation:wallet-invalid"), (value) =>
        isValidWallet(value)
      )
      .test("is-wallet-exists", t("validation:wallet-exists"), (value) =>
        wallets.every((wallet) => wallet !== value)
      )
  })
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
    handleSubmit
  } = useForm({
    mode: "onChange" || "onSubmit",
    resolver: yupResolver(validationSchema)
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setAddresses(data)
    setWallets([...wallets, data.wallet])
  }

  return (
    <>
      <div className="container w-full ">
        <div className="flex justify-between items-center pb-9">
          <h4 className="text-heading-4 font-semibold text-content-primary pl-4">
            {`${t("addressBook:address-book")} `}
          </h4>

          {/* <Button
            title={`${t("addressBook:create-address-book")}`}
            onClick={() => alert("Create an Address Group")}
          /> */}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="rounded bg-background-secondary p-10 mt-12 max-w-96 h-96">
            <div className="text-content-secondary text-subtitle font-semibold">
              {t("addressBook:add-an-address")}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="pt-6 ">
                <InputField
                  label={t("addressBook:address-name")}
                  className="relative text-content-secondary"
                  error={!!errors.name}
                  helper={errors.name?.message?.toString() || ""}
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
                  helper={errors.wallet?.message?.toString() || ""}
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
                  title={t("addressBook:add-address")}
                />
              </div>
            </form>
          </div>

          <div className="col-span-2">
            <Table headers={headers}>
              <TableBody className="justify between">
                {individualAddressBook.data.map((transaction, index) => {
                  return (
                    <IndividualAddresesTableRow
                      key={index}
                      index={index}
                      transaction={transaction}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
