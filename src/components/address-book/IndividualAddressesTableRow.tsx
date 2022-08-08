import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import { Button, Modal } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import {
  AddressBook,
  deleteAddressBook
} from "features/address-book/addressBookSlice"
import { useTranslation } from "next-i18next"
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
            <div
              className="flex items-center gap-x-2 text-content-primary"
              data-tip={addressBook.address}
            >
              {toSubstring(addressBook.address, 8, true)}

              <div className="flex-shrink-0">
                <CopyButton
                  content={addressBook.address}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </td>
          <td className="px-6 pt-4.5 pb-6 w-full my-auto">
            <div className="flex items-center gap-x-5 justify-end ">
              <Button
                title={`${t("send")}`}
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {
                  //on send click
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
                          id: addressBook.id
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
