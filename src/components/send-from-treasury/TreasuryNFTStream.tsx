import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { NFTDetail } from "./NFTEach"
import { NFTsList } from "./NFTsList"
import { SendNFT } from "./SendNFT"
import { SendNFTFormData } from "./TreasuryNFTStream.d"

const TreasuryNFTStream: NextPage = () => {
  const [formValues, setFormValues] = useState<SendNFTFormData>()
  const [selectedNFT, setNFT] = useState<NFTDetail | undefined>({
    address: "",
    name: "",
    image: ""
  })

  useEffect(() => {
    setFormValues({
      transactionName: formValues?.transactionName || "",
      receiver: formValues?.receiver || "",
      nftAddress: selectedNFT?.address,
      chooseNFT: true
    })
  }, [selectedNFT, formValues])

  return (
    <div className="grid lg:flex">
      <SendNFT
        nft={selectedNFT}
        changeNFT={setNFT}
        setFormValues={setFormValues}
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
