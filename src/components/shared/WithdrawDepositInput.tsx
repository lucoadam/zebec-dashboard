import React, { FC, Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
import * as Icons from "assets/icons";

interface WithdrawDepositInputProps {
  showDropdown: boolean;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const WithdrawDepositInput = React.forwardRef<
  HTMLDivElement,
  WithdrawDepositInputProps
>((props, ref) => {
  const { showDropdown, setShowDropdown, children } = props;

  //handle Dropdown
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="">
        <label>Token</label>
        <div
          ref={ref}
          className="pl-4.5 pr-6 py-2 flex items-center bg-background-primary border border-outline rounded-lg relative"
        >
          <div
            className="flex items-center gap-x-1.5 cursor-pointer"
            onClick={handleDropdown}
          >
            {/* Icons here */}
            <div className="w-5 h-5 bg-background-secondary"></div>
            <div className="flex items-center text-body text-content-primary">
              SOL{" "}
              <Icons.CheveronDownIcon className="text-base text-content-secondary" />
            </div>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              className="!pl-4 !text-body !leading-6 !border-none !focus:outline-0 !ring-0 w-full"
              placeholder="Enter Amount"
            />
            <Button
              title="MAX"
              size="small"
              className="absolute top-0 right-0"
            />
          </div>
          {/* Tokens Dropdown Children */}
          {children}
        </div>
      </div>
    </>
  );
});
