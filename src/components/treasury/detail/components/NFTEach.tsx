import CopyButton from "components/shared/CopyButton"
import { FC, useState } from "react"
import { toSubstring } from "utils"

interface NFTDetail {
  name: string
  image: string
  address: string
}

interface NFTEachProps extends React.HTMLAttributes<HTMLDivElement> {
  detail: NFTDetail
}

export const NFTEach: FC<NFTEachProps> = ({ detail, ...rest }) => {
  const [showOverlay, setShowOverlay] = useState(false)
  return (
    <div
      key={detail.address}
      className="w-[352px] h-[352px] rounded relative"
      onMouseOver={() => {
        setShowOverlay(true)
      }}
      onMouseLeave={() => {
        setShowOverlay(false)
      }}
      {...rest}
    >
      <img src={detail.image} className="min-w-[352px] h-[352px] rounded" />
      {showOverlay && (
        <>
          <div className="min-w-[352px] h-[352px] absolute left-0 top-0 rounded nft-overlay" />
          <div className="absolute bottom-6 left-6 cursor-pointer">
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
