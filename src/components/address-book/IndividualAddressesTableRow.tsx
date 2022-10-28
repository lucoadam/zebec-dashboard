import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, Modal } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import {
  AddressBook,
  deleteAddressBook
} from "features/address-book/addressBookSlice"
import { toast } from "features/toasts/toastsSlice"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { FC, Fragment, useState } from "react"
import { toSubstring } from "utils"

interface IndividualAddresesTableRow {
  addressBook: AddressBook
  onEdit: (addressBook: AddressBook) => void
}

const IndividualAddresesTableRow: FC<IndividualAddresesTableRow> = ({
  addressBook,
  onEdit
}) => {
  const { t } = useTranslation("addressBook")
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex max-w-full`}>
          <td className="px-6 pt-4.5 pb-6 min-w-50 my-auto">
            <div className="text-content-primary text-subtitle font-semibold">
              {addressBook.name}
            </div>
          </td>
          <td className="px-6 pt-4.5 pb-6 min-w-50 my-auto">
            <div className="flex items-center gap-x-2 text-content-primary">
              <div data-tip={addressBook.address}>
                {toSubstring(addressBook.address, 8, true)}
              </div>
              <div className="flex-shrink-0">
                <CopyButton
                  content={addressBook.address}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </td>
          <td className="px-6 pt-4.5 pb-6 ml-auto my-auto">
            <div className="flex items-center gap-x-5 justify-end">
              <Button
                title={`${t("send")}`}
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {
                  router.push(`/send?address=${addressBook.address}`)
                }}
              />
              <Button
                title={`${t("Edit")}`}
                size="small"
                startIcon={<Icons.EditIcon className="text-content-contrast" />}
                onClick={() => {
                  onEdit(addressBook)
                }}
              />
              <Button
                title={`${t("delete")}`}
                size="small"
                startIcon={
                  <Icons.CrossIcon className="text-content-contrast" />
                }
                onClick={() => {
                  setIsOpen(true)
                }}
              />
              {/* <div ref={dropdownWrapper} className="relative">
                <Button
                  title={`${t("action")}`}
                  size="small"
                  startIcon={
                    <Icons.GearringIcon className="text-content-contrast" />
                  }
                  onClick={() => setToggleDropdown(!toggleDropdown)}
                />
                <CollapseDropdown
                  className="w-max border border-outline"
                  position="right"
                  show={toggleDropdown}
                >
                  <div className="p-2">
                    <div
                      onClick={() => null}
                      className="flex gap-2 px-4 py-2 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                    >
                      <Icons.ArrowUpRightIcon className="text-content-contrast" />
                      <span>{t("send")}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div
                      onClick={() => {
                        onEdit(addressBook)
                        setToggleDropdown(false)
                      }}
                      className="flex gap-2 px-4 py-2 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                    >
                      <Icons.EditIcon className="text-content-contrast" />
                      <span>{t("Edit")}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div
                      onClick={() => {
                        setIsOpen(true)
                        setToggleDropdown(false)
                      }}
                      className="flex gap-2 px-4 py-2 text-content-primary items-center hover:bg-background-tertiary rounded-lg cursor-pointer"
                    >
                      <Icons.CrossIcon className="text-content-contrast" />
                      <span>{t("delete")}</span>
                    </div>
                  </div>
                </CollapseDropdown>
              </div> */}
              <Modal
                show={isOpen}
                toggleModal={toggleModal}
                className="rounded "
                hasCloseIcon={false}
                size="small"
              >
                <div className="text-content-primary pb-3 text-subtitle font-semibold">
                  {t("delete-modal-header")}
                </div>
                <div className="text-content-primary text-caption pb-3">
                  {t("delete-modal-subtitle")}
                </div>
                <div className="pt-3 pb-3">
                  <Button
                    className={`w-full font-semibold`}
                    variant="danger"
                    endIcon={<Icons.TrashIcon />}
                    title={`${t("yes-delete")}`}
                    onClick={() =>
                      dispatch(
                        deleteAddressBook({
                          id: addressBook.id,
                          callback: (error: unknown) => {
                            if (error) {
                              dispatch(
                                toast.error({
                                  message: t("addressBook:error-delete")
                                })
                              )
                              setIsOpen(false)
                              return
                            }
                            dispatch(
                              toast.success({
                                message: t("addressBook:success-delete")
                              })
                            )
                          }
                        })
                      )
                    }
                  />
                </div>
                <div className="">
                  <Button
                    className={`w-full font-semibold`}
                    title={`${t("cancel")}`}
                    onClick={() => {
                      setIsOpen(!isOpen)
                    }}
                  />
                </div>
              </Modal>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default IndividualAddresesTableRow
