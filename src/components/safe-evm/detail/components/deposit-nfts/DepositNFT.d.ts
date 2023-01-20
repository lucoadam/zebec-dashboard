import { NFTDetail } from "./DepositNFTEach"

export interface DepositNFTFormData {
  transactionName: string
  receiver: string
  nftAddress?: string
  chooseNFT?: boolean
}

export interface DepositNFTProps {
  className?: string
  nft: NFTDetail | undefined
}
