/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import * as Icons from "assets/icons"

import { CircularProgress } from "components/shared"
import {
  StatusType,
  TransactionStatusType
} from "components/transactions/transactions.d"
import { formatCurrency } from "utils"
import { useAppSelector } from "app/hooks"

interface RecentTransactionRowProps {
  transaction: any
}

export const RecentTransactionRow: FC<RecentTransactionRowProps> = ({
  transaction
}) => {
  const walletObject = useWallet()

  const { initiatedTransactions } = useAppSelector(
    (state) => state.transactions
  )

  const {
    name,
    remarks,
    amount,
    token,
    sender,
    start_time,
    end_time,
    latest_transaction_event
  } = transaction

  const totalTransactionAmount =
    amount - Number(latest_transaction_event.paused_amt)

  const totalTimeInSec = transaction.end_time - transaction.start_time
  const streamRatePerSec = transaction.amount / totalTimeInSec

  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000)
  const [streamedToken, setStreamedToken] = useState<number>(0)
  const [status, setStatus] = useState<TransactionStatusType>(
    transaction.status
  )
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevCurrentTime) => prevCurrentTime + 1)
    }, 1000)
    if (
      status === StatusType.COMPLETED ||
      status === StatusType.PAUSED ||
      status === StatusType.CANCELLED
    ) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
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
    if (
      initiatedTransactions.some(
        (initiatedTrx) => initiatedTrx === transaction.uuid
      )
    ) {
      setStreamedToken(
        latest_transaction_event.paused_amt
          ? streamRatePerSec * (currentTime - start_time) -
              Number(latest_transaction_event.paused_amt)
          : streamRatePerSec * (currentTime - start_time)
      )
    } else {
      if (status === StatusType.COMPLETED) {
        setStreamedToken(amount - Number(latest_transaction_event.paused_amt))
      } else if (status === StatusType.ONGOING) {
        if (counter === 0) {
          setStreamedToken(
            latest_transaction_event.paused_amt
              ? streamRatePerSec * (currentTime - start_time) -
                  Number(latest_transaction_event.paused_amt)
              : streamRatePerSec * (currentTime - start_time)
          )
          setCounter((counter) => counter + 1)
        } else {
          const interval = setInterval(() => {
            setStreamedToken((prevStreamedToken: number) =>
              prevStreamedToken + streamRatePerSec > amount
                ? amount
                : prevStreamedToken + streamRatePerSec
            )
          }, 1000)
          return () => clearInterval(interval)
        }
      } else if (
        status === StatusType.CANCELLED ||
        status === StatusType.PAUSED
      ) {
        setStreamedToken(
          Number(latest_transaction_event.withdrawn) +
            Number(latest_transaction_event.withdraw_limit)
        )
      }
    }
    // eslint-disable-next-line
  }, [status, counter])

  return (
    <tr>
      <td className=" py-4 min-w-60">
        <div className="flex items-center gap-x-2.5">
          <div className=" w-6 h-6 grid place-content-center bg-outline-icon rounded">
            {walletObject?.publicKey?.toString() === sender ? (
              <Icons.OutgoingIcon className="w-5 h-5" />
            ) : (
              <Icons.IncomingIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col gap-y-1 text-content-contrast">
            <div className="text-subtitle text-content-primary font-semibold capitalize">
              {name}
            </div>
            <div className="text-caption">{remarks}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 min-w-70">
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
    </tr>
  )
}
