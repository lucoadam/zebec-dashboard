/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import * as Icons from "assets/icons"

import { CircularProgress, TransactionStatus } from "components/shared"
import { formatCurrency } from "utils"

interface RecentTransactionRowProps {
  transaction: any
}

export const RecentTransactionRow: FC<RecentTransactionRowProps> = ({
  transaction
}) => {
  const walletObject = useWallet()

  const totalTimeInSec = transaction.end_time - transaction.start_time
  const streamRatePerSec = transaction.amount / totalTimeInSec

  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000)
  const [streamedToken, setStreamedToken] = useState<number>(0)
  const [status, setStatus] = useState<TransactionStatus>("scheduled")
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevCurrentTime) => prevCurrentTime + 1)
    }, 1000)
    if (status === "completed") {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [currentTime, status])

  useEffect(() => {
    if (currentTime < transaction.start_time) {
      setStatus("scheduled")
    } else if (
      currentTime >= transaction.start_time &&
      currentTime < transaction.end_time
    ) {
      setStatus("outgoing")
    } else if (currentTime >= transaction.end_time) {
      setStatus("completed")
    }
  }, [status, currentTime, transaction.end_time, transaction.start_time])

  useEffect(() => {
    if (status === "completed") {
      setStreamedToken(transaction.amount)
    } else if (status === "outgoing") {
      if (counter === 0) {
        setStreamedToken(
          streamRatePerSec * (currentTime - transaction.start_time)
        )
        setCounter((counter) => counter + 1)
      } else {
        const interval = setInterval(() => {
          setStreamedToken((prevStreamedToken: number) =>
            prevStreamedToken + streamRatePerSec > transaction.amount
              ? transaction.amount
              : prevStreamedToken + streamRatePerSec
          )
        }, 1000)
        return () => clearInterval(interval)
      }
    }
    // eslint-disable-next-line
  }, [status, counter])

  return (
    <tr key={transaction.id}>
      <td className=" py-5 min-w-60">
        <div className="flex items-center gap-x-2.5">
          <div className=" w-6 h-6 grid place-content-center bg-outline-icon rounded">
            {walletObject?.publicKey?.toString() === transaction?.sender ? (
              <Icons.OutgoingIcon className="w-5 h-5" />
            ) : (
              <Icons.IncomingIcon className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col gap-y-1 text-content-contrast">
            <div className="text-subtitle text-content-primary font-semibold capitalize">
              {transaction?.name}
            </div>
            <div className="text-caption">{transaction?.remarks}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 min-w-70">
        <div className="flex items-center gap-x-2.5">
          <div className=" w-14 h-14">
            <CircularProgress
              status={status}
              percentage={(streamedToken * 100) / transaction.amount}
            />
          </div>
          <div className="flex flex-col gap-y-1 text-content-contrast">
            <div className="flex items-center text-subtitle-sm font-medium">
              <span className="text-subtitle text-content-primary font-semibold">
                +{formatCurrency(streamedToken, "", 4)}
              </span>
              &nbsp;{transaction.token}
            </div>
            <div className="text-caption">
              {" "}
              {formatCurrency(streamedToken, "", 4)} of{" "}
              {formatCurrency(transaction.amount, "", 4)} {transaction.token}
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}
