export enum TreasuryTransactionType {
  DEPOSIT_TO_TREASURY = "deposit_treasury",
  DEPOSIT_TO_TREASURY_VAULT = "deposit_treasury_vault",
  WITHDRAW_FROM_TREASURY = "withdraw_treasury",
  WITHDRAW_FROM_TREASURY_VAULT = "withdraw_treasury_vault",
  INSTANT = "instant",
  CONTINUOUS = "continuous"
}

export type TreasuryTransactionStatesType =
  | TreasuryTransactionType.DEPOSIT_TO_TREASURY
  | TreasuryTransactionType.DEPOSIT_TO_TREASURY_VAULT
  | TreasuryTransactionType.WITHDRAW_FROM_TREASURY
  | TreasuryTransactionType.WITHDRAW_FROM_TREASURY_VAULT
  | TreasuryTransactionType.INSTANT
  | TreasuryTransactionType.CONTINUOUS

export type CallbackMessageType = "success" | "error"

export type ApprovedRejectedUserProps = {
  user: string
  time: number
}

export type WithdrawDepositTransactionProps = {
  id: number
  approved_by: ApprovedRejectedUserProps[]
  rejected_by: ApprovedRejectedUserProps[]
  receiver: string
  sender: string
  token_mint_address: string
  status: string
  token_symbol: string
  uuid: string
  transaction_hash: string
  amount: string
  transaction_account: string
  transaction_type: TreasuryTransactionStatesType
  token: string
  created_at: string
}

export enum TreasuryApprovalType {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export type TreasuryApprovalStatusType =
  | TreasuryApprovalType.PENDING
  | TreasuryApprovalType.ACCEPTED
  | TreasuryApprovalType.REJECTED
