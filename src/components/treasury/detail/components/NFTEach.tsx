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
  const [showOverlay, setShowOverlay] = useState(true)
  return (
    <div
      key={detail.address}
      className="w-full rounded relative"
      onMouseOver={() => {
        setShowOverlay(true)
      }}
      onMouseLeave={() => {
        setShowOverlay(false)
      }}
      {...rest}
    >
      <img src={detail.image} className=" rounded" />
      {showOverlay && (
        <>
          <div className="w-full h-full absolute left-0 top-0 rounded nft-overlay" />
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
