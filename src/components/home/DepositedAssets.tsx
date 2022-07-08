import React, { FC } from "react";
import { DepositedTokenAssets } from "components/shared";

const DepositedAssets: FC = () => {
  return (
    <>
      <div className="p-6 rounded bg-background-secondary h-[528px]">
        <DepositedTokenAssets />
      </div>
    </>
  );
};

export default DepositedAssets;
