import { nftLists } from "fakedata"
import { NFTEach } from "./NFTEach"

export const NFTsList = () => {
  return (
    <div className="flex gap-6 flex-wrap md:justify-start sm:justify-center">
      {nftLists.map((item) => (
        <NFTEach key={item.address} detail={item} />
      ))}
    </div>
  )
}
