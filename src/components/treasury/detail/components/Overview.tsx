import * as Icons from "assets/icons";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button, InputField, CollapseDropdown, Tab } from "components/shared";
import { Tab as Tabs } from "@headlessui/react";
import { formatCurrency } from "utils";
import ActivityDeopsitCurve from "assets/images/treasury/activity/activity1.svg";
import ActivityOutgoingCurve from "assets/images/treasury/activity/activity2.svg";
import ActivityWithdrawalCurve from "assets/images/treasury/activity/activity3.svg";
import { useClickOutside } from "hooks";
import { useTranslation } from "next-i18next";
import { Deposit } from "./Deposit";
import { Withdrawal } from "./Withdrawal";

export const depositedAssets = [
  {
    name: "Solana",
    symbol: "SOL",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.5,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.9,
  },
  {
    name: "Tether",
    symbol: "USDT",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    balance: 201320.72,
    balanceUSD: 201320.72,
    value: 0.5,
  },
  {
    name: "Zebec Protocol",
    symbol: "ZBC",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/zebeczgi5fSEtbpfQKVZKCJ3WgYXxjkMUkNNx7fLKAF/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.6,
  },
  {
    name: "Puff",
    symbol: "PUFF",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.5,
  },
  {
    name: "All",
    symbol: "ALL",
    logoURI:
      "https://raw.githubusercontent.com/jamroszk/crypto/main/All_Logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.5,
  },
  {
    name: "Winerz",
    symbol: "WNZ",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/WNZzxM1WqWFH8DpDZSqr6EoHKWXeMx9NLLd2R5RzGPA/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
    value: 0.1,
  },
];

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

export interface TokenDetails {
  symbol: string;
  logoURI: string;
  balance: number;
  balanceUSD: number;
}

const Overview = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");

  const [activePage, setActivePage] = useState<number>(0);

  const filterTokens = () => {
    if (search !== "")
      return depositedAssets.filter((item) =>
        item.symbol.toLowerCase().includes(search)
      );
    return depositedAssets;
  };

  return (
    <div className="flex flex-wrap md:flex-no-wrap w-full md-justify-start sm:justify-center">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="sm:w-1 md:w-1/3 pr-[12px] flex flex-col justify-between">
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
          <div className="w-full  bg-background-secondary pr-0.5">
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
      <div className="sm:w-1 md:w-1/3 px-[12px]">
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
          <div className="pr-2">
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
                      src={item.logoURI}
                      alt={item.symbol}
                    />
                  </div>
                  <div className="text-content-primary">{item.symbol}</div>
                </div>

                <div>
                  <p className="text-sm leading-6 font-medium text-content-primary text-right ">
                    {formatCurrency(item.balance, "$")}
                  </p>
                  <p className="text-xs font-subtitle text-content-contrast text-right">
                    {formatCurrency(item.balanceUSD)} {item.symbol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sm:w-1 md:w-1/3 pl-[12px] flex flex-col justify-between">
        {/**
         * Deposit and Withdrawal
         */}
        <div className="w-full rounded-[4px] pl-[8px]  bg-background-secondary mb-[24px]">
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
