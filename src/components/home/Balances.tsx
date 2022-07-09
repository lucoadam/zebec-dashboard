import React, { FC } from "react";
import {
  ActivityThisWeek,
  DepositedBalance,
  Tokens,
  TotalWithdrawableAmount,
} from "components/shared";

const Balances: FC = () => {
  return (
    <>
      {/* Deposited Balance */}
      <DepositedBalance />
      {/* Total Withdrawable Amount */}
      <TotalWithdrawableAmount />
      {/* Tokens */}
      <Tokens />
      {/* Activity This Week */}
      <ActivityThisWeek />
    </>
  );
};

export default Balances;
