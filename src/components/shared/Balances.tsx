import * as Icons from "assets/icons"
import { tokenBalances, weeklyBalances } from "fakedata"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { formatCurrency } from "utils"
import { Button } from "./Button"

/* Deposited Balance */
export const DepositedBalance: FC = () => {
  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
        DEPOSITED BALANCE
      </div>
      <div>
        <div className=" text-heading-3 text-content-primary font-semibold">
          $15,390,832
          <span className=" text-subtitle text-content-contrast">.02213</span>
        </div>
        <p className="text-xs font-normal leading-3 text-content-contrast">
          120,023.23 SOL
        </p>
      </div>
    </div>
  )
}

/* Total Withdrawable Amount */
export const TotalWithdrawableAmount: FC = () => {
  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
          TOTAL WITHDRAWABLE AMOUNT
        </div>
        <Button size="small" title="View" endIcon={<Icons.ArrowRightIcon />} />
      </div>
      <div className="space-y-4">
        <div className=" text-heading-3 text-content-primary font-semibold">
          $832
          <span className=" text-subtitle text-content-contrast">.02213</span>
        </div>
        <div className=" text-caption text-content-contrast">
          Whenever you receive money, you have to individually withdraw it from
          each transaction. Go to incoming tab to perform withdrawal.
        </div>
      </div>
    </div>
  )
}

/* Tokens */
export const Tokens: FC<{
  currentToken: keyof typeof tokenBalances
  setCurrentToken: (each: keyof typeof tokenBalances) => void
}> = ({ currentToken, setCurrentToken }) => {
  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6 overflow-hidden">
      <div className="flex justify-between items-center gap-x-6">
        <div className="text-caption text-content-contrast font-semibold uppercase tracking-1 transform -translate-y-1.5">
          TOKEN
        </div>
        {/* Tokens */}
        <div className="flex gap-x-2 overflow-x-auto pb-1">
          {Object.keys(tokenBalances).map((each) => (
            <button
              key={each}
              onClick={() => {
                setCurrentToken(each as keyof typeof tokenBalances)
              }}
              className={twMerge(
                "text-caption min-w-max text-content-primary font-medium px-2 py-0.5 rounded-2xl",
                currentToken === each ? "bg-primary" : "bg-background-light"
              )}
            >
              {each}
            </button>
          ))}
        </div>
      </div>
      {/* Incoming */}
      <div className="space-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase">
          TOTAL INCOMING
        </div>
        <div className="flex gap-x-1">
          <Icons.ArrowDownLeftIcon className="text-base text-success-content mt-auto transform -translate-y-1" />
          <div className="text-heading-3 text-content-primary font-semibold">
            {formatCurrency(tokenBalances[currentToken]?.incoming ?? 0, "$")}
          </div>
        </div>
      </div>
      {/* Outgoing */}
      <div className="space-y-2">
        <div className="text-caption text-content-contrast font-semibold uppercase">
          TOTAL OUTGOING
        </div>
        <div className="flex gap-x-1">
          <Icons.ArrowUpRightIcon className="text-base text-error-content mt-auto transform -translate-y-1" />
          <div className=" text-heading-3 text-content-primary font-semibold">
            {formatCurrency(tokenBalances[currentToken]?.outgoing ?? 0, "$")}
          </div>
        </div>
      </div>
    </div>
  )
}

/* Activity This Week */
export const ActivityThisWeek: FC<{
  currentToken: keyof typeof weeklyBalances
}> = ({ currentToken }) => {
  return (
    <div className="p-6 rounded bg-background-secondary flex flex-col gap-y-6">
      <div className="text-caption text-content-contrast font-semibold uppercase tracking-1">
        ACTIVITY THIS WEEK
      </div>
      <table>
        <tbody>
          {/* Incoming */}
          <tr>
            <td className="pb-8">
              <div className="flex gap-x-1">
                <Icons.ArrowDownLeftIcon className="text-base text-success-content" />
                <div className="text-caption text-content-secondary font-semibold uppercase">
                  INCOMING
                </div>
              </div>
            </td>
            <td className="pb-8">
              <Icons.IncomingActivityImg className="w-16 mx-auto" />
            </td>
            <td className="text-right pb-8">
              <div className="flex flex-col">
                <div className=" text-subtitle-sm text-content-primary font-medium">
                  {formatCurrency(
                    weeklyBalances[currentToken]?.incoming ?? 0,
                    "$"
                  )}
                </div>
                <div className=" text-subtitle-sm text-content-contrast">
                  140.59 {currentToken}
                </div>
              </div>
            </td>
          </tr>
          {/* Outgoing */}
          <tr>
            <td className="pb-8">
              <div className="flex gap-x-1">
                <Icons.ArrowUpRightIcon className="text-base text-error-content" />
                <div className="text-caption text-content-secondary font-semibold uppercase">
                  OUTGOING
                </div>
              </div>
            </td>
            <td className="pb-8">
              <Icons.OutgoingActivityImg className="w-16 mx-auto" />
            </td>
            <td className="text-right pb-8">
              <div className="flex flex-col">
                <div className=" text-subtitle-sm text-content-primary font-medium">
                  {formatCurrency(
                    weeklyBalances[currentToken]?.outgoing ?? 0,
                    "$"
                  )}
                </div>
                <div className=" text-subtitle-sm text-content-contrast">
                  140.59 {currentToken}
                </div>
              </div>
            </td>
          </tr>
          {/* Withdrawn */}
          <tr>
            <td>
              <div className="flex gap-x-1">
                <Icons.ArrowDownIcon className="text-base text-content-secondary" />
                <div className="text-caption text-content-secondary font-semibold uppercase">
                  WITHDRAWN
                </div>
              </div>
            </td>
            <td className="">
              <Icons.WithdrawnActivityImg className="w-16 mx-auto" />
            </td>
            <td className="text-right">
              <div className="flex flex-col">
                <div className=" text-subtitle-sm text-content-primary font-medium">
                  {formatCurrency(
                    weeklyBalances[currentToken]?.withdrawn ?? 0,
                    "$"
                  )}
                </div>
                <div className=" text-subtitle-sm text-content-contrast">
                  140.59 {currentToken}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
