import Image from "next/image"
import { FC } from "react"
import * as Images from "assets/images"
import { getTimesAgo, toSubstring } from "utils"

interface SignerRowProps {
  index: number
  user: string
  time?: number
}

export const SignerRow: FC<SignerRowProps> = ({ index, user, time }) => {
  return (
    <div
      key={index}
      className="flex items-center  gap-x-2 text-content-primary"
    >
      <Image
        layout="fixed"
        alt="Owner Logo"
        src={[Images.Avatar1, Images.Avatar2, Images.Avatar4][index % 3]}
        height={24}
        width={24}
        className="rounded-full flex-shrink-0"
      />
      <div className="">
        <span data-tip={user}>{toSubstring(user, 5, true)}</span>
      </div>
      {time && <div className="text-content-tertiary">{getTimesAgo(time)}</div>}
    </div>
  )
}
