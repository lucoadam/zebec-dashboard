import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import {
  setLoading,
  signTransaction,
  toggleSignModal
} from "features/modals/signModalSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  TreasuryTransactionType,
  CallbackMessageType
} from "components/treasury/treasury.d"
import {
  executeDepositToTreasuryVault,
  executeWithdrawFromTreasury,
  executeWithdrawFromTreasuryVault
} from "application"
import ZebecContext from "app/zebecContext"

const SignTransactionModal: FC = ({}) => {
  const { publicKey } = useWallet()
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const { show, loading, transaction } = useAppSelector(
    (state) => state.signTransaction
  )
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const dispatch = useAppDispatch()
  const { t } = useTranslation("transactions")

  const signTransactionCallback = (message: CallbackMessageType) => {
    if (message === "success") {
      dispatch(signTransaction({ uuid: transaction.uuid }))
    } else {
      dispatch(setLoading(false))
    }
  }

  const executeSignTransaction = () => {
    if (activeTreasury && publicKey) {
      dispatch(setLoading(true))
      const data = {
        sender: transaction.approved_by[0].user,
        receiver: transaction.receiver,
        safe_address: activeTreasury.treasury_address,
        safe_data_account: activeTreasury.treasury_escrow,
        amount: Number(transaction.amount),
        token_mint_address: transaction.token_mint_address,
        transaction_account: transaction.transaction_account,
        signer: publicKey.toString()
      }

      if (
        transaction.transaction_type ===
        TreasuryTransactionType.DEPOSIT_TO_TREASURY_VAULT
      ) {
        if (!data.token_mint_address) {
          treasury &&
            dispatch(
              executeDepositToTreasuryVault({
                data: data,
                callback: signTransactionCallback,
                treasury: treasury
              })
            )
        } else {
          treasuryToken &&
            dispatch(
              executeDepositToTreasuryVault({
                data: data,
                callback: signTransactionCallback,
                treasuryToken: treasuryToken
              })
            )
        }
      } else if (
        transaction.transaction_type ===
        TreasuryTransactionType.WITHDRAW_FROM_TREASURY_VAULT
      ) {
        if (!data.token_mint_address) {
          treasury &&
            dispatch(
              executeWithdrawFromTreasuryVault({
                data: data,
                callback: signTransactionCallback,
                treasury: treasury
              })
            )
        } else {
          treasuryToken &&
            dispatch(
              executeWithdrawFromTreasuryVault({
                data: data,
                callback: signTransactionCallback,
                treasuryToken: treasuryToken
              })
            )
        }
      } else if (
        transaction.transaction_type ===
        TreasuryTransactionType.WITHDRAW_FROM_TREASURY
      ) {
        if (!data.token_mint_address) {
          treasury &&
            dispatch(
              executeWithdrawFromTreasury({
                data: data,
                callback: signTransactionCallback,
                treasury: treasury
              })
            )
        } else {
          treasuryToken &&
            dispatch(
              executeWithdrawFromTreasury({
                data: data,
                callback: signTransactionCallback,
                treasuryToken: treasuryToken
              })
            )
        }
      }
    }
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(toggleSignModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold">
            {t("modal-actions.sign-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              className={`w-full `}
              variant="gradient"
              endIcon={loading ? <Icons.Loading /> : <></>}
              disabled={loading}
              title={
                loading
                  ? `${t("modal-actions.signing")}`
                  : `${t("modal-actions.yes-sign")}`
              }
              onClick={executeSignTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full ${loading ? "cursor-not-allowed" : ""} `}
              disabled={loading}
              title={`${t("modal-actions.no-sign")}`}
              onClick={() => {
                dispatch(toggleSignModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default SignTransactionModal
