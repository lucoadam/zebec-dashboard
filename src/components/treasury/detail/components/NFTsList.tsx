import { nftLists } from "fakedata"
import { NFTEach } from "./NFTEach"

export const NFTsList = () => {
  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:justify-start sm:justify-center">
      {nftLists.map((item) => (
        <NFTEach key={item.address} detail={item} />
      ))}
    </div>
  )
}
