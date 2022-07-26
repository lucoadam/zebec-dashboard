import * as Icons from "assets/icons"
import React from "react"
import { CopyButtonProps } from "./index.d"

const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  className = "",
  disabled = false
}) => {
  const [isClicked, setIsClicked] = React.useState<boolean>(false)

  return (
    <div className="grid place-content-center border border-outline bg-background-primary rounded-full  w-7 h-7 text-sm">
      {isClicked ? (
        <Icons.CheckIcon
          onClick={(e: Event) => {
            e.stopPropagation()
          }}
          className={`text-base cursor-pointer text-success transition ease-in-out delay-150 ${className}`}
        />
      ) : (
        <Icons.CopyIcon
          onClick={(e: Event) => {
            if (disabled) return
            e.stopPropagation()
            setIsClicked(true)
            setTimeout(() => {
              setIsClicked(false)
            }, 800)
            navigator.clipboard.writeText(content)
          }}
          className={`text-base cursor-pointer ${className}`}
        />
      )}
    </div>
  )
}

export default CopyButton
