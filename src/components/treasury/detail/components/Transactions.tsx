import { Tab } from "components/shared";
import * as Icons from "assets/icons";
import { Fragment, useState } from "react";
import { ScheduledTransactions } from "./ScheduledTransactions";
import { WithdrawalTransactions } from "./WithdrawalTransactions";
import { HistoryTransactions } from "./HistoryTransactions";

const transactionTabs = [
  {
    title: "Scheduled",
    count: 0,
    Component: <ScheduledTransactions />,
  },
  {
    title: "History",
    count: 0,
    Component: <HistoryTransactions />,
  },
  {
    title: "Withdrawals",
    count: 0,
    Component: <WithdrawalTransactions />,
  },
];

export const Transactions = () => {
  const [activePage, setActivePage] = useState<number>(0);

  return (
    <div className="w-full">
      <div className="flex justify-start border-b border-outline">
        {/* Tabs */}
        {transactionTabs.map((transactionTab, index) => {
          return (
            <Tab
              className="capitalize"
              key={transactionTab.title}
              type="plain"
              title={`${transactionTab.title.toLowerCase()}`}
              isActive={activePage === index}
              count={transactionTab.count}
              onClick={() => setActivePage(index)}
            />
          );
        })}
      </div>
      <div className="py-10">
          {/* Active Tab */}
          {transactionTabs[activePage].Component}
        </div>
    </div>
  );
};
