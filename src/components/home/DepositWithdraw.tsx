import React, { FC, useState } from "react";
import { Tab } from "components/shared";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import * as Icons from "assets/icons";

const tabs = [
  {
    title: "Deposit",
    icon: <Icons.ArrowDownLeftIcon />,
    count: 0,
    Component: <DepositTab />,
  },
  {
    title: "Withdraw",
    icon: <Icons.ArrowUpRightIcon />,
    count: 2,
    Component: <WithdrawTab />,
  },
];

const DepositWithdraw: FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <>
      <div className="rounded bg-background-secondary flex flex-col">
        <div className="flex border-b border-outline">
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.title}
                type="plain"
                title={`${tab.title}`}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                startIcon={tab.icon}
                className="w-1/2 pt-4 justify-center"
              />
            );
          })}
        </div>
        {/* Active Tab */}
        {tabs[activeTab].Component}
      </div>
    </>
  );
};

export default DepositWithdraw;
