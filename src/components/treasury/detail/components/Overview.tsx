import { useAppSelector } from "app/hooks";
import * as Icons from "assets/icons";
import ActivityDeopsitCurve from "assets/images/treasury/activity/activity1.svg";
import ActivityOutgoingCurve from "assets/images/treasury/activity/activity2.svg";
import ActivityWithdrawalCurve from "assets/images/treasury/activity/activity3.svg";
import { Button, InputField, Tab } from "components/shared";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { formatCurrency } from "utils";
import { getBalance, getUsdBalance } from "utils/getBalance";
import { Deposit } from "./Deposit";
import { Withdrawal } from "./Withdrawal";

const fundTransferTabs = [
  {
    title: "Deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <Deposit />,
  },
  {
    title: "Withdrawal",
    icon: <Icons.ArrowUpRightIcon />,
    count: 0,
    Component: <Withdrawal />,
  },
];

const Overview = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");

  const [activePage, setActivePage] = useState<number>(0);
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens);
  const treasuryTokens =
    useAppSelector((state) => state.treasuryBalance.treasury?.tokens) || [];
  const filterTokens = () => {
    if (search !== "")
      return tokenDetails.filter((item) =>
        item.symbol.toLowerCase().includes(search)
      );
    return tokenDetails;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="pr-3 flex flex-col justify-between">
        {/**
         * Safe Balance
         */}
        <div className="rounded-[4px] w-full h-[144px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:safe-balance")}
          </p>
          <p className="text-heading-3 text-content-primary mt-[8px] font-semibold">
            $15,390,832
            <span className="leading-6 text-base uppercase font-normal text-content-contrast">
              .013
            </span>
          </p>
          <p className="text-xs font-normal leading-3 text-content-contrast">
            120,023.23 SOL
          </p>
        </div>
        {/**
         * Incoming/ Outgoing
         */}
        <div className="rounded-[4px] w-full h-[194px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:total-incoming")}
          </p>
          <p className="text-2xl items-center flex text-content-primary mt-[8px] font-semibold leading-10 mb-[25px]">
            <span className="leading-6 text-base uppercase font-normal text-content-success pr-[5px] pt-[5px]">
              <Icons.ArrowDownLeftIcon />
            </span>
            $809.05
          </p>
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:total-outgoing")}
          </p>
          <p className="flex items-center text-2xl text-content-primary mt-[8px] font-semibold leading-10">
            <span className="leading-6  text-base uppercase font-normal text-content-error pr-[5px] pt-[5px]">
              <Icons.ArrowUpRightIcon />
            </span>
            $2,230.23
          </p>
        </div>
        {/**
         * Activity this week
         */}
        <div className="rounded-[4px] w-full bg-background-secondary px-[24px] py-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:activity-this-week")}
          </p>
          {/* <canvas id="line-chart" className="w-[40px]"></canvas> */}
          <div className="overflow-x-auto bg-background-secondary pr-0.5">
            <table className="table-auto w-full border-separate border-spacing-y-[24px]">
              <tbody>
                <tr>
                  <td>
                    <div className="flex text-content-secondary font-semibold uppercase text-caption">
                      <span className="leading-6 text-xs uppercase font-normal text-content-success pr-[5px] pt-[2px]">
                        <Icons.ArrowDownLeftIcon />
                      </span>
                      {t("treasuryOverview:incoming")}
                    </div>
                  </td>
                  <td>
                    <ActivityDeopsitCurve className="w-[72px]" />
                  </td>
                  <td>
                    <p className="text-sm leading-6 font-medium text-content-primary text-right ">
                      {formatCurrency(12321321312, "$")}
                    </p>
                    <p className="text-xs font-subtitle text-content-contrast text-right">
                      {formatCurrency(23423423)} SOL
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex text-content-secondary uppercase text-caption font-semibold">
                      <span className="leading-6 text-base uppercase font-normal text-content-error pr-[5px] pt-[2px]">
                        <Icons.ArrowUpRightIcon />
                      </span>
                      {t("treasuryOverview:outgoing")}
                    </div>
                  </td>
                  <td>
                    <ActivityOutgoingCurve className="w-[72px]" />
                  </td>
                  <td>
                    <p className="text-sm leading-6 font-medium text-content-primary text-right ">
                      {formatCurrency(12321321312, "$")}
                    </p>
                    <p className="text-xs font-subtitle text-content-contrast text-right">
                      {formatCurrency(23423423)} SOL
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex text-content-secondary uppercase text-caption font-semibold">
                      <span className=" text-content-secondary pr-[7px] pt-[5px]">
                        <Icons.DownArrowIcon className="w-3 h-2.5" />
                      </span>
                      {t("treasuryOverview:withdrawal")}
                    </div>
                  </td>
                  <td>
                    <ActivityWithdrawalCurve className="w-[72px]" />
                  </td>
                  <td>
                    <p className="text-sm leading-6 font-medium text-content-primary text-right ">
                      {formatCurrency(12321321312, "$")}
                    </p>
                    <p className="text-xs font-subtitle text-content-contrast text-right">
                      {formatCurrency(23423423)} SOL
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div className="md:pr-3">
        <div className="w-full rounded-[4px] bg-background-secondary h-full px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:deposited-assets")}
          </p>
          <InputField className="h-[36px] my-[24px] relative" error={false}>
            <div>
              <Icons.SearchIcon className="absolute left-2.5 top-[11px] text-content-primary" />
              <input
                className="w-full h-[36px]"
                value={search}
                placeholder="Search token"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                type="text"
              />
            </div>
          </InputField>
          <div className="h-[512px] overflow-auto pr-2">
            {filterTokens().length === 0 && (
              <p className="text-body font-normal text-content-contrast">
                No tokens found
              </p>
            )}
            {filterTokens().map((item) => (
              <div
                className="flex w-full h-[32px] mb-[24px] justify-between"
                key={item.symbol}
              >
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="w-[32px] h-[32px] flex justify-center items-center rounded-[8px] mr-[8px] bg-background-primary">
                    <img
                      className="w-[18px] h-[18px]"
                      src={item.image}
                      alt={item.symbol}
                    />
                  </div>
                  <div className="text-content-primary">{item.symbol}</div>
                </div>

                <div>
                  <p className="text-sm leading-6 font-medium text-content-primary text-right ">
                    {formatCurrency(
                      getBalance(treasuryTokens, item.symbol),
                      "$"
                    )}
                  </p>
                  <p className="text-xs font-subtitle text-content-contrast text-right">
                    {formatCurrency(getUsdBalance(treasuryTokens, item.symbol))}{" "}
                    {item.symbol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:pt-5 lg:pt-0 md:pr-3 flex flex-col justify-between">
        {/**
         * Deposit and Withdrawal
         */}
        <div className="w-full pt-3 rounded bg-background-secondary mb-6">
          <div className="flex">
            {fundTransferTabs.map((fundTranfer, index) => {
              return (
                <Tab
                  key={fundTranfer.title}
                  type="plain"
                  className="w-1/2"
                  title={`${t(
                    `treasuryOverview:${fundTranfer.title.toLowerCase()}`
                  )}`}
                  isActive={activePage === index}
                  startIcon={fundTranfer.icon}
                  count={fundTranfer.count}
                  onClick={() => setActivePage(index)}
                />
              );
            })}
          </div>
          <div className="px-[24px] mt-[24px] pb-[24px] min-h-[210px]">
            {fundTransferTabs[activePage].Component}
          </div>
        </div>
        {/**
         * Zebec Treasury Help
         */}
        <div className="w-full rounded-[4px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-6 text-base font-semibold text-content-primary mb-[8px]">
            {t("treasuryOverview:treasury-help")}
          </p>
          <p className="leading-5 text-sm font-normal text-content-contrast">
            {t("treasuryOverview:treasury-help-description")}
          </p>
          <div className="flex">
            <Button
              size="small"
              className="mt-[21px] mr-[8px]"
              title={t("treasuryOverview:check-faq")}
              endIcon={
                <Icons.OutsideLinkIcon className="text-content-contrast" />
              }
            />
            <Button
              size="small"
              className="mt-[21px]"
              title={t("treasuryOverview:join-discord")}
              endIcon={
                <Icons.OutsideLinkIcon className="text-content-contrast" />
              }
            />
          </div>
        </div>
        {/**
         * Send Feedback
         */}
        <div className="w-full rounded-[4px] bg-background-secondary px-[24px] pt-[24px] pb-[28px]">
          <p className="leading-6 text-base font-semibold text-content-primary mb-[8px]">
            {t("treasuryOverview:send-feedback")}
          </p>
          <p className="leading-5 text-sm font-normal text-content-contrast">
            {t("treasuryOverview:feedback-description")}
          </p>
          <div className="flex">
            <Button
              size="small"
              className="mt-[21px]"
              title={t("treasuryOverview:send-us-message")}
              endIcon={
                <Icons.OutsideLinkIcon className="text-content-contrast" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
