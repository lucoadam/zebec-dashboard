import { cloneElement, FC } from "react"
import { twMerge } from "tailwind-merge"
import { InputProps } from "./index.d"

const InputFieldWrapper: FC<InputProps> = (props) => {
  const {
    error = false,
    helper = "",
    label = "",
    children,
    labelMargin = 0,
    disabled = false,
    helperClassName = "",
    labelClassName = "",
    ...rest
  } = props

  return (
    <>
      {label !== "" && (
        <label
          className={twMerge(
            `block ${
              disabled ? "text-content-tertiary" : "text-content-primary"
            } text-xs ${
              labelMargin > 0 && ` ml-[${labelMargin}px]`
            } font-medium mb-1`,
            labelClassName
          )}
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
        <p
          className={twMerge(
            "text-content-secondary text-xs ml-[12px] mt-1",
            helperClassName
          )}
        >
          {helper}
        </p>
      )}
    </>
  )
}

export const InputField = InputFieldWrapper
