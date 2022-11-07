import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  IconButton,
  UserAddress,
  SignerRow,
  ViewReferenceFile,
  FormatCurrency
} from "components/shared"
import { showRejectModal } from "features/modals/rejectModalSlice"
import { showSignModal } from "features/modals/signModalSlice"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { formatDateTime, getTimesAgo, toSubstring } from "utils"
import {
  StatusType,
  TransactionStatusType
} from "components/transactions/transactions.d"
import CopyButton from "components/shared/CopyButton"
import {
  ApprovedRejectedUserProps,
  TreasuryApprovalType
} from "components/treasury/treasury.d"
import { showResumeModal } from "features/modals/resumeModalSlice"
import { showPauseModal } from "features/modals/pauseModalSlice"
import { showCancelModal } from "features/modals/cancelModalSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import { getExplorerUrl } from "constants/explorers"

interface ScheduledTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const ContinuousTransactionsTableRow: FC<ScheduledTableRowProps> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const { activeTreasury } = useAppSelector((state) => state.treasury)
  const { initiatedTransactions } = useAppSelector(
    (state) => state.treasuryTransactions
  )
  const { explorer } = useAppSelector((state) => state.settings)

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }
  const { publicKey } = useWallet()
  const dispatch = useAppDispatch()
  const [showAllRemaining, setShowAllRemaining] = useState(false)
  const [
    showAllRemainingLatestTransaction,
    setShowAllRemainingLatestTransaction
  ] = useState(false)
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [showAllRemaining])

  const {
    name,
    remarks,
    amount,
    token,
    sender,
    receiver,
    start_time,
    end_time,
    created_at,
    transaction_type,
    transaction_hash,
    file,
    approval_status,
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
    if (approval_status === TreasuryApprovalType.ACCEPTED) {
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
    } else if (approval_status === TreasuryApprovalType.PENDING) {
      if (currentTime < end_time) {
        setStatus(StatusType.SCHEDULED)
      } else {
        setStatus(StatusType.CANCELLED)
      }
    } else if (approval_status === TreasuryApprovalType.REJECTED) {
      setStatus(StatusType.CANCELLED)
    }
    // eslint-disable-next-line
  }, [status, currentTime, transaction])

  useEffect(() => {
    if (
      initiatedTransactions.some(
        (initiatedTrx) => initiatedTrx === transaction.uuid
      )
    ) {
      if (currentTime < start_time) {
        setStreamedToken(0)
      } else {
        setStreamedToken(
          latest_transaction_event.paused_amt
            ? streamRatePerSec * (currentTime - start_time) -
                Number(latest_transaction_event.paused_amt)
            : streamRatePerSec * (currentTime - start_time)
        )
      }
    } else {
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
    }
    // eslint-disable-next-line
  }, [status, transaction])

  const remainingOwners = useMemo(() => {
    let remainingOwnersList: string[] = []
    if (activeTreasury) {
      const treasuryOwners = activeTreasury.owners.map(
        (owner) => owner.wallet_address
      )
      const aprovedOwners = transaction.approved_by.map(
        (owner: ApprovedRejectedUserProps) => owner.user
      )
      const rejectedOwners = transaction.rejected_by.map(
        (owner: ApprovedRejectedUserProps) => owner.user
      )
      const approvedRejectedOwners = [...aprovedOwners, ...rejectedOwners]

      remainingOwnersList = treasuryOwners.filter(
        (owner) => !approvedRejectedOwners.includes(owner)
      )
    }
    return remainingOwnersList
  }, [activeTreasury, transaction])

  const remainingLatestTransactionOwners = useMemo(() => {
    let remainingOwnersList: string[] = []
    if (activeTreasury) {
      const treasuryOwners = activeTreasury.owners.map(
        (owner) => owner.wallet_address
      )
      const aprovedOwners = latest_transaction_event.approved_by.map(
        (owner: ApprovedRejectedUserProps) => owner.user
      )
      const rejectedOwners = latest_transaction_event.rejected_by.map(
        (owner: ApprovedRejectedUserProps) => owner.user
      )
      const approvedRejectedOwners = [...aprovedOwners, ...rejectedOwners]

      remainingOwnersList = treasuryOwners.filter(
        (owner) => !approvedRejectedOwners.includes(owner)
      )
    }
    return remainingOwnersList
  }, [
    activeTreasury,
    latest_transaction_event.approved_by,
    latest_transaction_event.rejected_by
  ])

  const isRemaining = useMemo(() => {
    return (
      remainingOwners.some((owner) => owner === publicKey?.toString()) &&
      approval_status === TreasuryApprovalType.PENDING
    )
  }, [remainingOwners, publicKey, approval_status])

  const isRemainingLatestTransaction = useMemo(() => {
    return (
      remainingLatestTransactionOwners.some(
        (owner) => owner === publicKey?.toString()
      ) &&
      latest_transaction_event.approval_status === TreasuryApprovalType.PENDING
    )
  }, [
    remainingLatestTransactionOwners,
    publicKey,
    latest_transaction_event.approval_status
  ])

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-85">
            <div className="flex items-center gap-x-2.5">
              <CircularProgress
                percentage={(streamedToken * 100) / totalTransactionAmount}
                status={status}
              />
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    -<FormatCurrency amount={streamedToken} fix={4} />
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
          <td className="px-6 py-4 min-w-50">
            <div className="text-caption text-content-primary">
              {formatDateTime(start_time)} <br />
              {t("table.of")} {formatDateTime(end_time)}
            </div>
          </td>
          <td className="min-w-33.5 px-6 py-4">
            <div className="text-caption text-content-primary">
              {getTimesAgo(created_at)}
            </div>
          </td>
          <td className="px-6 py-4 min-w-50">
            <UserAddress wallet={receiver} />
          </td>
          <td className="px-6 py-4 w-full">
            <div className="flex items-center justify-end float-right gap-x-6">
              {latest_transaction_event.approval_status ===
                TreasuryApprovalType.PENDING &&
                latest_transaction_event.status !== "initial" && (
                  <Button
                    size="small"
                    title={`${latest_transaction_event.status} INITIATED`}
                    className="text-content-secondary hover:text-content-secondary cursor-auto uppercase"
                  />
                )}
              {/* Pause | Resume | Cancel */}
              {approval_status === TreasuryApprovalType.ACCEPTED &&
                latest_transaction_event.approval_status !==
                  TreasuryApprovalType.PENDING && (
                  <>
                    {status === StatusType.PAUSED && currentTime < end_time && (
                      <Button
                        title={`${t("table.resume")}`}
                        size="small"
                        startIcon={
                          <Icons.ResumeIcon className="text-content-contrast" />
                        }
                        onClick={() => {
                          dispatch(showResumeModal(transaction))
                        }}
                      />
                    )}
                    {status === StatusType.ONGOING && currentTime < end_time && (
                      <Button
                        title={`${t("table.pause")}`}
                        size="small"
                        startIcon={
                          <Icons.PauseIcon className="text-content-contrast" />
                        }
                        onClick={() => {
                          dispatch(showPauseModal(transaction))
                        }}
                      />
                    )}
                    {status !== StatusType.CANCELLED && currentTime < end_time && (
                      <Button
                        title={`${t("table.cancel")}`}
                        size="small"
                        startIcon={
                          <Icons.CrossIcon className="text-content-contrast" />
                        }
                        onClick={() => {
                          dispatch(showCancelModal(transaction))
                        }}
                      />
                    )}
                  </>
                )}

              {approval_status === TreasuryApprovalType.PENDING &&
                currentTime < end_time && (
                  <>
                    <Button
                      startIcon={
                        <Icons.EditIcon className="text-content-contrast" />
                      }
                      size="small"
                      title={`${t("table.sign-and-approve")}`}
                      onClick={() => dispatch(showSignModal(transaction))}
                      className={`${!isRemaining && "hidden"}`}
                    />
                    <Button
                      startIcon={
                        <Icons.CrossIcon className="text-content-contrast" />
                      }
                      size="small"
                      title={`${t("table.reject")}`}
                      onClick={() => dispatch(showRejectModal(transaction))}
                      className={`${!isRemaining && "hidden"}`}
                    />
                  </>
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
                {/* Latest Transaction Initiates */}
                {latest_transaction_event.approval_status ===
                  TreasuryApprovalType.PENDING && (
                  <div className="border-b border-outline mb-6">
                    <div className="flex gap-x-3">
                      <div className="text-body text-content-secondary">
                        {t("table.latest-transaction-initiated")}
                      </div>
                      <div className="text-subtitle-sm text-content-primary font-medium uppercase">
                        {latest_transaction_event.status}
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div className=" text-body text-content-secondary">
                        {t("table.requested-by")}
                      </div>
                      <div className="text-subtitle-sm text-content-primary font-medium">
                        {toSubstring(
                          latest_transaction_event.approved_by[0]?.user,
                          5,
                          true
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex gap-x-32 py-6 text-subtitle-sm font-medium ${
                        isRemaining && "border-b border-outline"
                      }`}
                    >
                      {/* Left Column */}
                      <div className="flex flex-col gap-y-4">
                        {/* Signed Owners */}
                        <div className="flex gap-x-8">
                          <div className="w-32 text-content-secondary">
                            {t("table.signed-by")}
                          </div>
                          <div className="grid gap-y-4">
                            {latest_transaction_event.approved_by.map(
                              (
                                item: {
                                  user: string
                                  time: number
                                },
                                index: number
                              ) => (
                                <SignerRow
                                  key={index}
                                  index={index}
                                  user={item.user}
                                  time={item.time}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="flex flex-col gap-y-4">
                        {/* Total Amount */}
                        <div className="flex gap-x-8">
                          <div className="w-32 text-content-secondary">
                            {t("table.remaining")}
                          </div>

                          <div className="grid gap-y-4">
                            <div className="text-content-primary">
                              {remainingLatestTransactionOwners?.length}{" "}
                              {t("transactions:table.out-of")}{" "}
                              {activeTreasury?.owners.length}{" "}
                              {t("transactions:table.owners")}
                            </div>
                            {remainingLatestTransactionOwners
                              ?.slice(0, 3)
                              .map((item: string, index: number) => (
                                <SignerRow
                                  key={index}
                                  index={index}
                                  user={item}
                                />
                              ))}
                            {/* Has owners more than three */}
                            {remainingLatestTransactionOwners.length > 3 && (
                              <div className="text-content-primary">
                                <Button
                                  title={`${t("table.show-all-remaining")}`}
                                  size="small"
                                  endIcon={
                                    <Icons.ArrowDownIcon className="text-content-contrast" />
                                  }
                                  onClick={() =>
                                    setShowAllRemainingLatestTransaction(
                                      !showAllRemainingLatestTransaction
                                    )
                                  }
                                />
                                {showAllRemainingLatestTransaction && (
                                  <div className={`pt-3 pl-3`}>
                                    <div className="grid gap-y-4">
                                      {remainingLatestTransactionOwners
                                        ?.slice(3)
                                        .map((item: string, index: number) => (
                                          <SignerRow
                                            key={index}
                                            index={index}
                                            user={item}
                                          />
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`gap-x-4 py-6 ${
                        !isRemainingLatestTransaction || currentTime > end_time
                          ? "hidden"
                          : "flex"
                      }`}
                    >
                      <Button
                        startIcon={<Icons.EditIcon />}
                        variant="gradient"
                        title={`${t("table.sign-and-approve")}`}
                        onClick={() => dispatch(showSignModal(transaction))}
                        className={`${
                          !isRemainingLatestTransaction && "hidden"
                        }`}
                      />
                      <Button
                        startIcon={<Icons.CrossIcon />}
                        title={`${t("table.reject")}`}
                        onClick={() => dispatch(showRejectModal(transaction))}
                        className={`${
                          !isRemainingLatestTransaction && "hidden"
                        }`}
                      />
                    </div>
                  </div>
                )}

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
                <div className="flex gap-x-44 py-6 text-subtitle-sm font-medium border-b border-outline">
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
                        <Icons.DoubleCircleDottedLineIcon className="w-6 h-6" />
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
                        {token}&nbsp;(
                        <FormatCurrency
                          amount={
                            (streamedToken * 100) / totalTransactionAmount
                          }
                          showTooltip={false}
                        />
                        %)
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.status")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        <Icons.OutgoingIcon className="w-5 h-5" />
                        <span className="capitalize">{status}</span>
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
                <div
                  className={`flex gap-x-32 py-6 text-subtitle-sm font-medium ${
                    isRemaining && "border-b border-outline"
                  }`}
                >
                  {/* Left Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Signed Owners */}
                    <div className="flex gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.signed-by")}
                      </div>
                      <div className="grid gap-y-4">
                        {transaction.approved_by.map(
                          (
                            item: {
                              user: string
                              time: number
                            },
                            index: number
                          ) => (
                            <SignerRow
                              key={index}
                              index={index}
                              user={item.user}
                              time={item.time}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="flex flex-col gap-y-4">
                    {/* Total Amount */}
                    <div className="flex gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.remaining")}
                      </div>

                      <div className="grid gap-y-4">
                        <div className="text-content-primary">
                          {remainingOwners?.length}{" "}
                          {t("transactions:table.out-of")}{" "}
                          {activeTreasury?.owners.length}{" "}
                          {t("transactions:table.owners")}
                        </div>
                        {remainingOwners
                          ?.slice(0, 3)
                          .map((item: string, index: number) => (
                            <SignerRow key={index} index={index} user={item} />
                          ))}
                        {/* Has owners more than three */}
                        {remainingOwners.length > 3 && (
                          <div className="text-content-primary">
                            <Button
                              title={`${t("table.show-all-remaining")}`}
                              size="small"
                              endIcon={
                                <Icons.ArrowDownIcon className="text-content-contrast" />
                              }
                              onClick={() =>
                                setShowAllRemaining(!showAllRemaining)
                              }
                            />
                            {showAllRemaining && (
                              <div className={`pt-3 pl-3`}>
                                <div className="grid gap-y-4">
                                  {remainingOwners
                                    ?.slice(3)
                                    .map((item: string, index: number) => (
                                      <SignerRow
                                        key={index}
                                        index={index}
                                        user={item}
                                      />
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`gap-x-4 py-6 ${
                    !isRemaining || currentTime > end_time ? "hidden" : "flex"
                  }`}
                >
                  <Button
                    startIcon={<Icons.EditIcon />}
                    variant="gradient"
                    title={`${t("table.sign-and-approve")}`}
                    onClick={() => dispatch(showSignModal(transaction))}
                    className={`${!isRemaining && "hidden"}`}
                  />
                  <Button
                    startIcon={<Icons.CrossIcon />}
                    title={`${t("table.reject")}`}
                    onClick={() => dispatch(showRejectModal(transaction))}
                    className={`${!isRemaining && "hidden"}`}
                  />
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
