import moment from "moment"
import { cloneElement, FC } from "react"
import Datetime from "react-datetime"

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
  const renderInput = (
    props: any,
    openCalendar: Function,
    closeCalendar: Function
  ) => {
    return (
      <>
        {cloneElement(mainProps.children, {
          ...props
        })}
      </>
    )
  }
  return (
    <div className="relative">
      <div className="absolute text-content-primary z-50 top-3 left-5">
        {mainProps.startIcon}
      </div>
      <Datetime
        className="text-content-primary"
        timeFormat={mainProps.timeFormat}
        value={mainProps.value}
        inputProps={{
          value: mainProps.value?.toString() || "",
          disabled: mainProps.disabled,
          placeholder: mainProps.placeholder,
          className: `w-full h-[40px] bg-background-primary date-picker-input ${
            mainProps.error && "error"
          }`
        }}
        dateFormat={mainProps.dateFormat}
        closeOnSelect={true}
        closeOnClickOutside={true}
        onChange={mainProps.onChange}
        renderInput={renderInput}
      />
      <div className="text-lg absolute text-content-primary z-2 top-3 right-1">
        {mainProps.endIcon}
      </div>
    </div>
  )
}
