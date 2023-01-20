import Image from "next/image"
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
  className?: string
}

export const DepositNFTEach: FC<NFTEachProps> = ({
  detail,
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
      <div
        className={twMerge(
          "min-w-[142.33px] p-[1px] h-[142.33px] rounded",
          isChoosed ? "primary-gradient-border" : ""
        )}
      >
        <Image
          src={`https://res.cloudinary.com/demo/image/fetch/${detail.image}`}
          className="min-w-[140.33px] h-[140.33px] rounded"
          width={140.33}
          height={140.33}
          alt={detail.name}
        />
        <div className="">{detail.name}</div>
      </div>
    </div>
  )
}
