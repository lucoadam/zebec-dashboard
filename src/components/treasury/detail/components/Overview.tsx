import * as Icons from "assets/icons";
import React, { Fragment, useRef, useState } from "react";
import { Button, InputField, CollapseDropdown } from "components/shared";
import { Tab } from "@headlessui/react";
import { formatCurrency } from "utils";
import ActivityDeopsitCurve from "assets/images/treasury/activity/activity1.svg";
import ActivityOutgoingCurve from "assets/images/treasury/activity/activity2.svg";
import ActivityWithdrawalCurve from "assets/images/treasury/activity/activity3.svg";
import { useClickOutside } from "hooks";
import { useTranslation } from "next-i18next";

const depositedAssets = [
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

interface TokenDetails {
  symbol: string;
  logoURI: string;
  balance: number;
  balanceUSD: number;
}

const Overview = () => {
  const { t } = useTranslation();
  const tokensDropdownWrapper = useRef(null);
  const [searchData,setSearchData] = useState("");

  const [toggleTokensDropdown, setToggleTokensDropdown] =
    useState<boolean>(false);

  const [currentToken, setCurrentToken] = useState<TokenDetails>(
    depositedAssets[0]
  );

  const handleClose = () => {
    setToggleTokensDropdown(false);
  };

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleClose,
  });

  return (
    <div className="flex w-full justify-start">
      {/**
       * First Column
       *    1. Safe Balance
       *    2. Incoming/ Outgoing
       *    3. Activity this Week
       */}
      <div className="w-[357px]">
        {/**
         * Safe Balance
         */}
        <div className="w-full h-[144px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:safe-balance")}
          </p>
          <p className="text-2xl text-content-primary mt-[8px] font-semibold leading-10">
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
        <div className="w-full h-[194px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
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
        <div className="w-full bg-background-secondary px-[24px] py-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:activity-this-week")}
          </p>
          {/* <canvas id="line-chart" className="w-[40px]"></canvas> */}
          <div className="w-full  bg-background-secondary max-h-[310px] pr-0.5 overflow-y-scroll">
            <table className="table-auto w-full border-separate border-spacing-y-[24px]">
              <tbody>
                <tr>
                  <td>
                    <div className="flex text-content-secondary">
                      <span className="leading-6 text-base uppercase font-normal text-content-success pr-[5px] pt-[2px]">
                        <Icons.ArrowDownLeftIcon />
                      </span>
                      {t("treasuryOverview:incoming")}
                    </div>
                  </td>
                  <td>
                    <ActivityDeopsitCurve className="w-[72px]" />
                  </td>
                  <td>
                    <p className="text-sm leading-6 font-medium text-black text-right ">
                      {formatCurrency(12321321312, "$")}
                    </p>
                    <p className="text-xs font-subtitle text-content-contrast text-right">
                      {formatCurrency(23423423)} SOL
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex text-content-secondary">
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
                    <p className="text-sm leading-6 font-medium text-black text-right ">
                      {formatCurrency(12321321312, "$")}
                    </p>
                    <p className="text-xs font-subtitle text-content-contrast text-right">
                      {formatCurrency(23423423)} SOL
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="flex text-content-secondary">
                      <span className=" text-content-secondary pr-[7px] pt-[5px]">
                        <Icons.DownArrowIcon className="w-[12px] h-[10px]" />
                      </span>
                      {t("treasuryOverview:withdrawal")}
                    </div>
                  </td>
                  <td>
                    <ActivityWithdrawalCurve className="w-[72px]" />
                  </td>
                  <td>
                    <p className="text-sm leading-6 font-medium text-black text-right ">
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
      <div className="flex-1 px-[24px]">
        <div className="w-full bg-background-secondary h-full px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            {t("treasuryOverview:deposited-assets")}
          </p>
          <InputField className="h-[36px] my-[24px] relative" error={false}>
            <div>
              <Icons.SearchIcon className="absolute left-[10px] top-[11px] text-black" />
              <input
                className="w-full h-[36px]"
                placeholder="Search token"
                type="text"
              />
            </div>
          </InputField>
          <div className="max-h-[400px] overflow-y-scroll pr-2">
            {depositedAssets.map((item) => (
              <div
                className="flex w-full h-[32px] mb-[24px] justify-between"
                key={item.symbol}
              >
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="w-[32px] h-[32px] flex justify-center items-center rounded-[8px] mr-[8px] bg-white">
                    <img
                      className="w-[18px] h-[18px]"
                      src={item.logoURI}
                      alt={item.symbol}
                    />
                  </div>
                  <div className="text-black">{item.symbol}</div>
                </div>

                <div>
                  <p className="text-sm leading-6 font-medium text-black text-right ">
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
      <div className="w-[357px]">
        {/**
         * Deposit and Withdrawal
         */}
        <div className="w-full bg-background-secondary mb-[24px]">
          <Tab.Group>
            <Tab.List className="flex">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <div
                    className={`w-1/2  pt-[16px] pb-[8px] outline-0 cursor-pointer ${selected
                      ? "border-primary border-b-[3px] text-primary "
                      : "border-outline border-b-[1px] text-content-secondary "
                      } flex justify-center items-center`}
                  >
                    <Icons.ArrowDownLeftIcon className="w-[14px] h-[14px] mr-[12.17px]" />
                    {t("treasuryOverview:deposit")}
                  </div>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <div
                    className={`w-1/2  pt-[16px] pb-[8px] outline-0 cursor-pointer ${selected
                      ? "border-primary border-b-[3px] text-primary "
                      : "border-outline border-b-[1px] text-content-secondary "
                      } flex justify-center items-center`}
                  >
                    <Icons.ArrowUpRightIcon className="w-[14px] h-[14px] mr-[12.17px]" />
                    {t("treasuryOverview:withdraw")}
                  </div>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="px-[24px] mt-[24px] pb-[24px] min-h-[270px]">
              <Tab.Panel>
                <p className="leading-4 text-xs font-normal text-content-contrast">
                  {t("treasuryOverview:deposit-description")}
                </p>
              </Tab.Panel>
              <Tab.Panel>
                <p className="leading-4 text-xs font-normal text-content-contrast mb-[24px]">
                  {t("treasuryOverview:withdraw-description")}
                </p>
                <InputField
                  label={t("treasuryOverview:token")}
                  className="mb-[24px] relative text-black"
                  error={false}
                >
                  <div>
                    <div
                      onClick={() => setToggleTokensDropdown((prev) => !prev)}
                      className="absolute absolute left-[10px] top-[8px]"
                    >
                      <div className="relative flex cursor-pointer  w-[80px] justify-center items-center h-[40px] text-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-[18px] h-[18px]"
                          src={currentToken.logoURI}
                          alt={currentToken.symbol}
                        />
                        <div className="max-w-[60px] ml-[5px] overflow-x-hidden text-black">
                          {currentToken.symbol}
                        </div>
                        <Icons.CheveronDownIcon className="text-sm w-[28px]" />


                      </div>

                    </div>
                    <CollapseDropdown
                      ref={tokensDropdownWrapper}
                      className="w-full left-[0px] max-h-40  overflow-auto mt-5 "
                      show={toggleTokensDropdown}
                      variant="light"
                    >
                      <div className="">
                        <Icons.SearchIcon className="absolute left-[10px] top-[11px] text-black" />
                        <input
                          className="w-full h-[32px] bg-background-primary"
                          placeholder="Search token"
                          type="text"
                          onChange={(e)=>setSearchData(e.target.value)}
                        />
                        



                          {depositedAssets.filter(depositedAsset => depositedAsset.symbol.includes(searchData.toUpperCase())).map((item) => (
                            <div
                              key={item.symbol}
                              onClick={(event) => {
                                event.stopPropagation();
                                setToggleTokensDropdown(false);
                                setCurrentToken(item);
                              }}
                              className="border-b-[1px] border-outline px-[10px] flex cursor-pointer overflow-hidden py-6 px-5 justify-start items-center hover:bg-background-light h-[40px]"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                className="w-[18px] h-[18px] mr-[12px]  text-content-primary"
                                src={item.logoURI}
                                alt={item.symbol}
                              />
                              <div>
                                <div className="text-black ">{item.symbol}</div>
                                <div className="text-caption text-content-tertiary">
                                  {item.name}
                                </div>
                              </div>

                              <div className="ml-auto text-caption  text-content-secondary">
                                {item.value} {item.symbol}
                              </div>
                            </div>
                          ))}
                        </div>
                      
                    </CollapseDropdown>



                    <input
                      className="w-full h-[56px] pl-[120px] is-amount"
                      placeholder={t("treasuryOverview:enter-amount")}
                      type="number"
                      min="0"
                    />
                    <Button
                      size="small"
                      title={t("treasuryOverview:max")}
                      className="h-[40px] absolute right-[10px] top-[8px] text-black"
                    />
                  </div>
                </InputField>
                <Button
                  className="w-full mb-[12px]"
                  variant="gradient"
                  title={t("treasuryOverview:withdraw")}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        {/**
         * Zebec Treasury Help
         */}
        <div className="w-full bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-6 text-base font-semibold text-black mb-[8px]">
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
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
            <Button
              size="small"
              className="mt-[21px]"
              title={t("treasuryOverview:join-discord")}
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
          </div>
        </div>
        {/**
         * Send Feedback
         */}
        <div className="w-full bg-background-secondary px-[24px] pt-[24px] pb-[28px]">
          <p className="leading-6 text-base font-semibold text-black mb-[8px]">
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
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Overview;
