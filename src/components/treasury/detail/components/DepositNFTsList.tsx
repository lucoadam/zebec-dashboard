import { nftLists } from "fakedata"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"
import { DepositNFTEach, NFTDetail } from "./DepositNFTEach"

export const DepositNFTsList: FC<{
  className?: string
  onChange?: (detail: NFTDetail | undefined) => void
}> = ({ className, onChange }) => {
  const [nftChoosed, setNFTChoosed] = useState<NFTDetail>()
  return (
    <div
      className={twMerge(
        "lg:ml-8 mt-8 lg:mt-0 flex flex-col justify-center text-content-primary flex-1",
        className ?? ""
      )}
    >
      <div className="flex flex-wrap justify-start gap-4">
        {nftLists.map((item) => (
          <DepositNFTEach
            key={item.address}
            detail={item}
            onChoose={(detail) => {
              setNFTChoosed(detail)
              onChange && onChange(detail)
            }}
            isChoosed={nftChoosed?.address === item.address}
          />
        ))}
      </div>
    </div>
  )
}
