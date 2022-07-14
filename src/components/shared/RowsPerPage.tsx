import React, { FC, useState, useRef } from "react"
import { CollapseDropdown } from "./CollapseDropdown"
import { useClickOutside } from "hooks"
import * as Icons from "assets/icons"

interface RowsPerPageProps {
  noOfRows: number
  setNoOfRows: (noOfRows: number) => void
  noOfOptions: number[]
}

export const RowsPerPage: FC<RowsPerPageProps> = (props) => {
  const { noOfRows, setNoOfRows, noOfOptions } = props
  const [toggleNoOfRows, settoggleNoofRows] = useState(false)
  const RowsDropdownWrapper = useRef(null)

  const handleClose = () => {
    settoggleNoofRows(false)
  }

  useClickOutside(RowsDropdownWrapper, {
    onClickOutside: handleClose
  })

  return (
    <>
      <div className="flex gap-x-2 items-center justify-center">
        <div className="text-content-secondary pl-5 ">
          <span className="">Rows per page:</span>
        </div>

        <div className="relative " ref={RowsDropdownWrapper}>
          <div
            onClick={() => settoggleNoofRows((prev) => !prev)}
            className=" flex text-content-primary max-w-[60px] ml-[5px] overflow-x-hidden cursor-pointer"
          >
            {noOfRows}

            <Icons.CheveronDownIcon className="text-sm w-[28px]" />
          </div>

          <CollapseDropdown
            show={toggleNoOfRows}
            className="absolute text-caption text-content-primary top-5"
            variant="default"
          >
            {noOfOptions.map((item: number, index: number) => {
              return (
                <div
                  onClick={(e) => {
                    e?.stopPropagation()
                    settoggleNoofRows(false)
                    setNoOfRows(item)
                  }}
                  key={`rows-${index}`}
                  className="text-content-secondary py-2 pl-4 pr-4  flex cursor-pointer overflow-hidden justify-center items-center hover:text-primary  h-auto"
                >
                  {item}
                </div>
              )
            })}
          </CollapseDropdown>
        </div>
      </div>
    </>
  )
}
