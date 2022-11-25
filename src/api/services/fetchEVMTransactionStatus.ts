import {
  ChainId,
  toChainName,
  tryNativeToUint8Array
} from "@certusone/wormhole-sdk"
import { connection } from "constants/cluster"
import {
  getIsRelayCompleted,
  SOL_ZEBEC_BRIDGE_ADDRESS
} from "@zebec-protocol/wormhole-bridge"

export const listenWormholeTransactionStatus = async (
  signedVaa: Uint8Array,
  sender: string,
  chainId: ChainId = 4
) => {
  try {
    let retry = 0
    while (retry < 36) {
      const response = await getIsRelayCompleted(
        signedVaa,
        tryNativeToUint8Array(sender, toChainName(chainId)),
        connection,
        SOL_ZEBEC_BRIDGE_ADDRESS,
        "finalized",
        "bundler"
      )
      if (response) {
        return "success"
      }
      await new Promise((resolve) => setTimeout(resolve, 5000))
      retry += 1
    }
    return "timeout"
  } catch (e) {
    console.debug("fetchEVMTransactionStatus", e)
    return "error"
  }
}
