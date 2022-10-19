import { useAppDispatch, useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  IconButton,
  UserAddress,
  SignerRow
} from "components/shared"
import { showRejectModal } from "features/modals/rejectModalSlice"
import { showSignModal } from "features/modals/signModalSlice"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { formatCurrency, formatDateTime, getTimesAgo, toSubstring } from "utils"
import { StatusType } from "components/transactions/transactions.d"
import CopyButton from "components/shared/CopyButton"
import {
  ApprovedRejectedUserProps,
  TreasuryApprovalType
} from "components/treasury/treasury.d"
import { useWallet } from "@solana/wallet-adapter-react"
import { getExplorerUrl } from "constants/explorers"

interface InstantTransactionsTableRowProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transaction: any
  activeDetailsRow: "" | number
  handleToggleRow: () => void
}

const InstantTransactionsTableRow: FC<InstantTransactionsTableRowProps> = ({
  index,
  transaction,
  activeDetailsRow,
  handleToggleRow
}) => {
  const { t } = useTranslation("transactions")
  const detailsRowRef = useRef<HTMLDivElement>(null)
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }
  const dispatch = useAppDispatch()
  const { publicKey } = useWallet()
  const [showAllRemaining, setShowAllRemaining] = useState(false)
  const { explorer } = useAppSelector((state) => state.settings)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [showAllRemaining])

  const {
    name,
    remarks,
    amount,
    token,
    status,
    sender,
    receiver,
    created_at,
    transaction_type,
    transaction_hash,
    file
  } = transaction

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

  const isRemaining = useMemo(() => {
    return remainingOwners.some((owner) => owner === publicKey?.toString())
  }, [remainingOwners, publicKey])

  return (
    <>
      <Fragment>
        {/* Table Body Row */}
        <tr className={`flex items-center`}>
          <td className="px-6 py-4 min-w-85">
            <div className="flex items-center gap-x-2.5">
              <CircularProgress
                percentage={status === TreasuryApprovalType.ACCEPTED ? 100 : 0}
                status={
                  status === TreasuryApprovalType.PENDING
                    ? StatusType.SCHEDULED
                    : status === TreasuryApprovalType.ACCEPTED
                    ? StatusType.COMPLETED
                    : StatusType.CANCELLED
                }
              />
              <div className="flex flex-col gap-y-1 text-content-contrast">
                <div className="flex items-center text-subtitle-sm font-medium">
                  <span className="text-subtitle text-content-primary font-semibold">
                    -
                    {status === TreasuryApprovalType.ACCEPTED
                      ? formatCurrency(amount, "", 4)
                      : 0}
                  </span>
                  &nbsp;{token}
                </div>
                <div className="text-caption">
                  {status === TreasuryApprovalType.ACCEPTED
                    ? formatCurrency(amount, "", 4)
                    : 0}{" "}
                  of {formatCurrency(amount, "", 4)} {token}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 min-w-50">
            <div className="text-caption text-content-primary">
              {formatDateTime(created_at)}
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
              {status === TreasuryApprovalType.PENDING && (
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
                    {/* End Date */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.initiated-on")}
                      </div>
                      <div className="text-content-primary">
                        {formatDateTime(created_at)}
                      </div>
                    </div>
                    {/* Stream Type */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.stream-type")}
                      </div>
                      <div className="flex items-center gap-x-1 text-content-primary">
                        <Icons.ThunderIcon className="w-6 h-6" />
                        <span className="capitalize">{transaction_type}</span>
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
                        {formatCurrency(amount, "", 4)} {token}
                      </div>
                    </div>
                    {/* Amount Received */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.amount-received")}
                      </div>
                      <div className="text-content-primary">
                        {status === TreasuryApprovalType.ACCEPTED
                          ? formatCurrency(amount, "", 4)
                          : 0}{" "}
                        {token} (
                        {status === TreasuryApprovalType.ACCEPTED ? 100 : 0}
                        %)
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-x-8">
                      <div className="w-32 text-content-secondary">
                        {t("table.status")}
                      </div>
                      <div className="flex items-center gap-x-2 text-content-primary">
                        {Math.sign(transaction.sent_token) > 0 ? (
                          <Icons.IncomingIcon className="w-5 h-5" />
                        ) : (
                          <Icons.OutgoingIcon className="w-5 h-5" />
                        )}
                        <span>
                          {status === TreasuryApprovalType.PENDING
                            ? StatusType.SCHEDULED
                            : status === TreasuryApprovalType.ACCEPTED
                            ? StatusType.COMPLETED
                            : StatusType.CANCELLED}
                        </span>
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
                  className={`flex gap-x-4 py-6 ${!isRemaining && "hidden"}`}
                >
                  <Button
                    startIcon={<Icons.EditIcon />}
                    variant="gradient"
                    title={`${t("table.sign-and-approve")}`}
                    onClick={() => dispatch(showSignModal(transaction))}
                  />
                  <Button
                    startIcon={<Icons.CrossIcon />}
                    title={`${t("table.reject")}`}
                    onClick={() => dispatch(showRejectModal(transaction))}
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

export default InstantTransactionsTableRow
