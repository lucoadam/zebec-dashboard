import { nftLists } from "fakedata"
import { useEffect, useRef, useState } from "react"
import { NFTEach } from "./NFTEach"

export const NFTsList = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [eachWidth, setEachWidth] = useState<number>()

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
      {nftLists.map((item) => (
        <NFTEach eachWidth={eachWidth} key={item.address} detail={item} />
      ))}
    </div>
  )
}
