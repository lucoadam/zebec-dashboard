import * as Icons from "assets/icons"
import { Button, IconButton } from "components/shared"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"

export interface NFTDetail {
  name: string
  image: string
  address: string
}

interface NFTEachProps {
  detail: NFTDetail
  isSelected?: boolean
  onChange?: (deatil: NFTDetail | undefined) => void
  className?: string
}

export const NFTEach: FC<NFTEachProps> = ({
  detail,
  isSelected = false,
  onChange,
  className
}) => {
  const [showOverlay, setShowOverlay] = useState(false)
  return (
    <div
      key={detail.address}
      className={twMerge(
        "w-[140.33px] h-[140.33px] rounded relative",
        className ?? ""
      )}
      onMouseOver={() => {
        setShowOverlay(true)
      }}
      onMouseLeave={() => {
        setShowOverlay(false)
      }}
    >
      <img
        src={detail.image}
        className={twMerge(
          "min-w-[140.33px] h-[140.33px] rounded",
          isSelected ? "primary-gradient-border" : ""
        )}
      />
      {showOverlay && (
        <>
          <div className="min-w-[140.33px] h-[140.33px] cursor-pointer absolute left-0 top-0 rounded nft-overlay" />
          <div className="absolute bottom-6 left-6 gap-x-1.5 flex items-center">
            <Button
              size="small"
              title={`Confirm`}
              onClick={() => onChange && onChange(detail)}
              startIcon={
                <Icons.CheckCircleIcon className="text-content-contrast" />
              }
            />
            <IconButton
              className="rounded w-6 h-6"
              onClick={() => onChange && onChange(undefined)}
              icon={<Icons.CrossIcon className="text-content-contrast" />}
            />
          </div>
        </>
      )}
    </div>
  )
}
