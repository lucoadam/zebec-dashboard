import { FC } from "react"

interface ToggleProps {
  text: string
  onChange: () => void
  checked?: boolean
  disabled?: boolean
}

export const Toggle: FC<ToggleProps> = (props) => {
  const { text, checked, disabled, onChange } = props

  return (
    <>
      <div>
        <label
          htmlFor={`toggle-${text}`}
          className="w-max flex items-center cursor-pointer disabled:cursor-not-allowed relative"
        >
          <input
            type="checkbox"
            id={`toggle-${text}`}
            className="sr-only"
            onChange={onChange}
            checked={checked || false}
            disabled={disabled}
          />
          <div
            className={`toggle-bg border border-outline h-5 w-10 rounded-full transition duration-200 ${
              checked ? "bg-primary" : "bg-background-primary"
            }`}
          ></div>
          <span className="ml-[10px] text-sm font-medium text-content-primary">
            {text}
          </span>
        </label>
      </div>
    </>
  )
}
