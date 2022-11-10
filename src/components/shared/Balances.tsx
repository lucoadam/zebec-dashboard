import { useAppSelector } from "app/hooks"
import * as Icons from "assets/icons"
// import { tokenBalances, weeklyBalances } from "fakedata"
import { useClickOutside, useToggle } from "hooks"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { FC, useRef } from "react"
import { displayExponentialNumber, formatCurrency, splitNumber } from "utils"
import { DepositedBalanceProps } from "./Balances.d"
import { Button } from "./Button"
import { Token } from "./Token"
import { TokensDropdwonDashboard } from "./TokensDropdownDashboard"
/* Deposited Balance */
export const DepositedBalance: FC<DepositedBalanceProps> = ({
  balance = 0,
  page = "dashboard"
}) => {
  const { t } = useTranslation()
  const depositedBalance = splitNumber(balance)
  return (
    <div className="deposited-balance p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
        {t("common:balances.deposited-balance")}
      </div>
      <div>
        <div className=" text-heading-3 text-content-primary font-semibold">
          <span data-tip={displayExponentialNumber(balance)}>
            {`$${depositedBalance[0]}`}
            <span className=" text-subtitle text-content-contrast">
              .{depositedBalance[1]}
            </span>
          </span>
        </div>
        <p className="text-caption text-content-contrast mt-4">
          {page === "treasury"
            ? t("common:balances.treasury-despoited-balance-detail")
            : t("common:balances.zebec-despoited-balance-detail")}
        </p>
      </div>
    </div>
  )
}

/* Total Withdrawable Amount */
export const TotalWithdrawableAmount: FC = () => {
  const { t } = useTranslation()
  return (
    <div className="total-withdrawable-amount p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          {t("common:balances.total-withdrawable-amount")}
        </div>
        <Link href="/transactions">
          <Button
            size="small"
            title={`${t("common:balances.view")}`}
            endIcon={<Icons.ArrowRightIcon />}
          />
        </Link>
      </div>
      <div className="space-y-4">
        <div className=" text-heading-3 text-content-primary font-semibold">
          $832
          <span className=" text-subtitle text-content-contrast">.02213</span>
        </div>
        <div className=" text-caption text-content-contrast">
          {t("common:balances.total-withdrawable-amount-detail")}
        </div>
      </div>
    </div>
  )
}

