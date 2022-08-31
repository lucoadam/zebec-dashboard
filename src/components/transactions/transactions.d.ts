export enum StatusType {
  SCHEDULED = scheduled,
  ONGOING = ongoing,
  CANCELLED = cancelled,
  PAUSED = paused,
  COMPLETED = completed
}

export type TransactionStatusType =
  | StatusType.SCHEDULED
  | StatusType.ONGOING
  | StatusType.CANCELLED
  | StatusType.PAUSED
  | StatusType.COMPLETED

// interface IndividualTransactionType {
//   id: number
//   status: string
//   start_time: number
//   end_time: number
//   sender: string
//   token_mint_address: string
//   amount: number
//   name: string
//   uuid: string
//   transaction_type: "instant" | "continuous"
//   transaction_hash: string
//   remarks: string
//   pda: string
//   receiver: string
//   token: string
//   id: 0
//   status: string
//   start_time: string
//   end_time: string
//   sender: string
//   token_mint_address: string
//   amount: number
//   latest_transaction_event: {
//     id: number
//     blockchainStatus: string
//     paused: boolean | null
//     withdrawn: string | null
//     withdraw_limit: string | null
//     paused_at: string | null
//     paused_amt: string | null
//     time: string | null
//     status: string
//     transaction: number
//   }
// }
