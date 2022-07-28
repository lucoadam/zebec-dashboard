import { PublicKey, TransactionSignature } from "@solana/web3.js"

export type MInitStream = {
  sender: string
  receiver: string
  start_time: number
  end_time: number
  amount: number
  token_mint_address?: string
  withdraw_limit?: number
}
type MZebecResponse = {
  status: string
  message: string | Error
  data: MStreamResponse | null
}
type MStreamResponse = {
  transactionHash: TransactionSignature
  pda?: PublicKey | string
}
type MPauseResumeWithdrawCancel = {
  sender: string
  receiver: string
  escrow: string
  token_mint_address?: string
}
export interface ZebecNativeStreamProps {
  init(data: MInitStream): Promise<MZebecResponse>
  pause(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  resume(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  cancel(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  withdraw(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
}
