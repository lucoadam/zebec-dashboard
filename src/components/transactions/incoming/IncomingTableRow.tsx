import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@jettxcypher/zebec-wormhole-sdk"
import { useAppDispatch } from "app/hooks"
import ZebecContext from "app/zebecContext"
import { withdrawIncomingToken } from "application"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  IconButton,
  // Modal,
  UserAddress
} from "components/shared"
import CopyButton from "components/shared/CopyButton"
import { RPC_NETWORK } from "constants/cluster"
import { getEVMToWormholeChain } from "constants/wormholeChains"
import { useZebecWallet } from "hooks/useWallet"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import { formatCurrency, formatDateTime, toSubstring } from "utils"
import { useSigner } from "wagmi"
import { StatusType, TransactionStatusType } from "../transactions.d"
// import { WithdrawStepsList } from "../withdraw/data.d"

interface IncomingTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const IncomingTableRow: FC<IncomingTableRowProps> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const zebecCtx = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const { data: signer } = useSigner()
  const walletObject = useZebecWallet()

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }

  // const [currentStep, setCurrentStep] = React.useState(-1)
  // const [isOpen, setIsOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [withdrawAmount, setWithdrawAmount] = useState<any>()
  // const [escrowData, setEscrowData] = useState<any>([])
  // const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false)

  // const fees = 0.25

  const {
    name,
    remarks,
    amount,
    token,
    token_mint_address,
    sender,
    receiver,
    start_time,
    end_time,
    transaction_type,
    pda,
    transaction_hash,
    file,
    latest_transaction_event
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
    } else if (
      status === StatusType.CANCELLED ||
      status === StatusType.PAUSED
    ) {
      setStreamedToken(
        Number(latest_transaction_event.withdrawn) +
          Number(latest_transaction_event.withdraw_limit)
      )
    }
    // eslint-disable-next-line
  }, [status, transaction])

  // Toggle Modal
  // const toggleModal = () => {
  //   setIsOpen(!isOpen)
  //   setWithdrawAmount(0)
  //   setEscrowData(0)
  // }
  // Fetch escrow data
  // const fetchEscrowData = async () => {
  //   if (token_mint_address && zebecCtx.token) {
  //     const data = await deserializeStreamEscrow(zebecCtx.token, pda)
  //     setEscrowData([data])
  //   } else if (zebecCtx.stream) {
  //     const data = await deserializeStreamEscrow(zebecCtx.stream, pda)
  //     setEscrowData([data])
  //   }
  // }

  const handleSolanaWithdraw = async () => {
    if (zebecCtx.stream && zebecCtx.token) {
      const withdrawData = {
        data: {
          sender: sender,
          receiver: receiver,
          escrow: pda,
          token_mint_address: token_mint_address
        },
        stream: token_mint_address ? zebecCtx.token : zebecCtx.stream
      }
      dispatch(withdrawIncomingToken(withdrawData))
    }
  }
  const handleEVMWithdraw = async () => {
    if (!signer) return
    const messengerContract = new ZebecEthBridgeClient(
      BSC_ZEBEC_BRIDGE_ADDRESS,
      signer,
      getEVMToWormholeChain(walletObject.chainId)
    )
    console.log("transaction:", transaction)
    const tx = await messengerContract.withdrawFromTokenStream(
      transaction.sender,
      transaction.receiver,
      transaction.token_mint_address,
      transaction.pda
    )
    console.log("tx:", tx)
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
          <td className="px-6 py-5 min-w-85">
            <div className="flex items-center gap-x-2.5">
              <div className=" w-14 h-14">
                <CircularProgress
                  status={status}
                  percentage={(streamedToken * 100) / totalTransactionAmount}
                />
              </div>
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    +{formatCurrency(streamedToken, "", 4)}
                  </span>
                  &nbsp;{token}
                </div>
                <div className="text-caption">
                  {" "}
                  {formatCurrency(streamedToken, "", 4)} of{" "}
                  {formatCurrency(totalTransactionAmount, "", 4)} {token}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-5 min-w-60">
            <div className="text-caption text-content-primary">
              {formatDateTime(start_time)}
              <br />
              to {formatDateTime(end_time)}
            </div>
          </td>
          <td className="px-6 py-5 min-w-60">
            <UserAddress wallet={sender} />
          </td>
          <td className="px-6 py-5 w-full">
            <div className="flex items-center float-right gap-x-6">
              <Button
                title="Withdraw"
                size="small"
                startIcon={
                  <Icons.ArrowUpRightIcon className="text-content-contrast" />
                }
                onClick={() => {
                  // setCurrentStep(0)
                  // setIsOpen(true)
                  // fetchEscrowData()
                  withdraw()
                }}
              />
              {/* Withdraw Modal */}
              {/* <Modal
                show={currentStep >= 0 && isOpen}
                toggleModal={toggleModal}
                className={`rounded h-96 flex items-center justify-center`}
                hasCloseIcon={!currentStep}
                size="small"
              >
                {WithdrawStepsList[currentStep]?.component({
                  setCurrentStep,
                  withdrawAmount,
                  setWithdrawAmount,
                  fees,
                  escrowData,
                  transaction,
                  withdrawLoading,
                  setWithdrawLoadingFunc
                })}
              </Modal> */}
              {/* ------- */}
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
                activeDetailsRow === index ? `ease-in` : "ease-out"
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
                      {remarks ?? "-"}
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
                        <div data-tip={sender} className="">
                          {toSubstring(sender, 5, true)}
                        </div>
                        <CopyButton content={sender} />
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
                        <div className="" data-tip={receiver}>
                          {toSubstring(receiver, 5, true)}
                        </div>
                        <CopyButton content={receiver} />
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
                        {transaction_type === "instant" ? (
                          <Icons.ThunderIcon className="w-6 h-6" />
                        ) : (
                          <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                        )}
                        <span className="capitalize">{transaction_type}</span>
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
                        {formatCurrency(amount, "", 4)} {token}
                      </div>
                    </div>
                    {/* Paused Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.paused-amount")}
                      </div>
                      <div className="text-content-primary">
                        {formatCurrency(
                          latest_transaction_event.paused_amt,
                          "",
                          4
                        )}{" "}
                        {token}
                      </div>
                    </div>
                    {/* Total Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.total-amount")}
                      </div>
                      <div className="text-content-primary">
                        {" "}
                        {formatCurrency(totalTransactionAmount, "", 4)} {token}
                      </div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        {formatCurrency(streamedToken, "", 4)} {token} (
                        {formatCurrency(
                          (streamedToken * 100) / totalTransactionAmount,
                          "",
                          2
                        )}
                        %)
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
                          href={`https://solana.fm/tx/${transaction_hash}?cluster=${RPC_NETWORK}-solana`}
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
                        <div className="text-content-primary">
                          <Button
                            title={`${t("table.view-reference-file")}`}
                            size="small"
                            endIcon={
                              <Icons.OutsideLinkIcon className="text-content-contrast" />
                            }
                          />
                        </div>
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

export default IncomingTableRow
