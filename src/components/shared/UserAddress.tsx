import * as Icons from "assets/icons"
import { FC } from "react"
import { toSubstring } from "utils"
import CopyButton from "./CopyButton"
import { IconButton } from "./IconButton"

const walletAddressMap = [
  {
    wallet: "Hxtg59VfeWVo4bEAuW9qm9qmN2y2yYBtH3P9WEyTifkX",
    name: "Maxim Roye"
  },
  {
    wallet: "22fY53fd1PYwh8ZJS2iEwH72s6P1cT8oFjcSpp5atczv",
    name: "Lucid Dreamer"
  }
]

export const UserAddress: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallet: string
}> = ({ wallet }) => {
  const isInAddressBook = walletAddressMap.some(
    (item) => item.wallet === wallet
  )
  return (
    <div className="flex gap-x-1 items-center text-body text-content-primary">
      <span data-tip={wallet}>
        {isInAddressBook
          ? toSubstring(
              walletAddressMap.find((item) => item.wallet === wallet)?.name,
              12,
              false
            )
          : toSubstring(wallet, 5, true)}{" "}
      </span>
      {!isInAddressBook && (
        <IconButton
          icon={<Icons.UserAddIcon />}
          className="bg-background-primary min-w-7 h-7"
        />
      )}
      <CopyButton className="min-w-7" content={wallet} />
    </div>
  )
}
