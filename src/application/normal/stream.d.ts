import {
  Keypair,
  PublicKey,
  TransactionSignature,
  Transaction
} from "@solana/web3.js"

import { AnchorProvider, Program } from "@project-serum/anchor"

export declare class ZebecTransactionBuilder {
  readonly _program: Program
  constructor(program: Program)
  execFeeVault(
    feeReceiverAddress: PublicKey,
    feeVaultAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feePercentage: number
  ): Promise<Transaction>
  execRetrieveSolFees(
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey
  ): Promise<Transaction>
  execRetrieveTokenFees(
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey,
    tokenMintAddress: PublicKey,
    feeVaultTokenAccount: PublicKey,
    feeOwnerTokenAccount: PublicKey
  ): Promise<Transaction>
  execDepositSolToZebecWallet(
    senderAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execDepositTokenToZebecWallet(
    zebecVaultAddress: PublicKey,
    senderAddress: PublicKey,
    tokenMintAddress: PublicKey,
    senderAssociatedTokenAddress: PublicKey,
    zebecVaultAssociatedAccountAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execWithdrawSolFromZebecVault(
    senderAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execWithdrawTokenFromZebecVault(
    senderAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    tokenMintAddress: PublicKey,
    senderAssociatedTokenAddress: PublicKey,
    escrowAssociatedTokenAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execStreamInitSol(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    escrowAccountKeypair: Keypair,
    withdrawEscrowDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    startTime: number,
    endTime: number,
    amount: number
  ): Promise<Transaction>
  execStreamWithdrawSol(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    escrowAccountAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultAddress: PublicKey,
    feeVaultDataAddress: PublicKey
  ): Promise<Transaction>
  execStreamCancelSol(
    zebecVaultAddress: PublicKey,
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    escrowDataAccountAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey
  ): Promise<Transaction>
  execStreamPauseSol(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    escrowAccountAddress: PublicKey
  ): Promise<Transaction>
  execStreamResumeSol(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    escrowAccountAddress: PublicKey
  ): Promise<Transaction>
  execStreamInitToken(
    escrowAccountKeypair: Keypair,
    withdrawEscrowDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    tokenMintAddress: PublicKey,
    startTime: number,
    endTime: number,
    amount: number
  ): Promise<Transaction>
  execStreamWithdrawToken(
    receiverAddress: PublicKey,
    senderAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feevaultAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    escrowAccountAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    tokenMintAddress: PublicKey,
    zebecVaultAssociatedAccountAddress: PublicKey,
    receiverAssociatedTokenAddress: PublicKey,
    feeVaultAssociatedTokenAddress: PublicKey
  ): Promise<Transaction>
  execStreamCancelToken(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey,
    zebecVaultAddress: PublicKey,
    escrowAccountAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    tokenMintAddress: PublicKey,
    zebecVaultAssociatedTokenAddress: PublicKey,
    receiverAssociatedTokenAddress: PublicKey,
    feeVaultAssociatedTokenAddress: PublicKey
  ): Promise<Transaction>
  execStreamPauseToken(
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    escrowAccountAddress: PublicKey
  ): Promise<Transaction>
}

export type MCreateFeeVault = {
  fee_percentage: number
}
export type MDepositWithdrawFromZebecVault = {
  sender: string
  amount: number
  token_mint_address?: string
}

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

export interface IBaseStream {
  program: Program
  programId: PublicKey
  feeReceiverAddress: PublicKey
  transactionBuilder: ZebecTransactionBuilder
  anchorProvider: AnchorProvider
  _findZebecVaultAccount(walletAddress: PublicKey): Promise<[PublicKey, number]>
  _findFeeVaultAddress(
    feeReceiverAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findFeeVaultDataAccount(
    feeReceiverAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findSolWithdrawEscrowAccount(
    walletAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findTokenWithdrawEscrowAccount(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<[PublicKey, number]>
  depositSolToZebecVault(
    data: MDepositWithdrawFromZebecVault
  ): Promise<MZebecResponse>
  withdrawSolFromZebecVault(
    data: MDepositWithdrawFromZebecVault
  ): Promise<MZebecResponse>
  depositTokenToZebecVault(
    data: MDepositWithdrawFromZebecVault
  ): Promise<MZebecResponse>
  withdrawTokenFromZebecVault(
    data: MDepositWithdrawFromZebecVault
  ): Promise<MZebecResponse>
  createFeeVault(data: MCreateFeeVault): Promise<MZebecResponse>
}

export interface ZebecNativeStreamProps extends IBaseStream {
  init(data: MInitStream): Promise<MZebecResponse>
  pause(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  resume(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  cancel(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
  withdraw(data: MPauseResumeWithdrawCancel): Promise<MZebecResponse>
}
