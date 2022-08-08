import type { NextPage } from "next"
import { useState } from "react"
import { NFTDetail } from "./DepositNFTEach"
import { DepositNFTLeft } from "./DepositNFTLeft"
import { DepositNFTsList } from "./DepositNFTsList"

const DepositNFT: NextPage = () => {
  const [selectedNFT, setNFT] = useState<NFTDetail | undefined>({
    address: "",
    name: "",
    image: ""
  })

  return (
    <div className="grid bg-background-secondary rounded-[4px] p-10 lg:flex">
      <DepositNFTLeft nft={selectedNFT} className="w-full lg:w-[380px]" />
      <DepositNFTsList className="w-full lg:w-[621px]" onChange={setNFT} />
    </div>
  )
}

export default DepositNFT
