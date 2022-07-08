import React, { FC, useState, useRef } from "react";
import {
  Button,
  TokensDropdown,
  WithdrawDepositInput,
} from "components/shared";
import { useClickOutside } from "hooks";

const WithdrawTab: FC = () => {
  const [showTokensDropdown, setShowTokensDropdown] = useState<boolean>(false);

  const tokensDropdownWrapperRef = useRef<HTMLDivElement>(null);

  //handle clicking outside
  useClickOutside(tokensDropdownWrapperRef, {
    onClickOutside: () => setShowTokensDropdown(false),
  });

  return (
    <div className="px-6 pt-6 pb-8 flex flex-col gap-y-6">
      <div className="text-caption text-content-tertiary">
        Withdraw your deposited balance into your wallet.
      </div>
      <form className="flex flex-col gap-y-6">
        <WithdrawDepositInput
          showDropdown={showTokensDropdown}
          setShowDropdown={setShowTokensDropdown}
          ref={tokensDropdownWrapperRef}
        >
          {/* Tokens Dropdown */}
          <TokensDropdown show={showTokensDropdown} />
        </WithdrawDepositInput>

        <Button
          title="Withdraw"
          variant="gradient"
          onClick={() => {}}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default WithdrawTab;
