import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import api from "api/api"
import { connection } from "constants/cluster"
import { ZebecWalletContext } from "hooks/useWallet"
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
  walletObject: ZebecWalletContext,
  isLedgerWallet: boolean
) => {
  const { publicKey, signMessage, originalAddress, network } = walletObject
  if (publicKey && originalAddress && signMessage) {
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

          const encodedMessage = new TextEncoder().encode(message)
          const pubkey = Buffer.from(publicKey.toBytes()).toString("base64")
          const messagetob = Buffer.from(encodedMessage).toString("base64")

          const data = {
            wallet_address: pubkey,
            message: messagetob,
            signature: signedTx?.serialize().toString("base64"),
            is_ledger_wallet: true,
            network: "solana",
            evm_address: pubkey.toString()
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
        const b64 = await signMessage(message)
        const pubkey = Buffer.from(publicKey.toBytes()).toString("base64")
        const messagetob = Buffer.from(encodedMessage).toString("base64")

        const evm_address = Buffer.from(
          new TextEncoder().encode(originalAddress.toString())
        ).toString("base64")
        const data = {
          wallet_address: pubkey,
          signature: b64,
          message: messagetob,
          is_ledger_wallet: false,
          network,
          evm_address
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
