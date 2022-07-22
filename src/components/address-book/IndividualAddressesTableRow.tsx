import React, { FC, Fragment, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import * as Icons from "assets/icons"
import CopyButton from "components/shared/CopyButton"
import { toSubstring } from "utils"

interface IndividualAddresesTableRow {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
}

const IndividualAddresesTableRow: FC<IndividualAddresesTableRow> = ({
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
          <td className="px-6 pt-4.5 pb-6 min-w-50 my-auto">
            <div className="text-content-primary text-subtitle font-semibold">
              {transaction.name}
            </div>
          </td>
          <td className="px-6 pt-4.5 pb-6 min-w-50 my-auto">
            <div
              className="flex items-center gap-x-2 text-content-primary"
              data-tip={transaction.address}
            >
              {toSubstring(transaction.wallet.toString(), 4, true)}

              <div className="flex-shrink-0">
                <CopyButton
                  content={transaction.address}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </td>
          <td className="px-6 pt-4.5 pb-6 w-full my-auto">
            <div className="flex items-center gap-x-8 justify-end ">
              <Button
                title={`${t("send")}`}
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {
                  console.log("onclick")
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
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}}
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
