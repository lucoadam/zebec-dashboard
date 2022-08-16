import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import Image from "next/image"
import { FC, useEffect, useRef, useState } from "react"
import * as Icons from "../../assets/icons"
import * as Images from "../../assets/images"
import { toSubstring } from "../../utils"
import { Button, CollapseDropdown } from "../shared"
//hooks
import CopyButton from "components/shared/CopyButton"
import { useTranslation } from "next-i18next"
import ReactTooltip from "react-tooltip"
import { useClickOutside } from "../../hooks"

const Profile: FC = () => {
  const { t } = useTranslation()
  const useWalletObject = useWallet()
  const useWalletModalObject = useWalletModal()
  const profileDropdownWrapperRef = useRef(null)

  const [toggleProfileDropdown, setToggleProfileDropdown] =
    useState<boolean>(false)

  const handleClose = () => {
    setToggleProfileDropdown(false)
  }

  //handle clicking outside
  useClickOutside(profileDropdownWrapperRef, {
    onClickOutside: handleClose
  })

  //handle change wallet
  const handleChangeWallet = () => {
    useWalletModalObject.setVisible(!useWalletModalObject.visible)
    handleClose()
  }

  //handle disconnect wallet
  const handleDisconnectWallet = () => {
    useWalletObject.disconnect()
    handleClose()
  }

  useEffect(() => {
    if (useWalletObject?.publicKey && toggleProfileDropdown) {
      setTimeout(() => {
        ReactTooltip.rebuild()
      }, 500)
    }
  }, [useWalletObject, toggleProfileDropdown])

  return (
    <>
      <div className="relative h-8" ref={profileDropdownWrapperRef}>
        {/* Active Profile */}
        <button
          type="button"
          className={`rounded-lg transition duration-300 focus:outline-0`}
          onClick={() => setToggleProfileDropdown(!toggleProfileDropdown)}
        >
          <div className="flex gap-x-2">
            <Image
              src={Images.Avatar1}
              alt="Profile Avatar"
              layout="fixed"
              width={32}
              height={32}
            />
            <div className="flex items-center gap-x-3">
              <div className="flex flex-col items-start justify-between h-full">
                <div className="text-avatar-title font-medium text-content-primary">
                  {toSubstring(useWalletObject?.publicKey?.toString(), 4, true)}
                </div>
                <div className="text-caption leading-[14px] text-content-contrast whitespace-nowrap">
                  {useWalletObject?.wallet?.adapter.name} Wallet
                </div>
              </div>
              <Icons.CheveronDownIcon className="w-5 h-5 text-content-secondary" />
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
                alt="Profile Avatar"
                layout="fixed"
                width={32}
                height={32}
              />
              <div className="flex items-center gap-x-3">
                <div className="flex flex-col justify-between h-full">
                  <div
                    data-tip={useWalletObject?.publicKey?.toString()}
                    className="text-avatar-title font-medium text-content-primary"
                  >
                    {toSubstring(
                      useWalletObject?.publicKey?.toString(),
                      4,
                      true
                    )}
                  </div>
                  <div className="text-caption leading-[14px] text-content-contrast whitespace-nowrap">
                    {useWalletObject?.wallet?.adapter.name} Wallet
                  </div>
                </div>
                <CopyButton
                  className="text-content-primary"
                  content={useWalletObject?.publicKey?.toString() ?? ""}
                />
              </div>
            </div>
            <div>
              <Button
                title={`${t("common:buttons.change-wallet")}`}
                startIcon={<Icons.RefreshIcon />}
                className="w-full mb-3"
                onClick={handleChangeWallet}
              />
              <Button
                title={`${t("common:buttons.disconnect-wallet")}`}
                startIcon={<Icons.DisconnectIcon />}
                className="w-full"
                onClick={handleDisconnectWallet}
              />
            </div>
          </div>
        </CollapseDropdown>
      </div>
    </>
  )
}

export default Profile
