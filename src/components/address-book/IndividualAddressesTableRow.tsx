import React, { FC, Fragment, useRef, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import * as Icons from "assets/icons"

interface IndividualAddresesTableRow {
  index: number
  transaction: any
}

const IndividualAddresesTableRow: FC<IndividualAddresesTableRow> = ({
  index,
  transaction
}) => {
  const { t } = useTranslation("addressBook")

  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex max-w-full`}>
          <td className="px-3 py-5 min-w-50">
            <div className="flex items-center  h-14 text-content-primary text-subtitle font-semibold">
              {transaction.name}
            </div>
          </td>
          <td className="px-6 py-5 min-w-31.25">
            <div className="  h-14 flex items-center text-content-primary">
              {transaction.wallet_address}
            </div>
          </td>
          <td className="px-4 py-5 w-full  ">
            <div className="h-14 flex items-center gap-x-8 justify-end ">
              <Button
                title="Send"
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {}}
              />

              <Button
                title="Delete"
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
                    title={t("yes-delete")}
                    onClick={() => {}}
                  />
                </div>
                <div className="">
                  <Button
                    className={`w-full font-semibold`}
                    title={t("cancel")}
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
