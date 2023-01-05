import type { NextPage } from "next"
import { useState } from "react"
import { NFTDetail } from "./NFTEach"
import { NFTsList } from "./NFTsList"
import { SendNFT } from "./SendNFT"

const TreasuryNFTStream: NextPage = () => {
  const [selectedNFT, setNFT] = useState<NFTDetail | undefined>({
    address: "",
    name: "",
    image: ""
  })

  return (
    <div className="grid lg:flex">
      <SendNFT
        nft={selectedNFT}
        changeNFT={setNFT}
        className="w-full lg:w-[628px]"
      />
      <NFTsList
        className="w-full lg:w-[453px]"
        nft={selectedNFT}
        onChange={setNFT}
      />
    </div>
  )
}

export default TreasuryNFTStream
