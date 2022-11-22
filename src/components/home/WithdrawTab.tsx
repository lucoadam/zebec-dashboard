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
import { FC, useContext, useEffect, useRef, useState } from "react"
import { getBalance } from "utils/getBalance"
import * as Icons from "assets/icons"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"

import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  getBridgeAddressForChain,
  WORMHOLE_RPC_HOSTS,
  ZebecEthBridgeClient
} from "@zebec-protocol/wormhole-bridge"
import { toast } from "features/toasts/toastsSlice"
import {
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth
} from "@certusone/wormhole-sdk"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { useClickOutside } from "hooks"
import { checkRelayerStatus } from "api/services/pingRelayer"
import {
  setXModalMessage,
  setXModalStepsList,
  switchxWalletApprovalMessageStep,
  togglexWalletApprovalMessageModal
} from "features/modals/xWalletApprovalMessageSlice"
import { fetchPdaBalance } from "features/pdaBalance/pdaBalanceSlice"
// import axios from "axios"

const WithdrawTab: FC = () => {
  const { t } = useTranslation()
  const { stream, token } = useContext(ZebecContext)
  const walletObject = useZebecWallet()
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const tokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter(
      (token) =>
        token.chainId === "solana" && token.network === walletObject.network
    )
  )
  const walletTokens = useAppSelector(
    (state) => state.zebecBalance.tokens || []
  )
  const streamingTokens = useAppSelector(
    (state) => state.zebecStreamingBalance.tokens || []
  )
  const pdaTokens = useAppSelector((state) => state.pdaBalance.tokens || [])

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

  const calculateTokenAvailableBalance = () => {
    const walletTokenBalance = getBalance(
      withdrawFrom === "Solana Assets" ? pdaTokens : walletTokens,
      currentToken.symbol
    )
    const streamingTokenBalance = getBalance(
      streamingTokens,
      currentToken.symbol
    )

    if (streamingTokenBalance > 0) {
      setShowMaxInfo(true)
    } else {
      setShowMaxInfo(false)
    }

    return walletTokenBalance - streamingTokenBalance
  }

  const setMaxAmount = () => {
    const balance = calculateTokenAvailableBalance()

    setValue("amount", balance < 0 ? "0" : balance.toString())
    trigger("amount")
  }

  useEffect(() => {
    const walletTokenBalance = getBalance(
      withdrawFrom === "Solana Assets" ? pdaTokens : walletTokens,
      currentToken.symbol
    )
    const streamingTokenBalance = getBalance(
      streamingTokens,
      currentToken.symbol
    )
    const balance = walletTokenBalance - streamingTokenBalance
    setValue("balance", balance.toString())
  }, [
    currentToken,
    walletTokens,
    streamingTokens,
    pdaTokens,
    setValue,
    withdrawFrom
  ])

  const withdrawCallback = () => {
    reset()
    setTimeout(() => {
      dispatch(
        fetchZebecBalance({
          publicKey: walletObject.publicKey?.toString(),
          network: walletObject.network
        })
      )
      dispatch(
        fetchWalletBalance({
          publicKey: walletObject.originalAddress?.toString(),
          chainId: walletObject.chainId,
          network: walletObject.network,
          signer: walletObject.chainId !== "solana" && signer
        })
      )
      if (walletObject.chainId !== "solana") {
        dispatch(
          fetchPdaBalance({
            publicKey: walletObject.publicKey?.toString(),
            network: walletObject.network
          })
        )
      }
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
        dispatch(
          setXModalStepsList([
            {
              name: "Withdraw from Zebec Assets"
            },
            {
              name: "Withdraw from Solana Assets"
            }
          ])
        )
        dispatch(
          setXModalMessage(
            "Please complete all steps to ensure successful withdrawal of funds from Zebec assets."
          )
        )
        dispatch(switchxWalletApprovalMessageStep(0))
        dispatch(togglexWalletApprovalMessageModal())
        const sourceChain = getEVMToWormholeChain(walletObject.chainId)

        const messengerContract = new ZebecEthBridgeClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )
        const receipt = await messengerContract.withdraw(
          data.amount,
          walletObject.originalAddress?.toString() as string,
          currentToken.mint
        )
        const msgSequence = parseSequenceFromLogEth(
          receipt,
          getBridgeAddressForChain(sourceChain)
        )
        const messageEmitterAddress = getEmitterAddressEth(
          BSC_ZEBEC_BRIDGE_ADDRESS
        )
        const { vaaBytes: signedVaa } = await getSignedVAAWithRetry(
          WORMHOLE_RPC_HOSTS,
          sourceChain,
          messageEmitterAddress,
          msgSequence
        )

        // check if message is relayed
        const response = await listenWormholeTransactionStatus(
          signedVaa,
          walletObject.originalAddress?.toString() as string,
          sourceChain
        )

        if (response === "success") {
          dispatch(switchxWalletApprovalMessageStep(1))
          let receipt
          try {
            receipt = await messengerContract.directTransfer(
              data.amount,
              walletObject.originalAddress?.toString() as string,
              currentToken.mint,
              walletObject.originalAddress?.toString() as string
            )
          } catch (e) {
            console.debug("withdraw error", e)
            withdrawCallback()
            dispatch(
              toast.success({ message: "Token withdrawn into pda only" })
            )
            setLoading(false)
            dispatch(togglexWalletApprovalMessageModal())
            return
          }
          const msgSequence = parseSequenceFromLogEth(
            receipt,
            getBridgeAddressForChain(sourceChain)
          )
          const messageEmitterAddress = getEmitterAddressEth(
            BSC_ZEBEC_BRIDGE_ADDRESS
          )
          const { vaaBytes: signedVaa } = await getSignedVAAWithRetry(
            WORMHOLE_RPC_HOSTS,
            sourceChain,
            messageEmitterAddress,
            msgSequence
          )

          // check if message is relayed
          const response = await listenWormholeTransactionStatus(
            signedVaa,
            walletObject.originalAddress?.toString() as string,
            sourceChain
          )
          if (response === "success") {
            withdrawCallback()
            dispatch(switchxWalletApprovalMessageStep(2))
            await new Promise((resolve) => setTimeout(resolve, 1000))
            dispatch(toast.success({ message: "Withdrawal completed" }))
          } else if (response === "timeout") {
            withdrawCallback()
            dispatch(
              toast.success({ message: "Token withdrawn into pda only" })
            )
          } else {
            dispatch(toast.error({ message: "Error withdrawing token" }))
          }
        } else if (response === "timeout") {
          dispatch(toast.error({ message: "Withdrawal timeout" }))
        } else {
          dispatch(toast.error({ message: "Error withdrawing token" }))
        }
        dispatch(togglexWalletApprovalMessageModal())
      } catch (e) {
        console.debug("withdraw error", e)
        dispatch(togglexWalletApprovalMessageModal())
        dispatch(toast.error({ message: "Error withdrawing token" }))
      }
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePdaWithdraw = async (data: any) => {
    try {
      if (signer) {
        setLoading(true)
        const sourceChain = getEVMToWormholeChain(walletObject.chainId)

        const messengerContract = new ZebecEthBridgeClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )
        const receipt = await messengerContract.directTransfer(
          data.amount,
          walletObject.originalAddress?.toString() as string,
          currentToken.mint,
          walletObject.originalAddress?.toString() as string
        )

        const msgSequence = parseSequenceFromLogEth(
          receipt,
          getBridgeAddressForChain(sourceChain)
        )
        const messageEmitterAddress = getEmitterAddressEth(
          BSC_ZEBEC_BRIDGE_ADDRESS
        )
        const { vaaBytes: signedVaa } = await getSignedVAAWithRetry(
          WORMHOLE_RPC_HOSTS,
          sourceChain,
          messageEmitterAddress,
          msgSequence
        )

        // check if message is relayed
        const response = await listenWormholeTransactionStatus(
          signedVaa,
          walletObject.originalAddress?.toString() as string,
          sourceChain
        )
        if (response === "success") {
          withdrawCallback()
          dispatch(toast.success({ message: "Withdrawal completed" }))
        } else if (response === "timeout") {
          dispatch(toast.error({ message: "Withdraw timeout" }))
        } else {
          dispatch(toast.error({ message: "Withdraw failed" }))
        }
        setLoading(false)
      }
    } catch (e) {
      console.debug("withdraw error", e)
      setLoading(false)
      dispatch(toast.error({ message: "Error withdrawing token" }))
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = async (data: any) => {
    const balance = calculateTokenAvailableBalance()
    if (Number(data.amount) > balance) {
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
        {withdrawFrom === "Zebec Assets"
          ? t("common:deposit-withdrawal.withdraw-title")
          : t("common:deposit-withdrawal.withdraw-title-solana-assets")}
      </div>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        {walletObject.chainId !== "solana" && (
          <div className="relative" ref={dropdownWrapper}>
            <label
              className={`text-content-secondary text-xs font-medium mb-1`}
            >
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
                {["Zebec Assets", "Solana Assets"].map((item) => (
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
        )}
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          className={walletObject.chainId !== "solana" ? "mt-4" : ""}
          toggle={toggle}
          setToggle={setToggle}
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
            <span>{t("common:deposit-withdrawal.max-withdraw-message")}</span>
          </div>
        )}

        <Button
          title={`${t("common:buttons.withdraw")}`}
          variant="gradient"
          className="w-full mt-6"
          loading={loading}
        />
      </form>
    </div>
  )
}

export default WithdrawTab
