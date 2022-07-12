import React, { FC, Fragment, useRef, useState } from "react"
import { useTranslation } from "next-i18next"
import { Button } from "components/shared"
import * as Icons from "assets/icons"

interface IndividualAddresesTableRow {
  index: number
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const IndividualAddresesTableRow: FC<IndividualAddresesTableRow> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")

  const [isOpen, setIsOpen] = useState(false)

  function toggleModal() {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex `}>
          <td className="px-5 py-5 ">
            <div className="flex items-center w-36 h-14 text-subtitle font-semibold">
              {transaction.name}
            </div>
          </td>
          <td className="px-5 py-5 ">
            <div className=" w-36 h-14 flex items-center text-content-contrast">
              {transaction.wallet_address}
            </div>
          </td>
          <td className="px-5 py-5">
            <div className="w-48 h-14 flex items-center gap-x-8">
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
                onClick={() => {}}
              />
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default IndividualAddresesTableRow
