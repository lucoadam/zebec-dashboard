import { NFTDetail } from "./NFTEach"

export interface SendNFTFormData {
  transactionName: string
  receiver: string
  nftAddress?: string
  chooseNFT?: boolean
}

export interface SendNFTProps {
  setFormValues?: (values: SendNFTFormData) => void
  className?: string
  nft: NFTDetail | undefined
  changeNFT?: (nft: NFTDetail | undefined) => void
}
