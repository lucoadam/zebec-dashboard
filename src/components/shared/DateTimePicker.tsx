/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useClickOutside } from "hooks"
import moment from "moment"
import { cloneElement, FC, useRef, useState } from "react"
import Datetime from "react-datetime"
import * as Icons from "assets/icons"

interface DateTimePickerProps {
  startIcon?: JSX.Element
  endIcon?: JSX.Element
  placeholder?: string
  dateFormat?: string | boolean
  timeFormat?: string | boolean
  onChange?: (value: string | moment.Moment) => void
  disabled?: boolean
  name?: string
  children: React.ReactElement
  error?: boolean
  value?: string | moment.Moment
}
export const DateTimePicker: FC<DateTimePickerProps> = (mainProps) => {
  const [open, setOpen] = useState(false)
  const dropdownWrapper = useRef(null)
  const renderInput = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any,
    openCalendar: Function,
    closeCalendar: Function
  ) => {
    return (
      <>
        {cloneElement(mainProps.children, {
          ...props,
          onClick: () => {
            setOpen(true)
          }
        })}
      </>
    )
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: () => {
      setOpen(false)
    }
  })
  return (
    <div ref={dropdownWrapper} className="relative">
      <div
        className={`${
          mainProps.disabled ? "text-content-tertiary" : "text-content-primary"
        } absolute z-50 top-2.5 left-4.5`}
      >
        {mainProps.startIcon || <Icons.CalenderIcon className="w-5 h-5" />}
      </div>
      <Datetime
        className="text-content-primary"
        timeFormat={mainProps.timeFormat}
        value={mainProps.value}
        inputProps={{
          value: mainProps.value?.toString() || "",
          disabled: mainProps.disabled,
          placeholder: mainProps.placeholder,
          className: `w-full h-[40px] bg-background-primary !pl-11 ${
            mainProps.error && "error"
          }`
        }}
        dateFormat={mainProps.dateFormat}
        onChange={(data) => {
          setOpen(false)
          mainProps.onChange ? mainProps?.onChange(data) : null
        }}
        renderInput={renderInput}
        open={open}
      />
      <div
        className={`hover:cursor-pointer ${
          mainProps.disabled ? "text-content-tertiary" : "text-content-primary"
        } text-lg absolute z-2 top-2 right-4`}
        onClick={() => {
          setOpen((prev) => !prev)
        }}
      >
        {mainProps.endIcon || <Icons.CheveronDownIcon className="w-6 h-6" />}
      </div>
    </div>
  )
}
