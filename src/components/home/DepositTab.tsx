/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { depositNative, depositToken } from "application"
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
import { useSigner } from "wagmi"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  transferEvm,
  WORMHOLE_RPC_HOSTS,
  ZebecEthBridgeClient,
  getTargetAsset,
  SOL_TOKEN_BRIDGE_ADDRESS
} from "zebec-wormhole-sdk-test"

import {
  getEmitterAddressEth,
  getIsTransferCompletedSolana,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  setDefaultWasm
} from "@certusone/wormhole-sdk"
import { toast } from "features/toasts/toastsSlice"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import {
  switchxWalletApprovalMessageStep,
  togglexWalletApprovalMessageModal,
  setXModalMessage,
  setXModalStepsList
} from "features/modals/xWalletApprovalMessageSlice"
import { CheveronDownIcon } from "assets/icons"
import { useClickOutside } from "hooks"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { checkRelayerStatus } from "api/services/pingRelayer"
import { connection } from "constants/cluster"
import { fetchPdaBalance } from "features/pdaBalance/pdaBalanceSlice"
import { checkPDAinitialized } from "utils/checkPDAinitialized"
import { setShowPdaInitialize } from "features/modals/pdaInitializeModalSlice"
import { checkTokenAccountCreated } from "utils/checkTokenAccountCreated"

