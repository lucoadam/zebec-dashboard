import { useWallet } from "@solana/wallet-adapter-react"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import { IconButton } from "components/shared"
import CopyButton from "components/shared/CopyButton"
import { StaticImageData } from "next/image"
import { FC } from "react"
import { toSubstring } from "utils"
import { Owner } from "./CreateTreasury.d"

const OwnerLists: FC<{
  maxItems?: number
  owners: Owner[]
  setOwners?: (owners: Owner[]) => void
  showCopy?: boolean
  className?: string
}> = ({ owners, setOwners, maxItems = 3, showCopy, className = "" }) => {
  const { publicKey } = useWallet()
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]
  const styles = {
    ...(owners.length > maxItems
      ? {
          height: `${maxItems * 4.5}rem`
        }
      : {})
  }
  const classes = owners.length > maxItems ? `overflow-y-scroll` : ""
  const rowClasses = owners.length > maxItems ? `pr-5` : ""

  return (
    <div
      className={`divide-y divide-outline ${classes} ${className}`}
      style={styles}
    >
      {owners.map((owner, index) => {
        return (
          <div key={index} className="w-full flex py-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={Avatars[index % 3].src}
              width={48}
              height={48}
              className="object-contain"
              alt={`Avatar ${index + 1}`}
            />
            <div
              className={`flex flex-1 justify-between items-center ${rowClasses}`}
            >
              <div className="flex  flex-col mx-3">
                <div className="text-subtitle text-content-primary font-semibold">
                  {owner.name}
                </div>
                <div className="flex items-center text-content-primary text-body gap-x-2">
                  {toSubstring(owner.wallet, 10, true)}{" "}
                  {showCopy && <CopyButton content={owner.wallet} />}
                </div>
              </div>
              {setOwners &&
                !(
                  owners.length > 1 && owner.wallet === publicKey?.toString()
                ) && (
                  <IconButton
                    onClick={() => {
                      setOwners(owners.filter((o) => o.wallet !== owner.wallet))
                    }}
                    type="button"
                    className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer bg-background-secondary"
                    icon={<Icons.CrossIcon className="text-base" />}
                  />
                )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OwnerLists
