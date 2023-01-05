import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { NFTDetail, NFTEach } from "./NFTEach"

export const NFTsList: FC<{
  className?: string
  nft: NFTDetail | undefined
  onChange?: (detail: NFTDetail | undefined) => void
}> = ({ className, onChange, nft }) => {
  const { treasuryNfts } = useAppSelector((state) => state.treasuryNft)
  const [nftChoosed, setNFTChoosed] = useState<NFTDetail>()
  const { t } = useTranslation()
  return (
    <div
      className={twMerge(
        "lg:ml-8 mt-8 lg:mt-0 flex flex-col justify-center text-content-primary flex-1",
        className ?? ""
      )}
    >
      {(!nft || nft?.address === "") && (
        <div className="flex flex-wrap justify-start gap-4">
          {treasuryNfts.map((item) => (
            <NFTEach
              key={item.address}
              detail={item}
              onChange={(detail) => onChange && onChange(detail)}
              onChoose={(detail) => setNFTChoosed(detail)}
              isChoosed={nftChoosed?.address === item.address}
            />
          ))}
        </div>
      )}
      {nft?.address && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-content-secondary">NFT Info:</div>
          <div>
            <Image
              src={`https://res.cloudinary.com/demo/image/fetch/${nft.image}`}
              className="rounded"
              alt={nft.name}
              width={262}
              height={262}
            />
          </div>
          <div className="flex flex-col gap-1 items-center text-content-secondary">
            <p className="text-subtitle font-semibold">{nft.name}</p>
            <p className="flex items-center">
              {toSubstring(nft.address, 5, true)}
            </p>
          </div>
          <Button
            size="small"
            title={`${t("common:buttons.select-another-nft")}`}
            onClick={() => onChange && onChange(undefined)}
            startIcon={<Icons.EditIcon className="text-content-contrast" />}
          />
        </div>
      )}
    </div>
  )
}
