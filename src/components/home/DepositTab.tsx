/* eslint-disable @typescript-eslint/no-unused-vars */
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
  SOL_TOKEN_BRIDGE_ADDRESS,
  transferEvm,
  WORMHOLE_RPC_HOSTS,
  ZebecEthBridgeClient
} from "@jettxcypher/zebec-wormhole-sdk"
import { connection } from "constants/cluster"

import {
  getForeignAssetSolana,
  getOriginalAssetEth,
  toChainName,
  tryUint8ArrayToNative,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  getIsTransferCompletedSolana
} from "@certusone/wormhole-sdk"
// import axios from "axios"
import { toast } from "features/toasts/toastsSlice"
import { ethers } from "ethers"
import axios from "axios"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import {
  switchxWalletApprovalMessageStep,
  togglexWalletApprovalMessageModal
} from "features/modals/xWalletApprovalMessageSlice"
import { CheveronDownIcon } from "assets/icons"
import { useClickOutside } from "hooks"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

const DepositTab: FC = () => {
  const { t } = useTranslation()
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const { data: signer } = useSigner()

  const tokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter(
      (token) => token.chainId === walletObject.chainId
    )
  )

  const walletTokens =
    useAppSelector((state) => state.walletBalance.tokens) || []
  const solanaTokenDetails = useAppSelector((state) =>
    state.tokenDetails.tokens.filter((token) => token.chainId === "solana")
  )
  const pdaTokens = useAppSelector((state) => state.pdaBalance.tokens) || []

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
    const balance =
      getBalance(
        depositFrom === "PDA Assets" ? pdaTokens : walletTokens,
        currentToken.symbol
      ) - constants.DEPOSIT_MAX_OFFSET
    setValue("amount", balance > 0 ? balance.toString() : "0")
    trigger("amount")
  }

  const depositCallback = () => {
    reset()
    setTimeout(() => {
      dispatch(fetchZebecBalance(walletObject.publicKey?.toString()))
      dispatch(
        fetchWalletBalance({
          publicKey: walletObject.originalAddress,
          chainId: walletObject.chainId,
          signer: walletObject.chainId === "solana" && signer
        })
      )
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
      console.log("depositData", depositData)
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
        dispatch(switchxWalletApprovalMessageStep(0))
        dispatch(togglexWalletApprovalMessageModal())
        // dispatch(toggleWalletApprovalMessageModal())
        setLoading(true)
        const sourceChain = getEVMToWormholeChain(walletObject.chainId)
        const targetChain = 1
        const tokenAddress = currentToken.mint
        const recipientAddress = walletObject.publicKey?.toString() as string
        console.log("sourceChain", sourceChain)
        // find out target token address in solana
        let targetTokenAddress: string
        console.log(
          "token bridge address",
          sourceChain,
          getTokenBridgeAddressForChain(sourceChain)
        )
        const originAssetInfo = await getOriginalAssetEth(
          getTokenBridgeAddressForChain(sourceChain),
          signer,
          tokenAddress,
          sourceChain
        )
        console.log("originAssetInfo", originAssetInfo)
        if (originAssetInfo.chainId === targetChain) {
          targetTokenAddress = tryUint8ArrayToNative(
            originAssetInfo.assetAddress,
            toChainName(targetChain)
          )
        } else {
          const foreignAsset = await getForeignAssetSolana(
            connection,
            SOL_TOKEN_BRIDGE_ADDRESS,
            originAssetInfo.chainId,
            originAssetInfo.assetAddress
          )
          if (!foreignAsset) {
            throw new Error("Token is not attested in solana")
          }
          targetTokenAddress = foreignAsset
        }

        // Create token account if doesn't exist
        console.log("targetTokenAddress", targetTokenAddress)
        const { data: response } = await axios.post(
          "/api/create-token-account",
          {
            recipientAddress,
            targetTokenAddress
          }
        )
        if (!response.success) {
          console.log("Error creating token account")
          return
        }

        const recipientTokenAddress = await getAssociatedTokenAddress(
          new PublicKey(targetTokenAddress),
          new PublicKey(recipientAddress),
          true
        )
        console.log("recipientAddress", recipientAddress)
        console.log("recipientTokenAddress", recipientTokenAddress.toBase58())

        console.log(
          "signer",
          signer,
          currentToken.mint,
          sourceChain,
          data.amount,
          targetChain,
          recipientAddress
        )
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
            console.log("transferReceipt", transferReceipt)
            const sequence = parseSequenceFromLogEth(
              transferReceipt,
              getBridgeAddressForChain(sourceChain)
            )
            console.log(
              "sequence",
              sequence,
              getBridgeAddressForChain(sourceChain)
            )
            console.log("waiting for transfer complete")
            await new Promise((resolve) => setTimeout(resolve, 40000))
            console.log("transfer successful")
            dispatch(switchxWalletApprovalMessageStep(2))
            const messengerContract = new ZebecEthBridgeClient(
              BSC_ZEBEC_BRIDGE_ADDRESS,
              signer,
              sourceChain
            )
            const receipt = await messengerContract.depositToken(
              data.amount,
              walletObject.originalAddress?.toString() as string,
              targetTokenAddress
            )
            console.log("reciept", receipt)
            dispatch(switchxWalletApprovalMessageStep(3))
            await new Promise((resolve) => setTimeout(resolve, 1000))
            depositCallback()
            setLoading(false)
            dispatch(togglexWalletApprovalMessageModal())
            dispatch(toast.success({ message: "Deposit initiated" }))
            // dispatch(toggleWalletApprovalMessageModal())
          })
          .catch((err) => {
            console.log("error", err)
            dispatch(
              toast.error({
                message: "Error depositing token"
              })
            )
            setLoading(false)
            // dispatch(toggleWalletApprovalMessageModal())
            dispatch(togglexWalletApprovalMessageModal())
          })
      } catch (e) {
        console.log("error", e)
        dispatch(
          toast.error({
            message: "Error depositing token"
          })
        )
        setLoading(false)
        // dispatch(toggleWalletApprovalMessageModal())
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
      const reciept = await messengerContract.depositToken(
        data.amount,
        walletObject.originalAddress?.toString() as string,
        currentToken.mint
      )
      console.log("reciept", reciept)
      dispatch(toast.success({ message: "Deposit initiated" }))
      depositCallback()
      setLoading(false)
    } catch (e) {
      console.log(e)
      dispatch(
        toast.error({
          message: "Error deposit token"
        })
      )
      setLoading(false)
    }
  }

  const submit = (data: any) => {
    if (walletObject.chainId === "solana") {
      handleSolanaSubmit(data)
    } else {
      if (depositFrom === "Wallet Assets") {
        handleEvmSubmit(data)
      } else {
        handlePDADeposit(data)
      }
    }
  }

  // useEffect(() => {
  //   if (signer) {
  //     signer.provider
  //       ?.getTransactionReceipt(
  //         "0x90e7676393d9c6db6c554bc4ff0a147ca0f6b1e8094ca50aa7a6a326807e1ae5"
  //       )
  //       .then(async (receipt: any) => {
  //         console.log("receipt", receipt)
  //         const txs = await signer.provider?.getTransaction(
  //           "0x90e7676393d9c6db6c554bc4ff0a147ca0f6b1e8094ca50aa7a6a326807e1ae5"
  //         )
  //         const ABI = [
  //           "function transferTokens(address token, uint256 amount, uint16 recipientChain, bytes32 recipient, uint256 arbiterFee, uint32 nonce)"
  //         ]
  //         const iface = new ethers.utils.Interface(ABI)
  //         const parsedTxs = iface.parseTransaction({
  //           data: txs?.data as string
  //         })
  //         console.log("parsedTxs", parsedTxs.args)
  //         const tokenBridgeAddress = getTokenBridgeAddressForChain(4)
  //         const sequence = parseSequenceFromLogEth(
  //           receipt,
  //           getBridgeAddressForChain(4)
  //         )
  //         const emitterAddress = getEmitterAddressEth(tokenBridgeAddress)
  //         console.log("emitterAddress", emitterAddress)
  //         console.log("msgSequence", sequence)
  //         const { vaaBytes } = await getSignedVAAWithRetry(
  //           WORMHOLE_RPC_HOSTS,
  //           4,
  //           emitterAddress,
  //           sequence
  //         )
  //         console.log("vaaBytes", Buffer.from(vaaBytes).toString("base64"))
  //         const isTransferComplete = await getIsTransferCompletedSolana(
  //           SOL_TOKEN_BRIDGE_ADDRESS,
  //           vaaBytes,
  //           connection
  //         )
  //         console.log("isTransferComplete", isTransferComplete)
  //         if (!isTransferComplete) {
  //           const { data: response } = await axios.post(
  //             "http://localhost:4201/realyvaa",
  //             {
  //               vaa: Buffer.from(vaaBytes).toString("base64")
  //             }
  //           )
  //           if (response.message !== "Scheduled") {
  //             console.log("Not Scheduled")
  //             return
  //           }
  //         }
  //         const messengerContract = new ZebecMessengerClient(
  //           BSC_ZEBEC_BRIDGE_ADDRESS,
  //           signer,
  //           4
  //         )
  //         const reciept = await messengerContract.depositToken(
  //           "1.1",
  //           walletObject.originalAddress?.toString() as string,
  //           "So11111111111111111111111111111111111111112"
  //         )
  //         console.log("reciept", reciept)
  //       })
  //   }
  // }, [signer])

  useEffect(() => {
    if (walletObject.publicKey) {
      console.log("walletObject.publicKey", walletObject.publicKey.toBase58())
    }
  }, [walletObject.publicKey])

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
        <div className="relative" ref={dropdownWrapper}>
          <label className={`text-content-secondary text-xs font-medium mb-1`}>
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
        <WithdrawDepositInput
          className="mt-4"
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
