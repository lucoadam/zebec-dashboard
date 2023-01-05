import { useAppSelector } from "app/hooks"
import { EmptyDataState } from "components/shared"
import { useTranslation } from "next-i18next"
import { useEffect, useRef, useState } from "react"
import { NFTEach } from "./NFTEach"

export const NFTsList = () => {
  const { t } = useTranslation()
  const divRef = useRef<HTMLDivElement>(null)
  const [eachWidth, setEachWidth] = useState<number>()
  const { treasuryNfts, loading } = useAppSelector((state) => state.treasuryNft)

  const resizeDimensions = () => {
    if (divRef.current) {
      if (window.innerWidth > 640) {
        setEachWidth((divRef.current.clientWidth - 75) / 3)
      } else {
        setEachWidth((divRef.current.clientWidth - 75) / 2)
      }
    }
  }

  useEffect(() => {
    if (divRef.current) {
      resizeDimensions()
      window.addEventListener("resize", resizeDimensions)
    }
    return () => {
      window.removeEventListener("resize", resizeDimensions)
    }
  }, [divRef])

  return (
    <div
      ref={divRef}
      className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:justify-start sm:justify-center"
    >
      {loading ? (
        <></>
      ) : treasuryNfts.length > 0 ? (
        treasuryNfts.map((item) => (
          <NFTEach eachWidth={eachWidth} key={item.address} detail={item} />
        ))
      ) : (
        <div className="col-span-2 sm:col-span-3">
          <EmptyDataState
            message={t("treasury:no-nft-in-treasury")}
            padding={120}
            className="h-[450px] w-full rounded !px-10 text-center !py-0 justify-center"
          />
        </div>
      )}
    </div>
  )
}
