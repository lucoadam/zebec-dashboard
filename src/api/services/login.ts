import { WalletContextState } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import api from "api/api"
import { connection } from "constants/cluster"
import TokenService from "./token.service"

export const createSignMessageTx = (message: string) => {
  const tx = new Transaction()
  const programIdPublicKey = new PublicKey(
    process.env.PROGRAM_ID || "zbcKGdAmXfthXY3rEPBzexVByT2cqRqCZb9NwWdGQ2T"
  )
  tx.add(
    new TransactionInstruction({
      programId: programIdPublicKey,
      keys: [],
      data: Buffer.from(message, "utf8")
    })
  )

  return tx
}

export const login = async (
  walletObject: WalletContextState,
  isLedgerWallet: boolean
) => {
  const { publicKey, signMessage } = walletObject
  if (publicKey && signMessage) {
    try {
      const message =
        "Zebec Wallet Verification" +
        "(" +
        `${Math.floor(Date.now() / 1000)}` +
        ")" +
        ":" +
        `${publicKey.toString()}`

      if (isLedgerWallet) {
        if (walletObject.publicKey && walletObject.signTransaction) {
          const tx = createSignMessageTx(message)
          tx.feePayer = walletObject.publicKey
          tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
          const signedTx = await walletObject.signTransaction(tx)

          // const encodedMessage = new TextEncoder().encode(message)
          const pubkey = Buffer.from(publicKey.toBytes()).toString("base64")
          // const messagetob = Buffer.from(encodedMessage).toString("base64")

          const data = {
            wallet_address: pubkey,
            message: message,
            signature: signedTx.serialize().toString("base64"),
            is_ledger_wallet: true
          }

          try {
            const response = await api.post(`/user/auth/login/`, data)
            TokenService.setTokens(response.data)
            return response
          } catch (error) {
            console.log(error)
          }
        }
      } else {
        const encodedMessage = new TextEncoder().encode(message)
        const signedMessage = await signMessage(encodedMessage)
        const b64 = Buffer.from(signedMessage).toString("base64")
        const pubkey = Buffer.from(publicKey.toBytes()).toString("base64")
        const messagetob = Buffer.from(encodedMessage).toString("base64")

        const data = {
          wallet_address: pubkey,
          signature: b64,
          message: messagetob,
          is_ledger_wallet: false
        }

        try {
          const response = await api.post(`/user/auth/login/`, data)
          TokenService.setTokens(response.data)
          return response
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {}
  }
}
