import { FC, useEffect, useMemo, useRef, useState } from "react"
import * as Icons from "assets/icons"
import {
  TreasuryTransactionType,
  WithdrawDepositTransactionProps,
  ApprovedRejectedUserProps
} from "components/treasury/treasury.d"
import { formatDateTime } from "utils"
import { useTranslation } from "next-i18next"
import {
  Button,
  CollapseDropdown,
  UserAddress,
  SignerRow,
  FormatCurrency
} from "components/shared"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { showSignModal } from "features/modals/signModalSlice"
import { showRejectModal } from "features/modals/rejectModalSlice"
import { useClickOutside } from "hooks"
import ReactTooltip from "react-tooltip"
import { useWallet } from "@solana/wallet-adapter-react"

interface PendingConfirmationRowProps {
  transaction: WithdrawDepositTransactionProps
}

export const PendingConfirmationRow: FC<PendingConfirmationRowProps> = ({
  transaction
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const confirmationDialogRef = useRef(null)
  const { publicKey } = useWallet()
  const { activeTreasury } = useAppSelector((state) => state.treasury)

  const [toggleConfirmationDialog, setToggleConfirmationDialog] =
    useState<boolean>(false)
  const [showAllRemaining, setShowAllRemaining] = useState<boolean>(false)

  useClickOutside(confirmationDialogRef, {
    onClickOutside: () => setToggleConfirmationDialog(false)
  })

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [toggleConfirmationDialog])

  const isIncoming =
    transaction.transaction_type ===
      TreasuryTransactionType.DEPOSIT_TO_TREASURY ||
    transaction.transaction_type ===
      TreasuryTransactionType.DEPOSIT_TO_TREASURY_VAULT
      ? true
      : false

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
    <div
      key={transaction.uuid}
      className="pt-2 pb-4 flex flex-col gap-y-2 border-b border-outline last:border-b-0"
    >
      <div className="flex w-full">
        <div className="w-1/2 flex gap-x-2.5 items-center">
          {isIncoming ? (
            <Icons.IncomingIcon className="flex-shrink-0 w-7 h-7 self-start mt-1.5" />
          ) : (
            <Icons.OutgoingIcon className="flex-shrink-0 w-7 h-7 self-start mt-1.5" />
          )}
          <div className="flex flex-col">
            <div className="">
              <span className=" text-content-primary font-semibold text-subtitle">
                {isIncoming ? "+" : "-"}
                <FormatCurrency amount={transaction.amount} fix={4} />
              </span>
              <span className="text-content-contrast font-medium text-subtitle-sm ml-1">
                {transaction.token_symbol}
              </span>
            </div>
            <div className="text-caption text-content-contrast">
              {transaction.transaction_type ===
              TreasuryTransactionType.DEPOSIT_TO_TREASURY_VAULT
                ? `${t("treasuryOverview:deposit-to-vault")}`
                : transaction.transaction_type ===
                  TreasuryTransactionType.WITHDRAW_FROM_TREASURY
                ? `${t("treasuryOverview:withdraw-from-treasury")}`
                : transaction.transaction_type ===
                  TreasuryTransactionType.WITHDRAW_FROM_TREASURY_VAULT
                ? `${t("treasuryOverview:withdraw-from-treasury-vault")}`
                : ""}
            </div>
          </div>
        </div>
        <div className="w-1/2 pl-3 pr-2 text-caption text-content-secondary mt-1.5">
          <span className="flex flex-wrap items-center">
            {t("treasuryOverview:initiated-by")}&nbsp;
            <UserAddress
              wallet={transaction.approved_by[0].user}
              showIcons={false}
            />
            &nbsp;
            {t("treasuryOverview:on")}&nbsp;
            {formatDateTime(transaction.created_at)}
          </span>
        </div>
      </div>
      <div className="flex w-full items-center">
        <div className="w-1/2 flex items-center gap-x-2">
          <Button
            title={`${t("treasuryOverview:sign")}`}
            startIcon={<Icons.EditIcon />}
            size="small"
            onClick={() => dispatch(showSignModal(transaction))}
            className={`${!isRemaining && "hidden"}`}
          />
          <Button
            title={`${t("treasuryOverview:reject")}`}
            startIcon={<Icons.CrossIcon />}
            size="small"
            onClick={() => dispatch(showRejectModal(transaction))}
            className={`${!isRemaining && "hidden"}`}
          />
        </div>
        <div className="w-1/2 pl-3 pr-2">
          <div className="flex items-center gap-x-0.5 text-caption text-content-secondary max-w-max">
            {t("treasuryOverview:confirmation")}:{" "}
            {transaction.approved_by.length}/{activeTreasury?.owners.length}{" "}
            <div
              ref={confirmationDialogRef}
              className="relative group"
              onMouseOver={() => setToggleConfirmationDialog(true)}
              onMouseLeave={() => setToggleConfirmationDialog(false)}
            >
              <span className="w-5 h-5 rounded transition group-hover:bg-background-light grid place-content-center cursor-pointer">
                <Icons.InformationIcon className="w-4 h-4 text-content-contrast" />
              </span>
              {/* Dropdown */}
              <CollapseDropdown
                show={toggleConfirmationDialog}
                className="top-4 w-[436px] bg-transparent divide-y-0"
                onHover={true}
              >
                <div className="p-6 rounded-lg bg-background-light border-b-0">
                  <div className="flex flex-col gap-y-6 text-subtitle-sm font-medium">
                    {/* Signed Owners */}
                    <div className="flex gap-x-8">
                      <div className="w-24 text-content-secondary">
                        {t("transactions:table.signed-by")}
                      </div>
                      <div className="grid gap-y-4">
                        {transaction.approved_by.map((item, index: number) => (
                          <SignerRow
                            key={index}
                            index={index}
                            user={item.user}
                            time={item.time}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Rejected Owners */}
                    {transaction.rejected_by.length > 0 && (
                      <div className="flex gap-x-8">
                        <div className="w-24 text-content-secondary">
                          {t("transactions:table.rejected-by")}
                        </div>
                        <div className="grid gap-y-4">
                          {transaction.rejected_by.map(
                            (item, index: number) => (
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
                    )}
                    {/* Remaining Owners */}
                    <div className="flex gap-x-8">
                      <div className="w-24 text-content-secondary">
                        {t("transactions:table.remaining")}
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
                          <>
                            <div className="text-content-primary">
                              <Button
                                title={`${t(
                                  "transactions:table.show-all-remaining"
                                )}`}
                                size="small"
                                endIcon={
                                  <Icons.ArrowDownIcon className="text-content-contrast" />
                                }
                                onClick={() =>
                                  setShowAllRemaining(!showAllRemaining)
                                }
                              />
                            </div>
                            {showAllRemaining && (
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
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapseDropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
