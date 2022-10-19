import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { withdrawNative, withdrawToken } from "application"
import {
  Button,
  CollapseDropdown,
  TokensDropdown,
  WithdrawDepositInput
} from "components/shared"
import { constants } from "constants/constants"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import { FC, useContext, useRef, useState } from "react"
import { getBalance } from "utils/getBalance"
import * as Icons from "assets/icons"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"

import {
  BSC_BRIDGE_ADDRESS,
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@lucoadam/zebec-wormhole-sdk"
import { toast } from "features/toasts/toastsSlice"
import { parseSequenceFromLogEth } from "@certusone/wormhole-sdk"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { useClickOutside } from "hooks"
import { checkRelayerStatus } from "api/services/pingRelayer"

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
  const pdaTokens = useAppSelector((state) => state.pdaBalance.tokens) || []

  const [loading, setLoading] = useState<boolean>(false)
  const [showMaxInfo, setShowMaxInfo] = useState<boolean>(false)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [withdrawFrom, setWithdrawFrom] = useState("Zebec Assets")
  const dropdownWrapper = useRef(null)

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
    if (withdrawFrom === "PDA Assets") {
      setValue("amount", getBalance(pdaTokens, currentToken.symbol).toString())
      trigger("amount")
      return
    }
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

        const messengerContract = new ZebecEthBridgeClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )
        const tx = await messengerContract.withdrawToken(
          data.amount,
          walletObject.originalAddress?.toString() as string,
          currentToken.mint
        )
        console.log("tx:", tx)
        const sequence = parseSequenceFromLogEth(tx, BSC_BRIDGE_ADDRESS)
        console.log("sequence:", sequence)
        const response = await listenWormholeTransactionStatus(
          sequence,
          BSC_ZEBEC_BRIDGE_ADDRESS,
          sourceChain
        )
        console.log("response", response)
        if (response === "success") {
          dispatch(toast.success({ message: "Withdrawal completed" }))
        } else if (response === "timeout") {
          dispatch(toast.error({ message: "Withdrawal timeout" }))
        } else {
          dispatch(toast.error({ message: "Error withdrawing token" }))
        }
        withdrawCallback()
      } catch (e) {
        console.log("error", e)
        dispatch(toast.error({ message: "Error withdrawing token" }))
      }
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePdaWithdraw = (data: any) => {
    console.log(data)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = async (data: any) => {
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
      setLoading(true)
      const isRelayerActive = await checkRelayerStatus()
      if (!isRelayerActive) {
        dispatch(
          toast.error({
            message:
              "Backend Service is currently down. Please try again later."
          })
        )
        setLoading(false)
        return
      }
      if (withdrawFrom === "Zebec Assets") {
        handleEvmSubmit(data)
      } else {
        handlePdaWithdraw(data)
      }
    }
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: () => {
      setToggleDropdown(false)
    }
  })

  return (
    <div className="withdraw-from-zebec-wallet px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.withdraw-title")}
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div className="relative" ref={dropdownWrapper}>
          <label className={`text-content-secondary text-xs font-medium mb-1`}>
            Withdraw From
          </label>
          <div
            onClick={() => setToggleDropdown(!toggleDropdown)}
            className="cursor-pointer relative text-content-primary"
          >
            <input
              type="text"
              value={withdrawFrom}
              className={`cursor-pointer h-[40px] w-full !pr-12`}
              readOnly
            />
            <Icons.CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
          </div>
          <CollapseDropdown
            show={toggleDropdown}
            className="mt-8 w-full z-[99]"
            position="left"
          >
            <div className="bg-background-primary border border-outline rounded-lg divide-y divide-outline max-h-[206px] overflow-auto">
              {["Zebec Assets", "PDA Assets"].map((item) => (
                <div
                  className="text-content-primary text-sm font-medium px-4 py-3 cursor-pointer hover:bg-background-light"
                  key={item}
                  onClick={() => {
                    setWithdrawFrom(item)
                    setToggleDropdown(false)
                    setCurrentToken(tokenDetails[0])
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </CollapseDropdown>
        </div>
        {withdrawFrom === "PDA Assets" && (
          <div className="mt-2 text-caption text-content-tertiary flex items-center gap-x-1">
            <Icons.InformationIcon className="w-5 h-5 flex-shrink-0" />
            <span>Withdraw from PDA Assets will be available soon.</span>
          </div>
        )}
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          className="mt-4"
          toggle={toggle}
          setToggle={setToggle}
          disabled={withdrawFrom === "PDA Assets"}
          {...register("amount")}
          errorMessage={`${errors.amount?.message || ""}`}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={
              withdrawFrom === "Zebec Assets" ? walletTokens : pdaTokens
            }
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>

        {showMaxInfo && (
          <div className="mt-2 text-caption text-content-tertiary flex items-center gap-x-1">
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
          disabled={loading || withdrawFrom === "PDA Assets"}
          loading={loading}
        />
      </form>
    </div>
  )
}

export default WithdrawTab
