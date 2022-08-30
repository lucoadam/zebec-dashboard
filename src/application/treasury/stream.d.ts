import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import {
  TransactionSignature,
  AccountMeta,
  Keypair,
  PublicKey,
  Transaction
} from "@solana/web3.js"

export declare const parseErrorMessage: (message: string) => string
export declare const sendTx: (
  tx: Transaction,
  provider: AnchorProvider
) => Promise<TransactionSignature>
export declare const getAmountInLamports: (amount: number) => number
export declare const getTokenAmountInLamports: (
  amount: number,
  tokenMintAddress: PublicKey,
  program: Program
) => Promise<number>
export declare const getClusterTime: (provider: AnchorProvider) => Promise<any>
export declare const now: () => number
export declare function sleep(ms: any): Promise<unknown>
export declare const initAnchorProvider: (
  wallet: Wallet,
  rpcUrl: string,
  opts?: ConfirmOptions
) => AnchorProvider
export declare class ConsoleLog {
  readonly logger: boolean
  constructor(logger: boolean)
  info(message: string, value?: any): void
}

export declare class ZebecTransactionBuilder {
  readonly _multisigProgram: Program
  readonly _streamProgram: Program
  constructor(multisigProgram: Program, streamProgram: Program)
  execApproveTransaction(
    multisigSafeAddress: PublicKey,
    zebecAccountAndDataStoringTxAccount: PublicKey,
    senderAddress: PublicKey
  ): Promise<Transaction>
  execTransaction(
    safeAddress: PublicKey,
    safeDataAccount: PublicKey,
    zebecTxAccount: PublicKey,
    remainingAccounts: AccountMeta[]
  ): Promise<any>
  execCreateSafe(
    multisigDataAccount: Keypair,
    multisigSafeNonce: number,
    owners: PublicKey[],
    threshold: number
  ): Promise<Transaction>
  execFeeVault(
    feeReceiverAddress: PublicKey,
    feeVaultAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feePercentage: number
  ): Promise<Transaction>
  execDepositSol(
    zebecVaultAddress: PublicKey,
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execDepositToken(
    zebecVaultAddress: PublicKey,
    receiverAddress: PublicKey,
    senderAddress: PublicKey,
    withdrawEscrowDataAccountAddress: PublicKey,
    tokenMintAddress: PublicKey,
    zebecVaultAssociatedTokenAddress: PublicKey,
    receiverAssociatedTokenAddress: PublicKey,
    amount: number
  ): Promise<Transaction>
  execInitStream(
    safeAddress: PublicKey,
    safeDataAccount: PublicKey,
    zebecTransactionAccount: Keypair,
    streamDataAccountAddress: Keypair,
    withdrawDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey,
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    startTime: number,
    endTime: number,
    amount: number
  ): Promise<Transaction>
  execPauseStream(
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey
  ): Promise<Transaction>
  execResumeStream(
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey
  ): Promise<Transaction>
  execCancelStream(
    zebecVaultAddress: PublicKey,
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey,
    withdrawDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey
  ): Promise<Transaction>
  execStreamInitToken(
    safeAddress: PublicKey,
    safeDataAccount: PublicKey,
    zebecTransactionAccount: Keypair,
    streamDataAccountAddress: Keypair,
    withdrawDataAccount: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey,
    senderAddress: PublicKey,
    receiverAddress: PublicKey,
    tokenMintAddress: PublicKey,
    startTime: number,
    endTime: number,
    amount: number
  ): Promise<Transaction>
  execStreamPauseToken(
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey
  ): Promise<Transaction>
  execStreamResumeToken(
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey
  ): Promise<Transaction>
  execStreamCancelToken(
    zebecVaultAddress: PublicKey,
    safeAddress: PublicKey,
    receiverAddress: PublicKey,
    streamDataAccountAddress: PublicKey,
    zebecTransactionAccount: Keypair,
    safeDataAccount: PublicKey,
    senderAddress: PublicKey,
    withdrawDataAccountAddress: PublicKey,
    feeReceiverAddress: PublicKey,
    feeVaultDataAddress: PublicKey,
    feeVaultAddress: PublicKey,
    tokenMintAddress: PublicKey,
    pdaTokenData: PublicKey,
    destTokenData: PublicKey,
    feeTokenData: PublicKey
  ): Promise<Transaction>
}

export declare class ZebecMultisig {
  readonly anchorProvider: AnchorProvider
  readonly multisigProgram: Program
  readonly streamProgram: Program
  readonly multisigProgramId: PublicKey
  readonly streamProgramId: PublicKey
  readonly transactionBuilder: ZebecTransactionBuilder
  readonly feeReceiverAddress: PublicKey
  readonly logger: boolean
  readonly consolelog: ConsoleLog
  constructor(
    anchorProvider: AnchorProvider,
    feeReceiver: string,
    logger?: boolean
  )
  _findZebecVaultAccount(walletAddress: PublicKey): Promise<[PublicKey, number]>
  _findSolWithdrawEscrowAccount(
    walletAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findSafeAddress(walletAddress: PublicKey): Promise<[PublicKey, number]>
  _findFeeVaultAddress(
    feeReceiverAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findFeeVaultDataAccount(
    feeReceiverAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findTokenWithdrawEscrowAccount(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<[PublicKey, number]>
  _getAccociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): Promise<PublicKey>
  _fetchTresholdData(stream_data_account: PublicKey): Promise<any>
  fetchMultiSigStreamData(stream_data_account: PublicKey): Promise<any>
  _makeTxn(tx: Transaction, escrow?: Keypair[]): Promise<Transaction>
  createSafe(data: any): Promise<any>
  createFeeVault(data: any): Promise<any>
  depositSolToSafe(data: any): Promise<any>
  depositTokenToSafe(data: any): Promise<any>
}
export declare class ZebecTreasuryProps extends ZebecMultisig {
  constructor(
    anchorProvider: AnchorProvider,
    feeReceiver: string,
    logger?: boolean
  )
  init(data: any): Promise<any>
  execInit(data: any): Promise<any>
  pause(data: any): Promise<any>
  execPause(data: any): Promise<any>
  resume(data: any): Promise<any>
  execResume(data: any): Promise<any>
  cancel(data: any): Promise<any>
  execCancel(data: any): Promise<any>
  fetchStreamData(stream_data_account: PublicKey): Promise<any>
}
export declare class ZebecTokenTreasuryProps extends ZebecMultisig {
  constructor(
    anchorProvider: AnchorProvider,
    feeReceiver: string,
    logger?: boolean
  )
  init(data: any): Promise<any>
  execInit(data: any): Promise<any>
  pause(data: any): Promise<any>
  execPause(data: any): Promise<any>
  resume(data: any): Promise<any>
  execResume(data: any): Promise<any>
  cancel(data: any): Promise<any>
  execCancel(data: any): Promise<any>
  withdraw(): Promise<any>
}
