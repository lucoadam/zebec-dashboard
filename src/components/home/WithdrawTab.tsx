import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { withdrawNative, withdrawToken } from "application"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { constants } from "constants/constants"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import { FC, useContext, useState } from "react"
import { getBalance } from "utils/getBalance"
import * as Icons from "assets/icons"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"

import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecMessengerClient
} from "@zebec-io/zebec-wormhole-sdk"
import { toast } from "features/toasts/toastsSlice"

const WithdrawTab: FC = () => {
  const { t } = useTranslation()
  const { stream, token } = useContext(ZebecContext)
  const walletObject = useZebecWallet()
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const tokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter((token) => token.chainId === "solana")
  )
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || []
  const streamingTokens =
    useAppSelector((state) => state.zebecStreamingBalance.tokens) || []

  const [loading, setLoading] = useState<boolean>(false)
  const [showMaxInfo, setShowMaxInfo] = useState<boolean>(false)

  const {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    errors,
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    reset
  } = useWithdrawDepositForm({
    tokens: tokenDetails,
    type: "withdraw"
  })

  const setMaxAmount = () => {
    const balance =
      getBalance(walletTokens, currentToken.symbol) -
      getBalance(streamingTokens, currentToken.symbol)

    if (getBalance(streamingTokens, currentToken.symbol) > 0) {
      setShowMaxInfo(true)
    } else {
      setShowMaxInfo(false)
    }

    setValue("amount", balance.toString())
    trigger("amount")
  }

  const withdrawCallback = () => {
    reset()
    setTimeout(() => {
      dispatch(fetchZebecBalance(walletObject.publicKey?.toString()))
      dispatch(
        fetchWalletBalance({
          publicKey: walletObject.publicKey?.toString(),
          chainId: walletObject.chainId,
          signer: walletObject.chainId === "solana" && signer
        })
      )
    }, constants.BALANCE_FETCH_TIMEOUT)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSolanaSubmit = async (data: any) => {
    // on withdrawal form submit
    setLoading(true)
    const withdrawData = {
      sender: (walletObject.publicKey as PublicKey).toString(),
      amount: +data.amount,
      token_mint_address: currentToken.symbol === "SOL" ? "" : currentToken.mint
    }
    if (currentToken.symbol === "SOL")
      stream &&
        dispatch(
          withdrawNative(withdrawData, stream, setLoading, withdrawCallback)
        )
    else
      token &&
        dispatch(
          withdrawToken(withdrawData, token, setLoading, withdrawCallback)
        )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEvmSubmit = async (data: any) => {
    if (signer) {
      try {
        setLoading(true)
        const sourceChain = getEVMToWormholeChain(walletObject.chainId)
        const targetChain = 1
        console.log(sourceChain, targetChain)
        console.log("pda", walletObject.publicKey?.toString())
        console.log("token mint", currentToken.mint)
        console.log("withdrawer: ", walletObject.originalAddress?.toString())

        const messengerContract = new ZebecMessengerClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )
        const tx = await messengerContract.TokenWithdrawal(
          data.amount,
          walletObject.originalAddress?.toString() as string,
          currentToken.mint
        )
        console.log("tx", tx)
        withdrawCallback()
        dispatch(
          toast.success({
            message: "Withdrawal initiated"
          })
        )
      } catch (e) {
        console.log("error", e)
        dispatch(toast.error({ message: "Error withdrawing token" }))
      }
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = (data: any) => {
    if (Number(data.amount) > getBalance(walletTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "validation:withdraw-max-amount" },
        { shouldFocus: true }
      )
      return
    }
    if (walletObject.chainId === "solana") {
      handleSolanaSubmit(data)
    } else {
      handleEvmSubmit(data)
    }
  }

  return (
    <div className="withdraw-from-zebec-wallet px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.withdraw-title")}
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
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
            walletTokens={walletTokens}
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        {showMaxInfo && (
          <div className="mt-2 text-caption text-content-tertiary flex items-start gap-x-1">
            <Icons.InformationIcon className="w-5 h-5 flex-shrink-0" />
            <span>
              {t("common:deposit-withdrawal.max-treasury-deposit-message")}
            </span>
          </div>
        )}

        <Button
          title={`${t("common:buttons.withdraw")}`}
          variant="gradient"
          className="w-full mt-6"
          disabled={loading}
          loading={loading}
        />
      </form>
    </div>
  )
}

export default WithdrawTab
