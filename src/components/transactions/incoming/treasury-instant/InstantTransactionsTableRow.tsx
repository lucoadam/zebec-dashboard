import * as Icons from "assets/icons"
import * as Images from "assets/images"
import {
  Button,
  CircularProgress,
  IconButton,
  UserAddress
} from "components/shared"
import { useTranslation } from "next-i18next"
import Image from "next/image"
import { FC, Fragment, useEffect, useRef } from "react"
import ReactTooltip from "react-tooltip"
import { formatCurrency, formatDateTime, toSubstring } from "utils"
import { StatusType } from "components/transactions/transactions.d"
import CopyButton from "components/shared/CopyButton"
import { RPC_NETWORK } from "constants/cluster"
import { TreasuryApprovalType } from "components/treasury/treasury.d"

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

  const styles = {
    detailsRow: {
      height:
        activeDetailsRow === index
          ? `${detailsRowRef.current?.scrollHeight}px`
          : "0px"
    }
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

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
          <td className="px-6 py-4 min-w-60">
            <div className="text-caption text-content-primary">
              {formatDateTime(created_at)}
            </div>
          </td>
          <td className="px-6 py-4 min-w-60">
            <UserAddress wallet={sender} />
          </td>
          <td className="px-6 py-4 w-full">
            <div className="flex items-center justify-end float-right gap-x-6">
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
                      <div className="flex items-center gap-x-2 text-content-primary capitalize">
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

export default InstantTransactionsTableRow
