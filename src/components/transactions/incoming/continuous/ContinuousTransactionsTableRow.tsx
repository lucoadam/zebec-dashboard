/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth
} from "@certusone/wormhole-sdk"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  getBridgeAddressForChain,
  WORMHOLE_RPC_HOSTS,
  ZebecEthBridgeClient
} from "zebec-wormhole-sdk-test"
import { listenWormholeTransactionStatus } from "api/services/fetchEVMTransactionStatus"
import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  FormatCurrency,
  IconButton,
  UserAddress,
  ViewReferenceFile
} from "components/shared"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { toast } from "features/toasts/toastsSlice"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useContext, useEffect, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { useSigner } from "wagmi"
import { formatDateTime, toSubstring } from "utils"
import {
  StatusType,
  TransactionStatusType
} from "components/transactions/transactions.d"
import CopyButton from "components/shared/CopyButton"
import { withdrawIncomingToken } from "application"
import ZebecContext from "app/zebecContext"
import { checkRelayerStatus } from "api/services/pingRelayer"
import { getExplorerUrl } from "constants/explorers"
import { checkPDAinitialized } from "utils/checkPDAinitialized"
import { setShowPdaInitialize } from "features/modals/pdaInitializeModalSlice"
import { toggleWalletApprovalMessageModal } from "features/modals/walletApprovalMessageSlice"
import { fetchIncomingTransactionsById } from "features/transactions/transactionsSlice"

interface ContinuousTransactionsTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const ContinuousTransactionsTableRow: FC<
  ContinuousTransactionsTableRowProps
