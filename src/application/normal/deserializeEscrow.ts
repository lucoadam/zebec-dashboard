import { PublicKey } from "@solana/web3.js"
import { ZebecNativeStreamProps } from "./stream"

export const deserializeStreamEscrow = async (
  streamTokenObject: ZebecNativeStreamProps,
  escrow: string
) => {
  const response: any = await streamTokenObject.program.account.stream.fetch(
    new PublicKey(escrow)
  )
  console.log(response)
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
  console.log(deserializedObject)
  return null
}
