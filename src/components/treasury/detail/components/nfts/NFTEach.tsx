import { Button } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import Image from "next/image"
import { FC, useContext, useState } from "react"
import { toSubstring } from "utils"
import * as Icons from "assets/icons"
import { useTranslation } from "next-i18next"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { initTransferNftFromTreasury } from "application"

interface NFTDetail {
  name: string
  image: string
  address: string
}

interface NFTEachProps extends React.HTMLAttributes<HTMLDivElement> {
  detail: NFTDetail
  eachWidth?: number
}

export const NFTEach: FC<NFTEachProps> = ({ detail, eachWidth, ...rest }) => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const { treasuryToken } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const [showOverlay, setShowOverlay] = useState(false)

  const withdrawNftToYourWallet = () => {
    if (activeTreasury) {
      const transferData = {
        sender: (publicKey as PublicKey).toString(),
        safe_address: activeTreasury.treasury_address,
        safe_data_account: activeTreasury.treasury_escrow,
        receiver: (publicKey as PublicKey).toString(),
        amount: 1,
        token_mint_address: detail.address,
        nft_name: detail.name,
        nft_img_url: detail.image,
        transaction_name: `Withdraw NFT to ${toSubstring(
          publicKey?.toString(),
          10,
          true
        )}`
      }
      console.log(transferData)
      if (treasuryToken)
        dispatch(
          initTransferNftFromTreasury({ data: transferData, treasuryToken })
        )
    }
  }

  return (
    <div
      onMouseOver={() => {
        setShowOverlay(true)
      }}
      onMouseLeave={() => {
        setShowOverlay(false)
      }}
      style={
        eachWidth
          ? {
              width: eachWidth ?? 314,
              height: eachWidth ?? 314
            }
          : {}
      }
      key={detail.address}
      className="w-full rounded relative"
      {...rest}
    >
      <Image
        src={`https://res.cloudinary.com/demo/image/fetch/${detail.image}`}
        className="rounded"
        alt={detail.name}
        width={eachWidth ?? 314}
        height={eachWidth ?? 314}
        // layout="fill"
      />
      {showOverlay && (
        <>
          <div
            style={
              eachWidth
                ? {
                    width: eachWidth ?? 314,
                    height: eachWidth ?? 314
                  }
                : {}
            }
            className="w-full h-full absolute left-0 top-0 rounded nft-overlay"
          />
          <div className="absolute bottom-6 left-6 right-6 cursor-pointer text-content-secondary">
            <p className="text-subtitle font-semibold">{detail.name}</p>
            <p className="flex items-center gap-1.5 mb-3">
              {toSubstring(detail.address, 10, true)}
              <CopyButton content={detail.address} />
            </p>
            <Button
              title={`${t("treasury:withdraw-to-your-wallet")}`}
              variant="gradient"
              endIcon={<Icons.ArrowUpRightIcon />}
              className="w-full"
              onClick={withdrawNftToYourWallet}
            />
          </div>
        </>
      )}
    </div>
  )
}
