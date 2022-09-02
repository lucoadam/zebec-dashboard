import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction
} from "@solana/spl-token"
import { connection } from "constants/cluster"
import {
  Transaction,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL
} from "@solana/web3.js"
import { AppDispatch } from "app/store"
import { toast } from "features/toasts/toastsSlice"
import { constants } from "constants/constants"

export const zbcAirdrop =
  (walletPublicKey: PublicKey) => async (dispatch: AppDispatch) => {
    try {
      const mint = new PublicKey("6vvKBoSx7p33YER66LQ8VokTRHUcmxwz3iA1GSbexC5i")
      const privateKey = process.env.ZBC_AIRDROP
      if (privateKey) {
        const payer = Keypair.fromSecretKey(Buffer.from(JSON.parse(privateKey)))

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          payer,
          mint,
          payer.publicKey
        )
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          payer,
          mint,
          walletPublicKey
        )
        const transaction = new Transaction().add(
          createTransferInstruction(
            fromTokenAccount.address,
            toTokenAccount.address,
            payer.publicKey,
            constants.TEST_ZBC_AMOUNT * LAMPORTS_PER_SOL
          )
        )
        const signature = await connection.sendTransaction(transaction, [payer])

        await connection.confirmTransaction(signature, "confirmed")

        dispatch(
          toast.success({
            message: `${constants.TEST_ZBC_AMOUNT} test ZBC faucet airdropped.`
          })
        )
      }
    } catch (error) {
      console.log(error)
      dispatch(
        toast.error({
          message: `Error occured on test ZBC airdrop.`
        })
      )
    }
  }
