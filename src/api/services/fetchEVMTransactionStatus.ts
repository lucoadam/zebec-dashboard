import {
  ChainId,
  toChainName,
  tryNativeToUint8Array
} from "@certusone/wormhole-sdk"
import { connection } from "constants/cluster"
import {
  getIsRelayCompleted,
  SOL_ZEBEC_BRIDGE_ADDRESS
} from "zebec-wormhole-sdk-test"

export const listenWormholeTransactionStatus = async (
  signedVaa: Uint8Array,
  sender: string,
  chainId: ChainId = 4
) => {
  try {
    let retry = 0
    while (retry < 60) {
      const response = await getIsRelayCompleted(
        signedVaa,
        tryNativeToUint8Array(sender, toChainName(chainId)),
        connection,
        SOL_ZEBEC_BRIDGE_ADDRESS,
        "bundler"
      )
      console.log("isRelayCompleted", response)
      if (response) {
        return "success"
      }
      await new Promise((resolve) => setTimeout(resolve, 4000))
      retry += 1
    }
    return "timeout"
  } catch (e) {
    console.log(e)
    return "error"
  }
}
