import * as borsh from "@project-serum/borsh"

export const streamingSchema = borsh.struct([
  borsh.u64("start_time"),
  borsh.u64("end_time"),
  borsh.u64("paused"),
  borsh.u64("withdraw_limit"),
  borsh.u64("amount"),
  borsh.publicKey("sender"),
  borsh.publicKey("recipient"),
  borsh.u64("withdrawn"),
  borsh.u64("paused_at")
])
