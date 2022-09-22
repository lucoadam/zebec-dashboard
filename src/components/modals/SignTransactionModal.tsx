import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { Button, Modal } from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import {
  setLoading,
  signTransaction,
  toggleSignModal,
  vaultContinuousSignTransaction,
  vaultContinuousSignTransactionLatestEvent,
  vaultSignTransaction
} from "features/modals/signModalSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  TreasuryTransactionType,
  CallbackMessageType,
  TreasuryApprovalType
} from "components/treasury/treasury.d"
import {
  executeCancelStreamTreasury,
  executeDepositToTreasuryVault,
  executeInitInstantStreamTreasury,
  executeInitStreamTreasury,
  executePauseStreamTreasury,
  executeResumeStreamTreasury,
  executeWithdrawFromTreasury,
  executeWithdrawFromTreasuryVault
} from "application"
import ZebecContext from "app/zebecContext"
import { StatusType } from "components/transactions/transactions.d"

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
  const vaultSignTransactionCallback = (message: CallbackMessageType) => {
    if (message === "success") {
      dispatch(vaultSignTransaction({ uuid: transaction.uuid }))
    } else {
      dispatch(setLoading(false))
    }
  }
  const vaultSignContinuousTransactionCallback = (
    message: CallbackMessageType
  ) => {
    if (message === "success") {
      dispatch(vaultContinuousSignTransaction({ uuid: transaction.uuid }))
    } else {
      dispatch(setLoading(false))
    }
  }
  const vaultSignContinuousTransactionLatestEventCallback = (
    message: CallbackMessageType
  ) => {
    if (message === "success") {
      dispatch(
        vaultContinuousSignTransactionLatestEvent({
          uuid: transaction.uuid,
          event_id: transaction.latest_transaction_event.id
        })
      )
    } else {
      dispatch(setLoading(false))
    }
  }

  const executeSignTransaction = () => {
    if (activeTreasury && publicKey) {
      dispatch(setLoading(true))
      if (transaction.transaction_type) {
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
        } else if (
          transaction.transaction_type === TreasuryTransactionType.INSTANT
        ) {
          const data = {
            safe_address: activeTreasury.treasury_address,
            safe_data_account: activeTreasury.treasury_escrow,
            token_mint_address: transaction.token_mint_address,
            transaction_account: transaction.transaction_account,
            receiver: transaction.receiver,
            signer: publicKey.toString()
          }
          if (!data.token_mint_address) {
            treasury &&
              dispatch(
                executeInitInstantStreamTreasury({
                  data: data,
                  callback: vaultSignTransactionCallback,
                  treasury: treasury
                })
              )
          } else {
            treasuryToken &&
              dispatch(
                executeInitInstantStreamTreasury({
                  data: data,
                  callback: vaultSignTransactionCallback,
                  treasuryToken: treasuryToken
                })
              )
          }
        } else if (
          transaction.transaction_type === TreasuryTransactionType.CONTINUOUS
        ) {
          if (transaction.latest_transaction_event.status === "initial") {
            const data = {
              safe_address: activeTreasury.treasury_address,
              safe_data_account: activeTreasury.treasury_escrow,
              token_mint_address: transaction.token_mint_address,
              transaction_account: transaction.transaction_account,
              stream_data_account: transaction.pda,
              receiver: transaction.receiver,
              signer: publicKey.toString()
            }
            if (!data.token_mint_address) {
              treasury &&
                dispatch(
                  executeInitStreamTreasury({
                    data: data,
                    callback: vaultSignContinuousTransactionCallback,
                    treasury: treasury
                  })
                )
            } else {
              treasuryToken &&
                dispatch(
                  executeInitStreamTreasury({
                    data: data,
                    callback: vaultSignContinuousTransactionCallback,
                    treasuryToken: treasuryToken
                  })
                )
            }
          } else if (
            transaction.latest_transaction_event.approval_status ===
            TreasuryApprovalType.PENDING
          ) {
            const data = {
              safe_address: activeTreasury.treasury_address,
              safe_data_account: activeTreasury.treasury_escrow,
              token_mint_address: transaction.token_mint_address,
              transaction_account:
                transaction.latest_transaction_event.transaction_account,
              stream_data_account: transaction.pda,
              receiver: transaction.receiver,
              signer: publicKey.toString()
            }
            if (
              transaction.latest_transaction_event.status.toLowerCase() ===
              StatusType.CANCELLED
            ) {
              if (!data.token_mint_address) {
                treasury &&
                  dispatch(
                    executeCancelStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasury: treasury
                    })
                  )
              } else {
                treasuryToken &&
                  dispatch(
                    executeCancelStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasuryToken: treasuryToken
                    })
                  )
              }
            } else if (
              transaction.latest_transaction_event.status.toLowerCase() ===
              StatusType.PAUSED
            ) {
              if (!data.token_mint_address) {
                treasury &&
                  dispatch(
                    executePauseStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasury: treasury
                    })
                  )
              } else {
                treasuryToken &&
                  dispatch(
                    executePauseStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasuryToken: treasuryToken
                    })
                  )
              }
            } else if (
              transaction.latest_transaction_event.status.toLowerCase() ===
              "ready"
            ) {
              if (!data.token_mint_address) {
                treasury &&
                  dispatch(
                    executeResumeStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasury: treasury
                    })
                  )
              } else {
                treasuryToken &&
                  dispatch(
                    executeResumeStreamTreasury({
                      data: data,
                      callback:
                        vaultSignContinuousTransactionLatestEventCallback,
                      treasuryToken: treasuryToken
                    })
                  )
              }
            }
          }
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
