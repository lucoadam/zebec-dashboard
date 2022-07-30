import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

export interface NFTDetail {
  name: string
  image: string
  address: string
}

interface NFTEachProps {
  detail: NFTDetail
  isChoosed?: boolean
  onChoose?: (detail: NFTDetail | undefined) => void
  onChange?: (deatil: NFTDetail | undefined) => void
  className?: string
}

export const NFTEach: FC<NFTEachProps> = ({
  detail,
  onChange,
  className,
  onChoose,
  isChoosed
}) => {
  return (
    <div
      key={detail.address}
      className={twMerge(
        "w-[140.33px] h-[140.33px] rounded relative cursor-pointer",
        className ?? ""
      )}
      onClick={() => {
        onChoose && onChoose(detail)
      }}
    >
      <img
        src={detail.image}
        className={twMerge(
          "min-w-[140.33px] h-[140.33px] rounded",
          isChoosed ? "primary-gradient-border" : ""
        )}
      />
      {isChoosed && (
        <>
          <div className="min-w-[140.33px] h-[140.33px] cursor-pointer absolute left-0 top-0 rounded" />
          <div className="absolute bottom-4 left-6 gap-x-1.5 flex items-center">
            <Button
              size="small"
              title={`Confirm`}
              onClick={() => onChange && onChange(detail)}
              startIcon={
                <Icons.CheckCircleIcon className="text-content-contrast" />
              }
            />
          </div>
        </>
      )}
    </div>
  )
}