const DepositTab: FC = () => {
  const { t } = useTranslation()
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const { data: signer } = useSigner()

  const tokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter(
      (token) =>
        token.chainId === walletObject.chainId &&
        token.network === walletObject.network
    )
  )

  const walletTokens = useAppSelector(
    (state) => state.walletBalance.tokens || []
  )

  const solanaTokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter(
      (token) =>
        token.chainId === "solana" && token.network === walletObject.network
    )
  )
  const pdaTokens = useAppSelector((state) => state.pdaBalance.tokens || [])

  const [loading, setLoading] = useState<boolean>(false)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [depositFrom, setDepositFrom] = useState("Wallet Assets")
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
    type: "deposit"
  })

  const setMaxAmount = () => {
    const balance = Number(
      (
        getBalance(
          depositFrom === "PDA Assets" ? pdaTokens : walletTokens,
          currentToken.symbol
        ) -
          (depositFrom === "Wallet Assets"
            ? constants.DEPOSIT_MAX_OFFSET
            : 0) || 0
      ).toFixed(6) || 0
    )
    setValue("amount", balance > 0 ? balance.toString() : "0")
    trigger("amount")
  }

  useEffect(() => {
    const balance = Number(
      (
        getBalance(
          depositFrom === "PDA Assets" ? pdaTokens : walletTokens,
          currentToken.symbol
        ) -
          (depositFrom === "Wallet Assets"
            ? constants.DEPOSIT_MAX_OFFSET
            : 0) || 0
      ).toFixed(6) || 0
    )
    setValue("balance", balance.toString())
  }, [currentToken, depositFrom, setValue, walletTokens, pdaTokens])

  const depositCallback = () => {
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
          publicKey: walletObject.originalAddress,
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
  const handleSolanaSubmit = (data: any) => {
    if (Number(data.amount) > getBalance(walletTokens, currentToken.symbol)) {
      setError(
        "amount",
        { type: "custom", message: "validation:deposit-max-amount" },
        { shouldFocus: true }
      )
      return
    } else {
      setLoading(true)
      const depositData = {
        sender: (walletObject.publicKey as PublicKey).toString(),
        amount: +data.amount,
        token_mint_address:
          currentToken.symbol === "SOL" ? "" : currentToken.mint
      }
      if (currentToken.symbol === "SOL")
        stream &&
          dispatch(
            depositNative(depositData, stream, setLoading, depositCallback)
          )
      else
        token &&
          dispatch(
            depositToken(depositData, token, setLoading, depositCallback)
          )
    }
  }

  const onApproved = () => {
    dispatch(switchxWalletApprovalMessageStep(1))
  }

  const handleEvmSubmit = async (data: any) => {
    if (signer) {
      try {
        // check if proxy pda is initialized
        const checkProxyPDA = await checkPDAinitialized(
          walletObject.publicKey?.toString() || ""
        )
        if (!checkProxyPDA) {
          dispatch(setShowPdaInitialize(true))
          setLoading(false)
          return
        }

        const sourceChain = getEVMToWormholeChain(walletObject.chainId)
        const targetChain = 1
        const tokenAddress = currentToken.mint
        const recipientAddress = walletObject.publicKey?.toString() as string

        // find out target token address in solana
        const targetTokenAddress = await getTargetAsset(
          signer,
          tokenAddress,
          sourceChain,
          targetChain
        )

        // check and create token account if doesn't exists
        const checkTokenAccount = await checkTokenAccountCreated(
          targetTokenAddress,
          recipientAddress
        )
        let steps = [
          {
            name: "Approve Deposit"
          },
          {
            name: "Transfer to PDA"
          },
          {
            name: "Transfer to Zebec Vault"
          }
        ]
        if (!checkTokenAccount) {
          steps = [
            {
              name: "Creating Token Account"
            },
            ...steps
          ]
        }
        dispatch(setXModalStepsList(steps))
        dispatch(
          setXModalMessage(
            "Please complete all steps to ensure successful deposit of funds to your zebec vault"
          )
        )
        let currentStep = 0
        dispatch(switchxWalletApprovalMessageStep(currentStep))
        dispatch(togglexWalletApprovalMessageModal())
        setLoading(true)

        // initialize messenger contract
        const messengerContract = new ZebecEthBridgeClient(
          BSC_ZEBEC_BRIDGE_ADDRESS,
          signer,
          sourceChain
        )

        if (!checkTokenAccount) {
          await messengerContract.createTokenAccount(
            walletObject.originalAddress?.toString() as string,
            targetTokenAddress
          )
          let retry = 0
          while (true) {
            const isCreated = await checkTokenAccountCreated(
              targetTokenAddress,
              recipientAddress
            )
            if (isCreated) {
              break
            }
            if (retry > 30) {
              dispatch(
                toast.error({
                  message: "Failed to create token account"
                })
              )
              setLoading(false)
              dispatch(togglexWalletApprovalMessageModal())
              return
            }
            await new Promise((resolve) => setTimeout(resolve, 4000))
            retry += 1
          }

          // step success
          currentStep += 1
          dispatch(switchxWalletApprovalMessageStep(currentStep))
        }
        transferEvm(
          signer,
          currentToken.mint,
          sourceChain,
          data.amount,
          targetChain,
          recipientAddress,
          "0.01",
          onApproved
        )
          .then(async (transferReceipt: any) => {
            const sequence = parseSequenceFromLogEth(
              transferReceipt,
              getBridgeAddressForChain(sourceChain)
            )
            const transferEmitterAddress = getEmitterAddressEth(
              getTokenBridgeAddressForChain(sourceChain)
            )
            console.debug("emitterAddress:", transferEmitterAddress)
            const { vaaBytes: transferVaa } = await getSignedVAAWithRetry(
              WORMHOLE_RPC_HOSTS,
              sourceChain,
              transferEmitterAddress,
              sequence
            )
            // check transfer complete
            let isTransferComplete = false
            let logMsg = "checking if transfer completed"
            let retry = 0
            setDefaultWasm("bundler")
            do {
              logMsg = logMsg.concat(".")
              if (retry > 12) throw new Error("Deposit Timeout")
              retry++
              isTransferComplete = await getIsTransferCompletedSolana(
                SOL_TOKEN_BRIDGE_ADDRESS,
                transferVaa,
                connection
              )
              await new Promise((r) => setTimeout(r, 5000))
            } while (!isTransferComplete)
            currentStep += 1
            dispatch(switchxWalletApprovalMessageStep(currentStep))
            const receipt = await messengerContract.deposit(
              data.amount,
              walletObject.originalAddress?.toString() as string,
              targetTokenAddress
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
              BSC_ZEBEC_BRIDGE_ADDRESS,
              sourceChain
            )
            if (response === "success") {
              currentStep += 1
              dispatch(switchxWalletApprovalMessageStep(currentStep))
              await new Promise((resolve) => setTimeout(resolve, 1000))
              dispatch(toast.success({ message: "Deposit completed" }))
            } else {
              dispatch(toast.error({ message: "Deposit failed" }))
            }
            depositCallback()
            setLoading(false)
            dispatch(togglexWalletApprovalMessageModal())
          })
          .catch(() => {
            dispatch(
              toast.error({
                message: "Error depositing token"
              })
            )
            setLoading(false)
            dispatch(togglexWalletApprovalMessageModal())
          })
      } catch (e) {
        dispatch(
          toast.error({
            message: "Error depositing token"
          })
        )
        setLoading(false)
        dispatch(togglexWalletApprovalMessageModal())
      }
    }
  }

  const handlePDADeposit = async (data: any) => {
    try {
      if (!signer) return
      setLoading(true)
      const sourceChain = getEVMToWormholeChain(walletObject.chainId)

      const messengerContract = new ZebecEthBridgeClient(
        BSC_ZEBEC_BRIDGE_ADDRESS,
        signer,
        sourceChain
      )
      const receipt = await messengerContract.deposit(
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
        BSC_ZEBEC_BRIDGE_ADDRESS,
        sourceChain
      )
      if (response === "success") {
        dispatch(toast.success({ message: "Deposit completed" }))
      } else if (response === "timeout") {
        dispatch(toast.error({ message: "Deposit timeout" }))
      } else {
        dispatch(toast.error({ message: "Error Deposit token" }))
      }
      depositCallback()
      setLoading(false)
    } catch (e) {
      dispatch(
        toast.error({
          message: "Error deposit token"
        })
      )
      setLoading(false)
    }
  }

  const submit = async (data: any) => {
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
      if (depositFrom === "Wallet Assets") {
        handleEvmSubmit(data)
      } else {
        handlePDADeposit(data)
      }
    }
  }

  useClickOutside(dropdownWrapper, {
    onClickOutside: () => {
      setToggleDropdown(false)
    }
  })

  return (
    <div className="deposit-to-zebec-wallet px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.deposit-title")}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col"
        autoComplete="off"
      >
        {walletObject.chainId !== "solana" && (
          <div className="relative" ref={dropdownWrapper}>
            <label
              className={`text-content-secondary text-xs font-medium mb-1`}
            >
              Deposit From
            </label>
            <div
              onClick={() => setToggleDropdown(!toggleDropdown)}
              className="cursor-pointer relative text-content-primary"
            >
              <input
                type="text"
                value={depositFrom}
                className={`cursor-pointer h-[40px] w-full !pr-12`}
                readOnly
              />
              <CheveronDownIcon className="absolute w-6 h-6 top-2 right-4" />
            </div>
            <CollapseDropdown
              show={toggleDropdown}
              className="mt-8 w-full z-[99]"
              position="left"
            >
              <div className="bg-background-primary border border-outline rounded-lg divide-y divide-outline max-h-[206px] overflow-auto">
                {["Wallet Assets", "PDA Assets"].map((item) => (
                  <div
                    className="text-content-primary text-sm font-medium px-4 py-3 cursor-pointer hover:bg-background-light"
                    key={item}
                    onClick={() => {
                      setDepositFrom(item)
                      setToggleDropdown(false)
                      if (item === "PDA Assets") {
                        setCurrentToken(solanaTokenDetails[0])
                      } else {
                        setCurrentToken(tokenDetails[0])
                      }
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
          className={walletObject.chainId !== "solana" ? "mt-4" : ""}
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message || ""}`}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown
            walletTokens={
              depositFrom === "PDA Assets" ? pdaTokens : walletTokens
            }
            tokens={
              depositFrom === "PDA Assets" ? solanaTokenDetails : tokenDetails
            }
            show={show}
            toggleShow={setToggle}
            setCurrentToken={setCurrentToken}
          />
        </WithdrawDepositInput>
        <Button
          title={`${t("common:buttons.deposit")}`}
          variant="gradient"
          className="w-full mt-6"
          disabled={loading}
          loading={loading}
        />
      </form>
    </div>
  )
}

export default DepositTab