> = ({ index, transaction, activeDetailsRow, handleToggleRow }) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const zebecCtx = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const walletObject = useZebecWallet()
  const [loading, setLoading] = useState(false)
  const { explorer } = useAppSelector((state) => state.settings)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }

  const {
    uuid,
    name,
    remarks,
    amount,
    token,
    token_mint_address,
    sender,
    receiver,
    start_time,
    end_time,
    pda,
    transaction_hash,
    file,
    latest_transaction_event,
    withdrawable,
    senderEvm,
    receiverEvm
  } = transaction

  const totalTransactionAmount =
    amount - Number(latest_transaction_event.paused_amt)

  const totalTimeInSec = end_time - start_time
  const streamRatePerSec = amount / totalTimeInSec

  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000)
  const [streamedToken, setStreamedToken] = useState<number>(0)
  const [status, setStatus] = useState<TransactionStatusType>(
    transaction.status
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevCurrentTime) => prevCurrentTime + 1)
    }, 1000)
    if (
      status === StatusType.COMPLETED ||
      status === StatusType.CANCELLED ||
      currentTime > end_time
    ) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [currentTime, status])

  useEffect(() => {
    if (
      transaction.status !== StatusType.CANCELLED &&
      transaction.status !== StatusType.PAUSED
    ) {
      if (currentTime < start_time) {
        setStatus(StatusType.SCHEDULED)
      } else if (currentTime >= start_time && currentTime < end_time) {
        setStatus(StatusType.ONGOING)
      } else if (currentTime >= end_time) {
        setStatus(StatusType.COMPLETED)
      }
    } else {
      setStatus(transaction.status)
    }
    // eslint-disable-next-line
  }, [status, currentTime, transaction])

  useEffect(() => {
    if (status === StatusType.COMPLETED) {
      setStreamedToken(amount - Number(latest_transaction_event.paused_amt))
    } else if (status === StatusType.ONGOING) {
      setStreamedToken(
        latest_transaction_event.paused_amt
          ? streamRatePerSec * (currentTime - start_time) -
              Number(latest_transaction_event.paused_amt)
          : streamRatePerSec * (currentTime - start_time)
      )
      const interval = setInterval(() => {
        setStreamedToken((prevStreamedToken: number) =>
          prevStreamedToken + streamRatePerSec > amount
            ? amount
            : prevStreamedToken + streamRatePerSec
        )
      }, 1000)
      return () => clearInterval(interval)
    } else if (status === StatusType.CANCELLED) {
      setStreamedToken(Number(latest_transaction_event.withdrawn))
    } else if (status === StatusType.PAUSED) {
      setStreamedToken(
        Number(latest_transaction_event.withdraw_limit) -
          Number(latest_transaction_event.paused_amt)
      )
    }

    // eslint-disable-next-line
  }, [status, transaction])

  const handleSolanaWithdraw = () => {
    if (zebecCtx.stream && zebecCtx.token) {
      setLoading(true)
      const withdrawData = {
        data: {
          sender: sender,
          receiver: receiver,
          escrow: pda,
          token_mint_address: token_mint_address,
          transaction_kind: "continuous",
          transaction_uuid: uuid,
          hasTransactionEnd: currentTime > end_time ? true : false
        },
        stream: token_mint_address ? zebecCtx.token : zebecCtx.stream
      }
      dispatch(toggleWalletApprovalMessageModal())
      dispatch(withdrawIncomingToken(withdrawData))
      setLoading(false)
    }
  }

  const handleEVMWithdraw = async () => {
    try {
      if (!signer) return
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
      const sourceChain = getEVMToWormholeChain(walletObject.chainId)

      // Initialize PDA
      const check = await checkPDAinitialized(
        walletObject.publicKey?.toString() || ""
      )
      if (!check) {
        dispatch(setShowPdaInitialize(true))
        setLoading(false)
        return
      }

      const messengerContract = new ZebecEthBridgeClient(
        BSC_ZEBEC_BRIDGE_ADDRESS,
        signer,
        sourceChain
      )

      const receipt = await messengerContract.withdrawStreamed(
        transaction.senderEvm,
        transaction.receiverEvm,
        transaction.token_mint_address,
        transaction.pda
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
        dispatch(toast.success({ message: "Stream withdrawal completed" }))
        dispatch(fetchIncomingTransactionsById({ uuid }))
      } else if (response === "timeout") {
        dispatch(toast.error({ message: "Stream withdrawal timeout" }))
      } else {
        dispatch(toast.error({ message: "Stream withdrawal failed" }))
      }
      setLoading(false)
    } catch (e: any) {
      console.debug("withdraw stream error", e)
      setLoading(false)
      dispatch(
        toast.error({
          message: "Stream withdrawal failed"
        })
      )
    }
  }
  const withdraw = () => {
    if (walletObject.chainId === "solana") {
      handleSolanaWithdraw()
    } else {
      handleEVMWithdraw()
    }
  }

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-85">
            <div className="flex items-center gap-x-2.5">
              <CircularProgress
                status={status}
                percentage={(streamedToken * 100) / totalTransactionAmount}
              />
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    +<FormatCurrency amount={streamedToken} fix={4} />
                  </span>
                  &nbsp;{token}
                </div>
                <div className="text-caption">
                  <FormatCurrency amount={streamedToken} fix={4} />{" "}
                  {t("table.of")}{" "}
                  <FormatCurrency amount={totalTransactionAmount} fix={4} />{" "}
                  {token}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 min-w-60">
            <div className="text-caption text-content-primary">
              {formatDateTime(start_time)}
              <br />
              {t("table.to")} {formatDateTime(end_time)}
            </div>
          </td>
          <td className="px-6 py-4 min-w-60">
            <UserAddress wallet={senderEvm || sender} />
          </td>
          <td className="px-6 py-4 w-full">
            <div className="flex items-center justify-end float-right gap-x-6">
              {status !== StatusType.SCHEDULED &&
                status !== StatusType.CANCELLED &&
                withdrawable && (
                  <Button
                    size="small"
                    title="Withdraw"
                    startIcon={
                      <Icons.ArrowUpRightIcon className="text-content-contrast" />
                    }
                    onClick={withdraw}
                    loading={loading}
                  />
                )}
              <IconButton
                variant="plain"
                icon={<Icons.CheveronDownIcon />}
                onClick={handleToggleRow}
              />
            </div>
          </td>
        </tr>
        {/* Table Body Details Row */}

        <tr>
          <td colSpan={4}>
            <div
              ref={detailsRowRef}
              className={`bg-background-light rounded-lg overflow-hidden transition-all duration-[400ms] ${
                activeDetailsRow === index ? `ease-in ` : "ease-out"
              }`}
              style={styles.detailsRow}
            >
              <div className="pt-4 pr-12 pb-6 pl-6">
                <div className="flex flex-col gap-y-2 pb-6 border-b border-outline">
                  <div className=" text-subtitle-sm font-medium text-content-primary">
                    {name}
                  </div>
                  {remarks && (
                    <div className="text-body text-content-secondary">
                      {remarks}
                    </div>
                  )}
                </div>
                <div className="flex gap-x-44 pt-6 text-subtitle-sm font-medium">
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Sender */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.sender")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar1}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div data-tip={senderEvm || sender} className="">
                          {toSubstring(senderEvm || sender, 5, true)}
                        </div>
                        <CopyButton content={senderEvm || sender} />
                      </div>
                    </div>
                    {/* Receiver */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.receiver")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Image
                          layout="fixed"
                          alt="Sender Logo"
                          src={Images.Avatar3}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="" data-tip={receiverEvm || receiver}>
                          {toSubstring(receiverEvm || receiver, 5, true)}
                        </div>
                        <CopyButton content={receiverEvm || receiver} />
                      </div>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.start-date")}
                      </div>
                      <div className="text-content-primary">
                        {formatDateTime(start_time)}
                      </div>
                    </div>
                    {/* End Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.end-date")}
                      </div>
                      <div className="text-content-primary">
                        {formatDateTime(end_time)}
                      </div>
                    </div>
                    {/* Stream Type */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.stream-type")}
                      </div>
                      <div className="flex items-center gap-x-1 text-content-primary">
                        <Icons.ThunderIcon className="w-6 h-6" />
                        <span className="capitalize">Continuous</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Streamed Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.streamed-amount")}
                      </div>
                      <div className="text-content-primary">
                        <FormatCurrency amount={amount} fix={4} /> {token}
                      </div>
                    </div>
                    {/* Paused Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.paused-amount")}
                      </div>
                      <div className="text-content-primary">
                        <FormatCurrency
                          amount={latest_transaction_event.paused_amt}
                          fix={4}
                        />{" "}
                        {token}
                      </div>
                    </div>
                    {/* Total Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.total-amount")}
                      </div>
                      <div className="text-content-primary">
                        <FormatCurrency
                          amount={totalTransactionAmount}
                          fix={4}
                        />{" "}
                        {token}
                      </div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        <FormatCurrency amount={streamedToken} fix={4} />{" "}
                        {token} (
                        <FormatCurrency
                          amount={
                            (streamedToken * 100) / totalTransactionAmount
                          }
                          showTooltip={false}
                        />
                        %)
                      </div>
                    </div>
                    {/* Withdrawn Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.withdrawn")}
                      </div>
                      <div className="text-content-primary">
                        <FormatCurrency
                          amount={latest_transaction_event.withdrawn}
                          fix={4}
                        />{" "}
                        {token}
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.status")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary capitalize">
                        <Icons.IncomingIcon className="w-5 h-5" />
                        <span>{status}</span>
                      </div>
                    </div>
                    {/* Transaction */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.transaction")}
                      </div>
                      <div className="text-content-primary">
                        <a
                          href={getExplorerUrl(explorer, transaction_hash)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            title={`${t("table.view-on-explorer")}`}
                            size="small"
                            endIcon={
                              <Icons.OutsideLinkIcon className="text-content-contrast" />
                            }
                          />
                        </a>
                      </div>
                    </div>
                    {/* Reference */}
                    {file && (
                      <div className="flex items-center gap-x-8">
                        <div className="w-32 text-content-secondary">
                          {t("table.reference")}
                        </div>
                        <ViewReferenceFile file={file} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Fragment>
    </>
  )
}

export default ContinuousTransactionsTableRow
