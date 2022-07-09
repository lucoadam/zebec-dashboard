import React, { FC, useRef } from "react";
import { Button } from "./Button";
import { useClickOutside } from "hooks";
import * as Icons from "assets/icons";

interface WithdrawDepositInputProps {
  children: React.ReactNode;
  toggle: () => void;
  setToggle: (arg0: false) => void;
}

export const WithdrawDepositInput: FC<WithdrawDepositInputProps> = (props) => {
  const { children, toggle, setToggle } = props;
  const tokensDropdownWrapperRef = useRef<HTMLDivElement>(null);
  //handle clicking outside
  useClickOutside(tokensDropdownWrapperRef, {
    onClickOutside: () => setToggle(false),
  });

  return (
    <>
      <div className="">
        <label>Token</label>
        <div
          ref={tokensDropdownWrapperRef}
          className="pl-4.5 pr-6 py-2 flex items-center bg-background-primary border border-outline rounded-lg relative"
        >
          <div
            className="flex items-center gap-x-1.5 cursor-pointer"
            onClick={toggle}
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
};
