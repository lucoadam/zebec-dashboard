import React, { FC } from "react";
import { Button } from "components/shared";

const DepositTab: FC = () => {
  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        Deposit balance into your wallet.
      </div>
      <Button
        title="Deposit"
        variant="gradient"
        onClick={() => {}}
        className="w-full"
      />
    </div>
  );
};

export default DepositTab;
