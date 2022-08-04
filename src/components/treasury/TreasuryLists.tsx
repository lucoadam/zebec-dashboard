import CopyButton from "components/shared/CopyButton"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { FC } from "react"
import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as AvatarImages from "assets/images/avatars"
import { toSubstring } from "utils"

const TreasuryLists: FC = () => {
  const treasuries = useAppSelector((state) => state.treasury.treasuries)
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {treasuries.map((treasury, index) => {
          return (
            <Link key={treasury.id} href={`/treasury/${treasury.id}`}>
              <div className="p-6 bg-background-secondary rounded cursor-pointer">
                <Image
                  src={Avatars[index % 3]}
                  layout="fixed"
                  width={48}
                  height={48}
                  alt={`Avatar ${index + 1}`}
                />
                <div className="flex flex-col gap-y-4 mt-6">
                  <div className="text-subtitle text-content-primary font-semibold">
                    {treasury.safe_name}
                  </div>
                  <div className="flex gap-x-3 items-center flex-wrap">
                    <div className="flex gap-x-1.5 items-center text-content-primary">
                      <Icons.UserGroupIcon className="text-base" />
                      <div>{treasury.owners.length} Owners</div>
                    </div>
                    <div className="flex gap-x-1.5 items-center text-content-primary">
                      <Icons.NotebookIcon className="text-base" />
                      <div>
                        <span data-tip={treasury.multisig_vault}>
                          {toSubstring(treasury.multisig_vault, 6, true)}
                        </span>
                      </div>
                      <CopyButton content={treasury.multisig_vault} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default TreasuryLists
