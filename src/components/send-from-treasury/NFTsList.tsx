import { nftLists } from "fakedata"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { NFTDetail, NFTEach } from "./NFTEach"

export const NFTsList: FC<{
  className?: string
  nft: NFTDetail | undefined
  onChange?: (detail: NFTDetail | undefined) => void
}> = ({ className, onChange, nft }) => {
  return (
    <div
      className={twMerge(
        "ml-8 flex flex-col justify-center text-content-primary flex-1",
        className ?? ""
      )}
    >
      <div className="flex flex-wrap justify-start gap-4">
        {nftLists.map((item) => (
          <NFTEach
            key={item.address}
            detail={item}
            onChange={(detail) => onChange && onChange(detail)}
            isSelected={nft?.address === item.address}
          />
        ))}
      </div>
    </div>
  )
}
