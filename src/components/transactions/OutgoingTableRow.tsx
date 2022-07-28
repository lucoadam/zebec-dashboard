import { useAppDispatch } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  IconButton,
  UserAddress
} from "components/shared"
import CopyButton from "components/shared/CopyButton"
import { toggleCancelModal } from "features/modals/cancelModalSlice"
import { togglePauseModal } from "features/modals/pauseModalSlice"
import { toggleResumeModal } from "features/modals/resumeModalSlice"
import moment from "moment"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useEffect, useRef, useState } from "react"
import { formatCurrency, toSubstring } from "utils"

export type TransactionStatus =
  | "completed"
  | "outgoing"
  | "scheduled"
  | "cancelled"
  | "paused"

interface OutgoingTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const OutgoingTableRow: FC<OutgoingTableRowProps> = ({
  index,
  activeDetailsRow,
  handleToggleRow,
  transaction
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const [streamedToken, setStreamedToken] = useState(0)
  const [status, setStatus] = useState<TransactionStatus>("scheduled")
  const [currentTime, setCurrentTime] = useState(Date.now() / 1000)

  const totalTimeInSec = transaction.end_time - transaction.start_time
  console.log(`totalTimeInSec`, totalTimeInSec)
  const streamRatePerSec = transaction.amount / totalTimeInSec

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
      console.log(transaction.end_time)
    }
  }, [status, currentTime])

  console.log(status)
  console.log(streamedToken)
  console.log(streamRatePerSec)
  console.log(streamedToken)

  useEffect(() => {
    if (status === "completed") {
      setStreamedToken(transaction.amount)
    } else if (status === "outgoing") {
      const interval = setInterval(() => {
        setStreamedToken((prevStreamedToken) =>
          prevStreamedToken + streamRatePerSec > transaction.amount
            ? transaction.amount
            : prevStreamedToken + streamRatePerSec
        )
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [status])

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
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
                {" "}
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
                  &nbsp;{transaction.symbol}
                </div>
                <div className="text-caption">
                  {formatCurrency(streamedToken, "", 4)} of{" "}
                  {formatCurrency(transaction.amount, "", 4)}{" "}
                  {transaction.symbol}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-5 min-w-61">
            <div className="text-caption text-content-primary">
              {moment
                .unix(transaction.start_time)
                .format("MMMM Do YYYY, h:mm:ss A")}{" "}
              <br />
              to{" "}
              {moment
                .unix(transaction.end_time)
                .format("MMMM Do YYYY, h:mm:ss A")}
            </div>
          </td>
          <td className="px-6 py-5 min-w-61">
            <UserAddress wallet={transaction.receiver} />
          </td>
          <td className="px-6 py-5 w-full">
            <div className="flex items-center float-right gap-x-6">
              <div className="flex items-center gap-x-3">
                <Button
                  title="Resume"
                  size="small"
                  startIcon={
                    <Icons.ResumeIcon className="text-content-contrast" />
                  }
                  onClick={() => {
                    dispatch(toggleResumeModal())
                  }}
                />
                <Button
                  title="Pause"
                  size="small"
                  startIcon={
                    <Icons.PauseIcon className="text-content-contrast" />
                  }
                  onClick={() => {
                    dispatch(togglePauseModal())
                  }}
                />

                <Button
                  title="Cancel"
                  size="small"
                  startIcon={
                    <Icons.CrossIcon className="text-content-contrast" />
                  }
                  onClick={() => {
                    dispatch(toggleCancelModal())
                  }}
                />
              </div>
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
                    {transaction.transaction_name}
                  </div>
                  {transaction.remark && (
                    <div className="text-body text-content-secondary">
                      {transaction.remark ?? "-"}
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
                        <div data-tip={transaction.sender} className="">
                          {toSubstring(transaction.sender, 5, true)}
                        </div>
                        <CopyButton content={transaction.sender} />
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
                          alt="Receiver Logo"
                          src={Images.Avatar3}
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <div className="" data-tip={transaction.receiver}>
                          {toSubstring(transaction.receiver, 5, true)}
                        </div>
                        <CopyButton content={transaction.receiver} />
                      </div>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.start-date")}
                      </div>
                      <div className="text-content-primary">
                        {moment
                          .unix(transaction.start_time)
                          .format("MMMM Do YYYY, h:mm:ss A")}
                      </div>
                    </div>
                    {/* End Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.end-date")}
                      </div>
                      <div className="text-content-primary">
                        {moment
                          .unix(transaction.end_time)
                          .format("MMMM Do YYYY, h:mm:ss A")}
                      </div>
                    </div>
                    {/* Stream Type */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.stream-type")}
                      </div>
                      <div className="flex items-center gap-x-1 text-content-primary">
                        {transaction.type === "instant" ? (
                          <Icons.ThunderIcon className="w-6 h-6" />
                        ) : (
                          <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
                        )}
                        <span>{`${
                          transaction.type === "instant"
                            ? "Instant"
                            : "Continuous"
                        }`}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Total Amount */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.total-amount")}
                      </div>
                      <div className="text-content-primary">
                        {formatCurrency(transaction.amount, "", 4)}{" "}
                        {transaction.symbol}
                      </div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        {formatCurrency(streamedToken, "", 4)}{" "}
                        {transaction.symbol} (
                        {formatCurrency(
                          (streamedToken * 100) / transaction.amount,
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
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Icons.IncomingIcon className="w-5 h-5" />
                        <span>Ongoing</span>
                      </div>
                    </div>
                    {/* Transaction */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.transaction")}
                      </div>
                      <div className="text-content-primary">
                        <Button
                          title={`${t("table.view-on-explorer")}`}
                          size="small"
                          endIcon={
                            <Icons.OutsideLinkIcon className="text-content-contrast" />
                          }
                        />
                      </div>
                    </div>
                    {/* Reference */}
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

export default OutgoingTableRow
