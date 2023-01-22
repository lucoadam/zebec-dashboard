import { connection } from "constants/cluster"
import {
  getIsRelayCompleted,
  SOL_ZEBEC_BRIDGE_ADDRESS
} from "@zebec-protocol/wormhole-bridge"

export const listenWormholeTransactionStatus = async (
  signedVaa: Uint8Array
) => {
  try {
    let retry = 0
    while (retry < 36) {
      const response = await getIsRelayCompleted(
        signedVaa,
        connection,
        SOL_ZEBEC_BRIDGE_ADDRESS,
        "bundler",
        "finalized"
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
