import { FC } from "react"

interface ToggleProps {
  text: string
  onChange: () => void
  checked?: boolean
}

export const Toggle: FC<ToggleProps> = (props) => {
  const { text, checked } = props
  return (
    <>
      <div>
        <label
          htmlFor="toggle"
          className="w-max flex items-center cursor-pointer relative"
        >
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            onChange={props.onChange}
            {...{ checked }}
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
