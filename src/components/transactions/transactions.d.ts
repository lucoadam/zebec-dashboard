export enum StatusType {
  SCHEDULED = "scheduled",
  ONGOING = "outgoing",
  CANCELLED = "cancelled",
  PAUSED = "paused",
  COMPLETED = "completed"
}

export type TransactionStatusType =
  | StatusType.SCHEDULED
  | StatusType.ONGOING
  | StatusType.CANCELLED
  | StatusType.PAUSED
  | StatusType.COMPLETED
