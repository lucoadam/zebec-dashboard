import { cloneElement, FC } from "react"
import { InputProps } from "./index.d"

const InputFieldWrapper: FC<InputProps> = (props) => {
  const {
    error = false,
    helper = "",
    label = "",
    children,
    labelMargin = 0,
    disabled = false,
    ...rest
  } = props

  return (
    <>
      {label !== "" && (
        <label
          className={`block ${
            disabled ? "text-content-tertiary" : "text-content-primary"
          } text-xs ${
            labelMargin > 0 && ` ml-[${labelMargin}px]`
          } font-medium mb-1`}
        >
          {label}
        </label>
      )}
      {cloneElement(children, {
        ...rest,
        className: `appearance-none w-full ${
          !!rest.className ? rest.className : ""
        } ${error ? "error" : ""}`
      })}
      {helper !== "" && (
        <p className="text-content-secondary text-xs ml-[12px] mt-1">
          {helper}
        </p>
      )}
    </>
  )
}

export const InputField = InputFieldWrapper
