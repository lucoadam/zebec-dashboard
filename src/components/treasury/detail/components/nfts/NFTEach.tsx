import CopyButton from "components/shared/CopyButton"
import Image from "next/image"
import { FC, useState } from "react"
import { toSubstring } from "utils"

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
  const [showOverlay, setShowOverlay] = useState(false)
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
        src={detail.image}
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
          <div className="absolute bottom-6 left-6 cursor-pointer text-content-secondary">
            <p className="text-subtitle font-semibold">{detail.name}</p>
            <p className="flex items-center gap-1.5">
              {toSubstring(detail.address, 5, true)}
              <CopyButton content={detail.address} />
            </p>
          </div>
        </>
      )}
    </div>
  )
}
