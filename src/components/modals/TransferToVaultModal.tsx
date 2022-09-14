import { useAppDispatch, useAppSelector } from "app/hooks"
import {
  Button,
  Modal,
  TokensDropdown,
  WithdrawDepositInput
} from "components/shared"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useTranslation } from "next-i18next"
import { getBalance } from "utils/getBalance"
import {
  setLoading,
  toggleTransferToVaultModal
} from "features/modals/transferToVaultModalSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useContext } from "react"
import ZebecContext from "app/zebecContext"
import { depositToTreasuryVault } from "application"
import { CallbackMessageType } from "components/treasury/treasury"

const TransferToVaultModal = () => {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const { treasury, treasuryToken } = useContext(ZebecContext)
  const transferToVaultStates = useAppSelector((state) => state.transferToVault)
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const treasuryBalance =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || []
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    setValue,
    errors,
    register,
    handleSubmit,
    setError,
    trigger,
    reset
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "deposit"
  })

  const depositToTreasuryCallback = (message: CallbackMessageType) => {
    if (message === "success") {
      reset()
      dispatch(toggleTransferToVaultModal())
    } else {
      dispatch(setLoading(false))
    }
  }

  const submit = (data: { amount: string }) => {
    if (
      Number(data.amount) > getBalance(treasuryBalance, currentToken.symbol)
    ) {
      setError(
        "amount",
        { type: "custom", message: "validation:max" },
        { shouldFocus: true }
      )
      return
    } else {
      dispatch(setLoading(true))
      const transferData = {
        sender: (publicKey as PublicKey).toString(),
        safe_address: activeTreasury?.treasury_address || "",
        safe_data_account: activeTreasury?.treasury_escrow || "",
        amount: Number(data.amount),
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      if (!transferData.token_mint_address) {
        treasury &&
          dispatch(
            depositToTreasuryVault({
              data: transferData,
              callback: depositToTreasuryCallback,
              treasury: treasury
            })
          )
      } else {
        treasuryToken &&
          dispatch(
            depositToTreasuryVault({
              data: transferData,
              callback: depositToTreasuryCallback,
              treasuryToken: treasuryToken
            })
          )
      }
    }
  }

  const setMaxAmount = () => {
    setValue(
      "amount",
      getBalance(treasuryBalance, currentToken.symbol).toString()
    )
    trigger("amount")
  }

  return (
    <Modal
      show={transferToVaultStates.show}
      toggleModal={() => dispatch(toggleTransferToVaultModal())}
      className="rounded"
      hasCloseIcon={true}
      size="small"
    >
      <>
        <div className="text-content-primary text-subtitle font-semibold mb-1">
          {t("treasuryOverview:transfer-to-vault")}
        </div>
        <div className="text-content-secondary text-caption mb-6">
          {t("treasuryOverview:transfer-to-vault-detail")}
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col"
          autoComplete="off"
        >
          <WithdrawDepositInput
            token={currentToken}
            setMaxAmount={setMaxAmount}
            toggle={toggle}
            setToggle={setToggle}
            {...register("amount")}
            errorMessage={`${errors.amount?.message || ""}`}
          >
            {/* Tokens Dropdown */}
            <TokensDropdown
              walletTokens={treasuryBalance || []}
              tokens={tokenDetails}
              show={show}
              toggleShow={setToggle}
              setCurrentToken={setCurrentToken}
            />
          </WithdrawDepositInput>

          <Button
            title={`${t("treasuryOverview:transfer")}`}
            variant="gradient"
            className="w-full mt-6"
            loading={transferToVaultStates.loading}
            disabled={transferToVaultStates.loading}
          />
        </form>
      </>
    </Modal>
  )
}

export default TransferToVaultModal
