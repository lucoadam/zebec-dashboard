/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey } from "@solana/web3.js"
import { useAppDispatch, useAppSelector } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { depositNative, depositToken } from "application"
import { Button, TokensDropdown, WithdrawDepositInput } from "components/shared"
import { constants } from "constants/constants"
import { fetchWalletBalance } from "features/walletBalance/walletBalanceSlice"
import { fetchZebecBalance } from "features/zebecBalance/zebecBalanceSlice"
import { useWithdrawDepositForm } from "hooks/shared/useWithdrawDepositForm"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import { FC, useContext, useEffect, useState } from "react"
import { getBalance } from "utils/getBalance"
import { useSigner } from "wagmi"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  SOL_TOKEN_BRIDGE_ADDRESS,
  transferEvm,
  WORMHOLE_RPC_HOSTS,
  ZebecMessengerClient
} from "@zebec-io/zebec-wormhole-sdk"
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

  const [loading, setLoading] = useState<boolean>(false)
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
      constants.DEPOSIT_MAX_OFFSET
    setValue("amount", balance > 0 ? balance : 0)
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

  const handleEvmSubmit = async (data: any) => {
    if (signer) {
      const sourceChain = 4
      const targetChain = 1
      const tokenAddress = currentToken.mint
      const recipientAddress = walletObject.publicKey?.toString() as string
      console.log("recipientAddress", recipientAddress)

      // find out target token address in solana
      let targetTokenAddress: string
      const originAssetInfo = await getOriginalAssetEth(
        getTokenBridgeAddressForChain(sourceChain),
        signer,
        tokenAddress,
        sourceChain
      )
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
      // const { data: response } = await axios.post(
      //   "http://localhost:3000/api/create-token-account",
      //   {
      //     recipientAddress,
      //     targetTokenAddress
      //   }
      // )
      // if (!response.success) {
      //   console.log("Error creating token account")
      //   return
      // }
      transferEvm(
        signer,
        currentToken.mint,
        4,
        data.amount,
        1,
        recipientAddress,
        "0.1"
      )
        .then(async (vaa: any) => {
          console.log("vaa", vaa)
          const messengerContract = new ZebecMessengerClient(
            BSC_ZEBEC_BRIDGE_ADDRESS,
            signer,
            4
          )
          const reciept = await messengerContract.depositToken(
            data.amount,
            walletObject.originalAddress?.toString() as string,
            targetTokenAddress
          )
          console.log("reciept", reciept)
          dispatch(toast.success({ message: "Deposit successful" }))
          reset()
        })
        .catch(() => {
          dispatch(
            toast.error({
              message: "Error depositing token"
            })
          )
        })
    }
  }

  const submit = (data: any) => {
    if (walletObject.chainId === "solana") {
      handleSolanaSubmit(data)
    } else {
      handleEvmSubmit(data)
    }
  }

  // useEffect(() => {
  //   if (signer) {
  //     signer.provider
  //       ?.getTransactionReceipt(
  //         "0xa4e15ae6b94b68d67857bcfb3f01f656ab47860bb5d58a1e424e72a86e13f0d7"
  //       )
  //       .then(async (receipt: any) => {
  //         console.log("receipt", receipt)
  //         const txs = await signer.provider?.getTransaction(
  //           "0xa4e15ae6b94b68d67857bcfb3f01f656ab47860bb5d58a1e424e72a86e13f0d7"
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

  //         const isTransferComplete = await getIsTransferCompletedSolana(
  //           SOL_TOKEN_BRIDGE_ADDRESS,
  //           vaaBytes,
  //           connection
  //         )
  //         console.log("isTransferComplete", isTransferComplete)
  //       })
  //   }
  // }, [signer])

  return (
    <div className="deposit-to-zebec-wallet px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        {t("common:deposit-withdrawal.deposit-title")}
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-y-6"
        autoComplete="off"
      >
        <WithdrawDepositInput
          token={currentToken}
          setMaxAmount={setMaxAmount}
          toggle={toggle}
          setToggle={setToggle}
          {...register("amount")}
          errorMessage={`${errors.amount?.message?.toString() || ""}`}
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
        <Button
          title={`${t("common:buttons.deposit")}`}
          variant="gradient"
          className="w-full"
          disabled={loading}
          loading={loading}
        />
      </form>
    </div>
  )
}

export default DepositTab
