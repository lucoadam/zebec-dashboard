import { yupResolver } from "@hookform/resolvers/yup"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { LeftArrowIcon, RefreshIcon } from "assets/icons"
import {
  Breadcrumb,
  Button,
  EmptyDataState,
  IconButton,
  InputField,
  Pagination,
  Table,
  TableBody
} from "components/shared"
import { TransactionSkeleton } from "components/transactions/TransactionSkeleton"
import {
  fetchAddressBook,
  saveAddressBook,
  setPagination,
  updateAddressBook
} from "features/address-book/addressBookSlice"
import { toast } from "features/toasts/toastsSlice"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { addOwnersSchema } from "utils/validations/addOwnersSchema"
import IndividualAddresesTableRow from "./IndividualAddressesTableRow"

export default function IndividualAddresses() {
  const { addressBooks, pagination, loading } = useAppSelector(
    (state) => state.address
  )
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [isEdit, setIsEdit] = useState(false)
  const [editAddressBookId, setEditAddressBookId] = useState<number | "">("")

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
        }
      }
      dispatch(saveAddressBook(addressBookData))
    } else {
      const addressBookData = {
        data: {
          id: editAddressBookId,
          name: data.name,
          address: data.wallet
        },
        callback: (error: unknown) => {
          if (error) {
            dispatch(
              toast.error({
                message: t("addressBook:error-update")
              })
            )
          }
          setIsEdit(false)
          setEditAddressBookId("")
          reset()
          dispatch(
            toast.success({
              message: t("addressBook:success-update")
            })
          )
        }
      }
      dispatch(updateAddressBook(addressBookData))
    }
  }

  const resetForm = () => {
    reset()
  }

  useEffect(() => {
    if (addressBooks) {
      setValue(
        "wallets",
        addressBooks.map((addressBook) => addressBook.address)
      )
    }
  }, [addressBooks, setValue, trigger, getValues])

  useEffect(() => {
    dispatch(
      setPagination({
        ...pagination,
        currentPage: 1,
        limit: 10
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEdit = (data: any) => {
    setIsEdit(true)
    setEditAddressBookId(data.id)
    setValue(
      "wallets",
      addressBooks
        .map((addressBook) => addressBook.address)
        .filter((wallet) => wallet !== data.address)
    )
    setValue(
      "names",
      addressBooks
        .map((addressBook) => addressBook.name)
        .filter((name) => name !== data.name)
    )
    setValue("wallet", data.address)
    setValue("name", data.name)
  }

  return (
    <>
      <div className="w-full">
        <Breadcrumb title={`${t("addressBook:address-book")}`} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Table headers={headers}>
              <TableBody className="">
                {loading ? (
                  <tr>
                    <td colSpan={headers.length}>
                      <TransactionSkeleton />
                    </td>
                  </tr>
                ) : addressBooks.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={headers.length}>
                      <EmptyDataState
                        message={t("addressBook:empty-address-book")}
                        padding={80}
                        className="h-[386px] w-full mt-12 rounded !px-10 text-center !py-0 justify-center"
                      />
                    </td>
                  </tr>
                ) : (
                  addressBooks?.map((addressBook, index) => {
                    return (
                      <IndividualAddresesTableRow
                        key={index}
                        addressBook={addressBook}
                        onEdit={onEdit}
                      />
                    )
                  })
                )}
              </TableBody>
            </Table>
            {addressBooks.length > 0 && (
              <Pagination
                // pages={Math.ceil(total / limit)}
                pagination={pagination}
                setPagination={setPagination}
                onChange={() => {
                  dispatch(fetchAddressBook())
                }}
              />
            )}
          </div>

          <div className="md:order-last order-first">
            <div className="rounded bg-background-secondary p-10 mt-12 max-w-96 h-96  ">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center text-content-secondary text-subtitle font-semibold">
                  {isEdit && (
                    <IconButton
                      variant="plain"
                      size="small"
                      icon={
                        <LeftArrowIcon className="text-content-secondary" />
                      }
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
                <IconButton
                  data-tip="Reset"
                  icon={<RefreshIcon />}
                  className="w-7 h-7"
                  onClick={resetForm}
                />
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

                <div className="flex flex-col gap-4">
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
