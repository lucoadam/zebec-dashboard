import React, { FC, useState, useEffect, useMemo, useRef } from "react"
import * as Icons from "assets/icons"
import { useAppDispatch } from "app/hooks"
import { useClickOutside } from "hooks"
import { CollapseDropdown } from "./CollapseDropdown"

export interface PaginationInterface {
  currentPage: number | string
  limit: number
  total: number
}

interface PaginationProps {
  pagination: PaginationInterface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPagination: (pagination: PaginationInterface) => any
  pageOptions?: number[]
  showRowPerPage?: boolean
  onChange?: () => void
}

export const Pagination: FC<PaginationProps> = ({
  pagination,
  onChange,
  pageOptions,
  setPagination,
  showRowPerPage = true
}) => {
  const dispatch = useAppDispatch()

  const numberOfPages = useMemo(() => {
    const numOfPages: (number | string)[] = []
    for (let i = 1; i <= Math.ceil(pagination.total / pagination.limit); i++) {
      numOfPages.push(i)
    }
    return numOfPages
  }, [pagination])

  // Array of buttons what we see on the page
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState<(number | string)[]>(
    []
  )

  useEffect(() => {
    console.log(pagination, numberOfPages)
  }, [pagination, numberOfPages])

  const handlePagination = (currentPage: number | string) => {
    //Temp no of Pages
    let page = currentPage
    let tempNumberOfPages = [...arrOfCurrButtons]

    //Set dots
    const dotsInitial = "..."
    const dotsLeft = "... "
    const dotsRight = " ..."

    if (numberOfPages.length < 5) {
      //num of pages < 6
      tempNumberOfPages = numberOfPages
    } else if (currentPage >= 1 && currentPage < 2) {
      //current button 1 to 3
      tempNumberOfPages = [1, 2, 3, dotsInitial, numberOfPages.length]
    } else if (currentPage === 3 || currentPage === 2) {
      //current button 4
      const sliced = numberOfPages.slice(0, 4)
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length]
    } else if (currentPage === numberOfPages.length - 2) {
      const sliced1 = numberOfPages.slice(
        pagination.total - 3,
        pagination.total
      ) // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numberOfPages.slice(pagination.total, pagination.total) // sliced2 (5, 5+2) -> [6,7]
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numberOfPages.length
      ] // [1, '...', 4, 5, 6, 7,'...', 10]
    } else if (currentPage > 3 && currentPage < numberOfPages.length - 1) {
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numberOfPages.slice(
        Number(currentPage) - 2,
        Number(currentPage)
      ) // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numberOfPages.slice(
        Number(currentPage),
        Number(currentPage) + 1
      ) // sliced2 (5, 5+2) -> [6,7]
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numberOfPages.length
      ] // [1, '...', 4, 5, 6, 7,'...', 10]
    } else if (currentPage > numberOfPages.length - 3) {
      // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 3) // slice last 4 [7, 8, 9, 10]
      tempNumberOfPages = [1, dotsLeft, ...sliced]
    } else if (currentPage === dotsInitial) {
      // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 4 + 1 = 5
      // or
      // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
      // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
      page = Number(arrOfCurrButtons[arrOfCurrButtons.length - 3]) + 1
    } else if (currentPage === dotsRight) {
      // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 6 + 2 = 8
      page = Number(arrOfCurrButtons[3]) + 2
    } else if (currentPage === dotsLeft) {
      // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 6 - 2 = 4
      page = Number(arrOfCurrButtons[3]) - 2
    } else if (numberOfPages.length < currentPage) {
      page = 1
    }
    dispatch(setPagination({ ...pagination, currentPage: page }))
    setArrOfCurrButtons(tempNumberOfPages)
  }

  useEffect(() => {
    handlePagination(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.total, pagination.limit])

  // For Rows per page
  const [toggleNoOfRows, settoggleNoofRows] = useState(false)
  const RowsDropdownWrapper = useRef(null)
  const Options: number[] = pageOptions ? pageOptions : [1, 2, 3, 40, 50]

  const handleClose = () => {
    settoggleNoofRows(false)
  }

  useClickOutside(RowsDropdownWrapper, {
    onClickOutside: handleClose
  })
  return (
    <div className="mt-6 flex justify-between">
      {showRowPerPage && (
        <div className="flex gap-x-2 items-center justify-center text-caption">
          <div className="text-content-secondary pl-5 ">
            <span className="">Rows per page:</span>
          </div>

          <div className="relative " ref={RowsDropdownWrapper}>
            <div
              onClick={() => settoggleNoofRows((prev) => !prev)}
              className=" flex text-content-primary max-w-[60px] ml-[5px] overflow-x-hidden cursor-pointer"
            >
              {pagination.limit}

              <Icons.CheveronDownIcon className="text-sm w-[28px]" />
            </div>

            <CollapseDropdown
              show={toggleNoOfRows}
              className="absolute text-caption text-content-primary top-5"
              variant="default"
            >
              {Options.map((item: number, index: number) => {
                return (
                  <div
                    onClick={(e) => {
                      e?.stopPropagation()
                      settoggleNoofRows(false)
                      if (item !== pagination.limit) {
                        dispatch(
                          setPagination({
                            ...pagination,
                            currentPage: 1,
                            limit: item
                          })
                        )
                        if (onChange) onChange()
                      }
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
      )}
      <div className="flex gap-x-0.5 pr-5 text-content-primary text-caption">
        {/* Previous Button */}
        <button
          className={`w-8  px-3 py-1.5  ${
            pagination.currentPage === 1
              ? "opacity-50 cursor-default"
              : "cursor-pointer"
          }`}
          onClick={() => {
            handlePagination(Number(pagination.currentPage) - 1)
            if (onChange) onChange()
          }}
        >
          <Icons.PaginationLeftArrow />
        </button>

        {/* Array of Current Buttons */}
        {arrOfCurrButtons.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center p-1.5 ${
                item == "..." ? "cursor-default" : "cursor-pointer "
              } ${
                String(pagination.currentPage) === String(item)
                  ? "transition-colors duration-700 ease-in bg-primary rounded-lg"
                  : "bg-background-primary rounded-lg"
              }`}
              onClick={() => {
                handlePagination(item)
                if (onChange) onChange()
              }}
            >
              {item}
            </div>
          )
        })}

        {/* Next Button */}
        <button
          className={` w-8 px-3 py-2 ${
            pagination.currentPage === numberOfPages.length
              ? "opacity-50 cursor-default"
              : numberOfPages.length === 0
              ? "opacity-50 cursor-default"
              : "cursor-pointer"
          }`}
          onClick={() => {
            handlePagination(Number(pagination.currentPage) + 1)
            if (onChange) onChange()
          }}
        >
          <Icons.PaginationRightArrow />
        </button>
      </div>
    </div>
  )
}