/* Tokens */
export const Tokens: FC<{
  currentToken: string
  setCurrentToken: (each: string) => void
  page?: "treasury" | "dashboard"
}> = ({ currentToken, setCurrentToken, page = "dashboard" }) => {
  const normalOverallActivityBalances = useAppSelector(
    (state) => state.transactions.overallActivity
  )
  const treasuryOverallActivityBalances = useAppSelector(
    (state) => state.treasury.treasuryOverallActivity
  )
  const tokenBalances =
    page === "treasury"
      ? treasuryOverallActivityBalances
      : normalOverallActivityBalances

  const tokenPrices = useAppSelector((state) => state.tokenDetails.prices)
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens)
  const { t } = useTranslation()
  const [show, toggle, setToggle] = useToggle(false)
  const tokensDropdownWrapperRef = useRef<HTMLDivElement>(null)
  //handle clicking outside
  useClickOutside(tokensDropdownWrapperRef, {
    onClickOutside: () => setToggle(false)
  })

  return (
    <div className="token p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="flex relative justify-between items-center gap-x-6">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          {t("common:balances.overall-activity")}
        </div>
        {/* Tokens  Dropdown*/}
        <div
          ref={tokensDropdownWrapperRef}
          className="flex bg-background-primary px-2 py-1 rounded-md overflow-x-auto"
        >
          <div
            className="cursor-pointer  flex items-center text-content-primary gap-1.5"
            onClick={() => {
              toggle()
            }}
          >
            {/* Icons here */}
            {currentToken && (
              <Token
                symbol={currentToken}
                className="w-4 h-4 text-content-primary"
              />
            )}
            <span className="text-content-primary">
              {currentToken ?? "SOL"}{" "}
            </span>
            <Icons.CheveronDownIcon className="text-base text-content-secondary" />
          </div>
          <TokensDropdwonDashboard
            tokens={tokenDetails}
            show={show}
            toggleShow={setToggle}
            setCurrentToken={(token) => setCurrentToken(token?.symbol)}
            className="top-8"
          />
        </div>
      </div>
      {/* Incoming */}
      {page === "dashboard" && (
        <div className="space-y-2">
          <div className="text-caption text-content-contrast font-semibold uppercase">
            {t("common:balances.total-incoming")}
          </div>
          <div className="flex flex-col space-y-0 5">
            <div className="flex gap-x-1">
              <Icons.ArrowDownLeftIcon className="text-base text-success-content mt-auto transform -translate-y-1" />
              <div className="text-heading-3 text-content-primary font-semibold">
                <span
                  data-tip={displayExponentialNumber(
                    (tokenPrices[currentToken] ?? 0) *
                      (tokenBalances[currentToken]?.incoming ?? 0)
                  )}
                >
                  {formatCurrency(
                    (tokenPrices[currentToken] ?? 0) *
                      (tokenBalances[currentToken]?.incoming ?? 0),
                    "$"
                  )}
                </span>
              </div>
            </div>
            <div className="text-subtitle-sm text-content-contrast ml-5">
              {tokenBalances[currentToken]?.incoming ?? 0} {currentToken}
            </div>
          </div>
        </div>
      )}
      {/* Outgoing */}
      <div className="space-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase">
          {t("common:balances.total-outgoing")}
        </div>
        <div className="flex flex-col space-y-0 5">
          <div className="flex gap-x-1">
            <Icons.ArrowUpRightIcon className="text-base text-error-content mt-auto transform -translate-y-1" />
            <div className=" text-heading-3 text-content-primary font-semibold">
              <span
                data-tip={displayExponentialNumber(
                  (tokenPrices[currentToken] ?? 0) *
                    (tokenBalances[currentToken]?.outgoing ?? 0)
                )}
              >
                {formatCurrency(
                  (tokenPrices[currentToken] ?? 0) *
                    (tokenBalances[currentToken]?.outgoing ?? 0),
                  "$"
                )}
              </span>
            </div>
          </div>
          <div className="text-subtitle-sm text-content-contrast ml-5">
            {tokenBalances[currentToken]?.outgoing ?? 0} {currentToken}
          </div>
        </div>
      </div>
      {/* Withdrawn */}
      {page === "treasury" && (
        <div className="space-y-2">
          <div className="text-caption text-content-contrast font-semibold uppercase">
            {t("common:balances.withdrawn")}
          </div>
          <div className="flex flex-col space-y-0 5">
            <div className="flex gap-x-1">
              <Icons.ArrowDownIcon className="text-base text-content-secondary mt-auto transform -translate-y-1" />
              <div className=" text-heading-3 text-content-primary font-semibold">
                <span
                  data-tip={displayExponentialNumber(
                    (tokenPrices[currentToken] ?? 0) *
                      (tokenBalances[currentToken]?.withdrawals ?? 0)
                  )}
                >
                  {formatCurrency(
                    (tokenPrices[currentToken] ?? 0) *
                      (tokenBalances[currentToken]?.withdrawals ?? 0),
                    "$"
                  )}
                </span>
              </div>
            </div>
            <div className="text-subtitle-sm text-content-contrast ml-5">
              {tokenBalances[currentToken]?.withdrawals ?? 0} {currentToken}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Activity This Week */
export const ActivityThisWeek: FC<{
  currentToken: string
  page?: "treasury" | "dashboard"
}> = ({ currentToken, page = "dashboard" }) => {
  const { t } = useTranslation()
  const normalWeeklyBalances = useAppSelector(
    (state) => state.transactions.weeklyActivity
  )
  const treasuryWeeklyBalances = useAppSelector(
    (state) => state.treasury.treasuryWeeklyActivity
  )
  const weeklyBalances =
    page === "treasury" ? treasuryWeeklyBalances : normalWeeklyBalances

  const tokenPrices = useAppSelector((state) => state.tokenDetails.prices)

  return (
    <div className="activity-this-week p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
        {t("common:balances.activity-this-week")}
      </div>
      <table>
        <tbody>
          {/* Incoming */}
          {page === "dashboard" && (
            <tr>
              <td className="pb-8">
                <div className="flex gap-x-1">
                  <Icons.ArrowDownLeftIcon className="text-base text-success-content" />
                  <div className="text-caption text-content-secondary font-semibold uppercase">
                    {t("common:balances.incoming")}
                  </div>
                </div>
              </td>
              <td className="pb-8">
                <Icons.IncomingActivityImg className="w-16 mx-auto" />
              </td>
              <td className="text-right pb-8">
                <div className="flex flex-col">
                  <div className=" text-subtitle-sm text-content-primary font-medium">
                    <span
                      data-tip={displayExponentialNumber(
                        (tokenPrices[currentToken] ?? 0) *
                          (weeklyBalances[currentToken]?.incoming ?? 0)
                      )}
                    >
                      {formatCurrency(
                        (tokenPrices[currentToken] ?? 0) *
                          (weeklyBalances[currentToken]?.incoming ?? 0),
                        "$"
                      )}
                    </span>
                  </div>
                  <div className=" text-subtitle-sm text-content-contrast">
                    {weeklyBalances[currentToken]?.incoming ?? 0} {currentToken}
                  </div>
                </div>
              </td>
            </tr>
          )}
          {/* Outgoing */}
          <tr>
            <td className="pb-8">
              <div className="flex gap-x-1">
                <Icons.ArrowUpRightIcon className="text-base text-error-content" />
                <div className="text-caption text-content-secondary font-semibold uppercase">
                  {t("common:balances.outgoing")}
                </div>
              </div>
            </td>
            <td className="pb-8">
              <Icons.OutgoingActivityImg className="w-16 mx-auto" />
            </td>
            <td className="text-right pb-8">
              <div className="flex flex-col">
                <div className=" text-subtitle-sm text-content-primary font-medium">
                  <span
                    data-tip={displayExponentialNumber(
                      (tokenPrices[currentToken] ?? 0) *
                        (weeklyBalances[currentToken]?.outgoing ?? 0)
                    )}
                  >
                    {formatCurrency(
                      (tokenPrices[currentToken] ?? 0) *
                        (weeklyBalances[currentToken]?.outgoing ?? 0),
                      "$"
                    )}
                  </span>
                </div>
                <div className=" text-subtitle-sm text-content-contrast">
                  {weeklyBalances[currentToken]?.outgoing ?? 0} {currentToken}
                </div>
              </div>
            </td>
          </tr>
          {/* Withdrawn */}
          {page === "treasury" && (
            <tr>
              <td>
                <div className="flex gap-x-1">
                  <Icons.ArrowDownIcon className="text-base text-content-secondary" />
                  <div className="text-caption text-content-secondary font-semibold uppercase">
                    {t("common:balances.withdrawn")}
                  </div>
                </div>
              </td>
              <td className="">
                <Icons.WithdrawnActivityImg className="w-16 mx-auto" />
              </td>
              <td className="text-right">
                <div className="flex flex-col">
                  <div className=" text-subtitle-sm text-content-primary font-medium">
                    <span
                      data-tip={displayExponentialNumber(
                        (tokenPrices[currentToken] ?? 0) *
                          (weeklyBalances[currentToken]?.withdrawals ?? 0)
                      )}
                    >
                      {formatCurrency(
                        (tokenPrices[currentToken] ?? 0) *
                          (weeklyBalances[currentToken]?.withdrawals ?? 0),
                        "$"
                      )}
                    </span>
                  </div>
                  <div className=" text-subtitle-sm text-content-contrast">
                    {weeklyBalances[currentToken]?.withdrawals ?? 0}{" "}
                    {currentToken}
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
