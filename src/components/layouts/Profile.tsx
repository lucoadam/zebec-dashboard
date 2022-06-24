import React, { FC, useState, useRef } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { toSubstring } from "../../utils";
import { Button, IconButton, CollapseDropdown } from "../shared";
import * as Images from "../../assets/images";
import * as Icons from "../../assets/icons";
//hooks
import { useClickOutside } from "../../hooks";

const Profile: FC = () => {
  const useWalletObject = useWallet();
  const useWalletModalObject = useWalletModal();
  const profileDropdownWrapperRef = useRef(null);

  const [toggleProfileDropdown, setToggleProfileDropdown] =
    useState<boolean>(false);

  const handleClose = () => {
    setToggleProfileDropdown(false);
  };

  //handle clicking outside
  useClickOutside(profileDropdownWrapperRef, {
    onClickOutside: handleClose,
  });

  //handle change wallet
  const handleChangeWallet = () => {
    useWalletModalObject.setVisible(!useWalletModalObject.visible);
    handleClose();
  };

  //handle disconnect wallet
  const handleDisconnectWallet = () => {
    useWalletObject.disconnect();
    handleClose();
  };

  return (
    <>
      <div className="relative" ref={profileDropdownWrapperRef}>
        {/* Active Profile */}
        <button
          type="button"
          className={`pl-1 py-1 rounded-lg transition duration-300 focus:outline-0 ${
            !toggleProfileDropdown &&
            "hover:bg-background-secondary focus:bg-background-secondary"
          }`}
          onClick={() => setToggleProfileDropdown(!toggleProfileDropdown)}
        >
          <div className="flex gap-x-2">
            <Image src={Images.Avatar1} layout="fixed" width={32} height={32} />
            <div className="flex items-center gap-x-3">
              <div className="flex flex-col items-start justify-between h-full">
                <div className="text-avatar-title font-medium text-content-primary">
                  {toSubstring(useWalletObject?.publicKey?.toString(), 4, true)}
                </div>
                <div className="text-caption leading-[14px] text-content-contrast whitespace-nowrap">
                  {useWalletObject?.wallet?.adapter.name} Wallet
                </div>
              </div>
              <Icons.CheveronDownIcon className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </button>
        {/* Profile Dropdown */}
        <CollapseDropdown
          show={toggleProfileDropdown}
          className="top-12 w-[306px]"
        >
          <div className="px-6 pt-7 pb-8 flex flex-col gap-y-6">
            <div className="flex gap-x-2 ml-4">
              <Image
                src={Images.Avatar1}
                layout="fixed"
                width={32}
                height={32}
              />
              <div className="flex items-start gap-x-3">
                <div className="flex flex-col justify-between h-full">
                  <div className="text-avatar-title font-medium text-content-primary">
                    {toSubstring(
                      useWalletObject?.publicKey?.toString(),
                      6,
                      true,
                    )}
                  </div>
                  <div className="text-caption leading-[14px] text-content-contrast whitespace-nowrap">
                    {useWalletObject?.wallet?.adapter.name} Wallet
                  </div>
                </div>
                <div className="transform -translate-y-1">
                  <IconButton icon={<Icons.CopyIcon />} />
                </div>
              </div>
            </div>
            <div>
              <Button
                title="Change Wallet"
                startIcon={<Icons.RefreshIcon />}
                className="w-full mb-3"
                onClick={handleChangeWallet}
              />
              <Button
                title="Disconnect Wallet"
                startIcon={<Icons.DisconnectIcon />}
                className="w-full"
                onClick={handleDisconnectWallet}
              />
            </div>
          </div>
        </CollapseDropdown>
      </div>
    </>
  );
};

export default Profile;
