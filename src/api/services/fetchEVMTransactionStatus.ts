import { ChainId } from "@certusone/wormhole-sdk"
import { getTokenBridgeAddressForChain } from "@jettxcypher/zebec-wormhole-sdk"
import axios from "axios"

const fetchWormholeTransactionStatus = async (
  sequence: number | string,
  chainId: number
) => {
  const emitterAddress = getTokenBridgeAddressForChain(chainId as ChainId)
  try {
    const { data } = await axios.get(
      `https://zebec-relayer.alishdahal.com.np/transaction/${chainId}/${emitterAddress}/${sequence}`
    )
    if (data.data.signatures && data.data.signatures?.execTxId) {
      return "success"
    }
    return "error"
  } catch (e) {
    return "pending"
  }
}

export const listenWormholeTransactionStatus = async (
  sequence: number | string,
  chainId = 4
) => {
  let retry = 0
  let response
  do {
    console.log("listening for transaction status")
    response = await fetchWormholeTransactionStatus(sequence, chainId)
    if (response === "error") {
      return "error"
    }
    if (response === "success") {
      console.log("transfer complete")
      return "success"
    }
    await new Promise((resolve) => setTimeout(resolve, 4000))
    retry += 1
  } while (retry++ < 30)
  return "timeout"
}
