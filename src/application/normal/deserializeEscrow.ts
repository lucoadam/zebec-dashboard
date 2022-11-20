import { PublicKey } from "@solana/web3.js"
import { ZebecNativeStream } from "zebec-anchor-sdk-npmtest/packages/stream"

export const deserializeStreamEscrow = async (
  streamTokenObject: ZebecNativeStream,
  escrow: string
) => {
  try {
    const response: any = await streamTokenObject.program.account.stream.fetch(
      new PublicKey(escrow)
    )
    const deserializedObject = {
      amount: response.amount.toString(),
      canCencel: response.canCencel,
      canUpdate: response.canUpdate,
      feeOwner: response.feeOwner.toString(),
      paused: response.paused.toString(),
      pausedAmt: response.pausedAmt.toString(),
      receiver: response.receiver.toString(),
      sender: response.sender.toString(),
      withdrawn: response.withdrawn.toString(),
      startTime: response.startTime.toString(),
      endTime: response.endTime.toString(),
      withdrawLimit: response.withdrawLimit.toString()
    }
    return deserializedObject
  } catch (error) {
    // commented console.log(error)
    return null
  }
}
