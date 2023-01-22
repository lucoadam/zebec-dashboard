import { EmptyDataState } from "components/shared"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image, { StaticImageData } from "next/image"
import * as AvatarImages from "assets/images/avatars"
import * as Icons from "assets/icons"
import { toSubstring } from "utils"
import CopyButton from "components/shared/CopyButton"
import { useZebecWallet } from "hooks/useWallet"
import axios from "axios"
import { getSafes } from "application/safe-evm/createTreasury"



const TreasuryLists = () => {
  const { t } = useTranslation("treasury")
  const walletObject = useZebecWallet();
  const [unarchivedTreasuries, setUnarchivedTreasuries] = useState<any[]>(
    []
  )
  useEffect(() => {
    if (walletObject && typeof walletObject.originalAddress !== "undefined") {
      getSafes(walletObject.originalAddress?.toString())
        .then((res) => {
          console.log(res)
          setUnarchivedTreasuries(res)
        }
        )
    }
  }, [walletObject])
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4
  ]

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {unarchivedTreasuries.length === 0 ? (
          <>
            <div className="md:col-span-2 lg:col-span-3">
              <EmptyDataState message={`${t("no-treasury")}`} />
            </div>
          </>
        ) : (
          unarchivedTreasuries.map((treasury, index) => {
            return (
              <Link key={treasury.id} href={`/treasury/${treasury.uuid}`}>
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
                      {treasury.name}
                    </div>
                    <div className="flex gap-x-3 items-center flex-wrap">
                      <div className="flex gap-x-1.5 items-center text-content-primary">
                        <Icons.UserGroupIcon className="text-base" />
                        {/* <div>{treasury.owners.length} Owners</div> */}
                      </div>
                      <div className="flex gap-x-1.5 items-center text-content-primary">
                        <Icons.NotebookIcon className="text-base" />
                        <div>
                          <span data-tip={treasury.address}>
                            {toSubstring(treasury.address, 6, true)}
                          </span>
                        </div>
                        <CopyButton content={treasury.address} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </>

  )
}

export default TreasuryLists
