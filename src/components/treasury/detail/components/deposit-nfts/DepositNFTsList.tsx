import { FC, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { DepositNFTEach, NFTDetail } from "./DepositNFTEach"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { fetchAssociatedNfts } from "features/treasuryNft/treasuryNftSlice"
import { EmptyDataState } from "components/shared"
import { useTranslation } from "next-i18next"

export const DepositNFTsList: FC<{
  className?: string
  onChange?: (detail: NFTDetail | undefined) => void
}> = ({ className, onChange }) => {
  const { t } = useTranslation()
  const walletObject = useWallet()
  const dispatch = useAppDispatch()
  const { walletNfts, loading } = useAppSelector((state) => state.treasuryNft)

  const [nftChoosed, setNFTChoosed] = useState<NFTDetail>()

  useEffect(() => {
    if (walletObject.publicKey) {
      dispatch(
        fetchAssociatedNfts({
          address: walletObject.publicKey.toString(),
          type: "wallet"
        })
      )
    }
  }, [walletObject.publicKey])

  return (
    <div
      className={twMerge(
        "lg:ml-8 mt-8 lg:mt-0 flex flex-col text-content-primary flex-1",
        className ?? ""
      )}
    >
      <div className="flex flex-wrap justify-start gap-4">
        {loading ? (
          <></>
        ) : walletNfts.length > 0 ? (
          walletNfts.map((item) => (
            <DepositNFTEach
              key={item.address}
              detail={item}
              onChoose={(detail) => {
                setNFTChoosed(detail)
                onChange && onChange(detail)
              }}
              isChoosed={nftChoosed?.address === item.address}
            />
          ))
        ) : (
          <div className="w-full">
            <EmptyDataState
              message={t("treasury:no-nft-in-wallet")}
              padding={120}
              className="bg-background-light h-[386px] w-full rounded !px-10 text-center !py-0 justify-center"
            />
          </div>
        )}
      </div>
    </div>
  )
}
