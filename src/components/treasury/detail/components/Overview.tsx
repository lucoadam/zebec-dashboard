import * as Icons from "assets/icons";
import React, { Fragment } from "react";
import Chart from "chart.js/auto";
import { Button, InputField } from "components/shared";
import { Tab } from "@headlessui/react";

const depositedAssets = [
  {
    symbol: "SOL",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
  {
    symbol: "USDC",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
  {
    symbol: "USDT",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    balance: 201320.72,
    balanceUSD: 201320.72,
  },
  {
    symbol: "ZBC",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/zebeczgi5fSEtbpfQKVZKCJ3WgYXxjkMUkNNx7fLKAF/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
  {
    symbol: "PUFF",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
  {
    symbol: "ALL",
    logoURI:
      "https://raw.githubusercontent.com/jamroszk/crypto/main/All_Logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
  {
    symbol: "WNZ",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/WNZzxM1WqWFH8DpDZSqr6EoHKWXeMx9NLLd2R5RzGPA/logo.png",
    balance: 24320,
    balanceUSD: 8543459.33,
  },
];

const Overview = () => {
  React.useEffect(() => {
    var config = {
      type: "line",

      data: {
        labels: ["", "", "", "", "", "", ""],
        datasets: [
          {
            label: "",
            backgroundColor: "hsl(252, 82.9%, 67.8%)",
            borderColor: "hsl(252, 82.9%, 67.8%)",
            data: [0, 10, 5, 2, 20, 30, 45],
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
      },
    };
    if (!window.myLine) {
      var ctx = document?.getElementById("line-chart")?.getContext("2d");
      window.myLine = new Chart(ctx, config);
    }
  }, []);
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
            Safe Balance
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
            ToTAL INCOMING
          </p>
          <p className="text-2xl items-center flex text-content-primary mt-[8px] font-semibold leading-10 mb-[25px]">
            <span className="leading-6 text-base uppercase font-normal text-content-success pr-[5px] pt-[5px]">
              <Icons.ArrowDownLeftIcon />
            </span>
            $809.05
          </p>
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            TOTAL OUTGOING
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
        <div className="w-full h-[280px] bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            ACTIVITY THIS WEEK
          </p>
          <div className="">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
      {/**
       * Second Column
       *   1. Deposited Assets
       * **/}
      <div className="flex-1 px-[24px]">
        <div className="w-full bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-4 text-xs uppercase font-semibold text-content-contrast">
            DEPOSITED ASSETS
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
                className="flex w-full h-[32px] mb-[20px] justify-between"
                key={item.symbol}
              >
                <div className="flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-[18px] h-[18px] mr-[15px]"
                    src={item.logoURI}
                    alt={item.symbol}
                  />
                  <div className="text-black">{item.symbol}</div>
                </div>

                <div>
                  <p className="text-sm leading-6 font-medium text-black text-right ">
                    $ 10,000,000
                  </p>
                  <p className="text-xs font-subtitle text-content-contrast text-right">
                    120,023.23 SOL
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
                    className={`w-1/2  pt-[16px] pb-[8px] outline-0 cursor-pointer ${
                      selected
                        ? "border-primary border-b-[3px] text-primary "
                        : "border-outline border-b-[1px] text-content-secondary "
                    } flex justify-center items-center`}
                  >
                    <Icons.ArrowDownLeftIcon className="w-[14px] h-[14px] mr-[12.17px]" />
                    Deposit
                  </div>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <div
                    className={`w-1/2  pt-[16px] pb-[8px] outline-0 cursor-pointer ${
                      selected
                        ? "border-primary border-b-[3px] text-primary "
                        : "border-outline border-b-[1px] text-content-secondary "
                    } flex justify-center items-center`}
                  >
                    <Icons.ArrowUpRightIcon className="w-[14px] h-[14px] mr-[12.17px]" />
                    Withdraw
                  </div>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className="px-[24px] mt-[24px]">
              <Tab.Panel>
                <div className="text-black">Item</div>
              </Tab.Panel>
              <Tab.Panel>
                <p className="leading-4 text-xs font-normal text-content-contrast">
                  Withdraw your deposited balance into your wallet.
                </p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        {/**
         * Zebec Treasury Help
         */}
        <div className="w-full bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-6 text-base font-semibold text-black mb-[8px]">
            Zebec Treasury Help
          </p>
          <p className="leading-5 text-sm font-normal text-content-contrast">
            Browse through our support articles or lets get in touch through
            Discord.
          </p>
          <div className="flex">
            <Button
              size="small"
              className="mt-[21px] mr-[8px]"
              title="Check FAQs"
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
            <Button
              size="small"
              className="mt-[21px]"
              title="Join Discord "
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
          </div>
        </div>
        {/**
         * Send Feedback
         */}
        <div className="w-full bg-background-secondary px-[24px] py-[24px] mb-[24px]">
          <p className="leading-6 text-base font-semibold text-black mb-[8px]">
            Send Feedback
          </p>
          <p className="leading-5 text-sm font-normal text-content-contrast">
            We’ll be pleased if you have suggestions on how to improve Zebec.
          </p>
          <div className="flex">
            <Button
              size="small"
              className="mt-[21px]"
              title="Send us a message"
              endIcon={<Icons.OutsideLinkIcon className="w-[8px]" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
