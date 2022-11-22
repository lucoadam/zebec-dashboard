/* eslint-disable @typescript-eslint/no-unused-vars */

import type { WalletName } from "@solana/wallet-adapter-base"
import { WalletReadyState } from "@solana/wallet-adapter-base"
import type { Wallet } from "@solana/wallet-adapter-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui"
import { FC, MouseEvent, useEffect } from "react"
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../Button"
import { Collapse } from "./Collapse"
import { WalletSVG } from "./WalletSVG"
import * as Icons from "assets/icons"
import { useZebecWallet } from "hooks/useWallet"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Toggle } from "../Toggle"
import { toSubstring } from "utils"
import { login } from "api"
import { changeSignState } from "features/common/commonSlice"
import { useTranslation } from "next-i18next"
import { useDisconnect } from "wagmi"

export interface WalletModalProps {
  className?: string
  container?: string
}

export const SolanaWallet: FC<WalletModalProps> = ({
  className = "",
  container = "body"
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { wallets, select } = useWallet()
  const walletObject = useZebecWallet()

  const { setVisible } = useWalletModal()

  const [isLedgerWallet, setIsLedgerWallet] = useState(false)
  const { isSigned } = useAppSelector((state) => state.common)
  const { disconnect } = useDisconnect()

  const [expanded, setExpanded] = useState(false)

  const dispatch = useAppDispatch()
  const { t } = useTranslation("common")

  const [installedWallets, otherWallets] = useMemo(() => {
    const installed: Wallet[] = []
    const notDetected: Wallet[] = []
    const loadable: Wallet[] = []

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet)
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet)
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet)
      }
    }

    return [installed, [...loadable, ...notDetected]]
  }, [wallets])

  const hideModal = useCallback(() => {
    setTimeout(() => setVisible(false), 150)
  }, [setVisible])

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      hideModal()
    },
    [hideModal]
  )

  const handleWalletClick = useCallback(
    (event: MouseEvent, walletName: WalletName) => {
      select(walletName)
      handleClose(event)
    },
    [select, handleClose]
  )

  const handleCollapseClick = useCallback(
    () => setExpanded(!expanded),
    [expanded]
  )

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const node = ref.current
      if (!node) return

      // here we query all focusable elements
      const focusableElements = node.querySelectorAll("button")
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstElement = focusableElements[0]!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastElement = focusableElements[focusableElements.length - 1]!

      if (event.shiftKey) {
        // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
        if (document.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      } else {
        // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
        if (document.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    },
    [ref]
  )

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideModal()
      } else if (event.key === "Tab") {
        handleTabKey(event)
      }
    }

    // Get original overflow
    const { overflow } = window.getComputedStyle(document.body)
    // Hack to enable fade in animation after mount
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden"
    // Listen for keydown events
    window.addEventListener("keydown", handleKeyDown, false)

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = overflow
      window.removeEventListener("keydown", handleKeyDown, false)
    }
  }, [hideModal, handleTabKey])

  const handleLogin: () => void = async () => {
    const response = await login(walletObject, isLedgerWallet)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }

  return (
    <div className={twMerge("text-content-primary", className)}>
      {!installedWallets.length && (
        <>
          <div className="wallet-adapter-modal-middle">
            <WalletSVG />
            <span className="mt-4">
              You{"'"}ll need a wallet on Solana to continue
            </span>
          </div>
        </>
      )}
      {(!walletObject.connected ||
        (!isSigned && walletObject.network !== "solana")) &&
        installedWallets.map((wallet) => (
          <Button
            key={wallet.adapter.name}
            className="w-full justify-between mb-2"
            startIcon={
              <>
                <i className="wallet-adapter-button-start-icon">
                  <WalletIcon wallet={wallet} />
                </i>
              </>
            }
            variant="gradient"
            endIcon={<span className="text-[10px] font-normal">Detected</span>}
            title={wallet.adapter.name}
            onClick={(event) => {
              wallet
              handleWalletClick(event, wallet.adapter.name)
            }}
            childrenClassName="flex items-center justify-start"
          />
        ))}
      {(!walletObject.connected ||
        (!isSigned && walletObject.network !== "solana")) &&
      otherWallets.length ? (
        <button
          className="flex text-content-primary items-center gap-x-1 mt-6 ml-auto"
          onClick={handleCollapseClick}
          tabIndex={0}
        >
          {installedWallets.length ? (
            <span>Show {expanded ? "Less " : "More "}options</span>
          ) : (
            <span>
              {expanded ? "Hide " : "Already have a wallet? View "}options
            </span>
          )}
          <Icons.CheveronDownIcon
            className={`${expanded && "transform rotate-180"}`}
          />
        </button>
      ) : null}
      <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
        {otherWallets.length ? (
          <div className="mt-6">
            {otherWallets.map((wallet) => (
              <Button
                key={wallet.adapter.name}
                startIcon={
                  <>
                    <i className="wallet-adapter-button-start-icon">
                      <WalletIcon wallet={wallet} />
                    </i>
                  </>
                }
                className="w-full mb-2"
                variant="gradient"
                title={wallet.adapter.name}
                onClick={(event) => {
                  walletObject.disconnect()
                  setTimeout(() => {
                    handleWalletClick(event, wallet.adapter.name)
                  }, 200)
                }}
                childrenClassName="flex items-center justify-start"
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </Collapse>

      {walletObject.connected &&
        !isSigned &&
        walletObject.network === "solana" && (
          <>
            <div className="flex flex-col mt-8">
              {/* Step 1 */}
              <div className="flex gap-x-6">
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-content-primary text-xs grid place-content-center">
                  1
                </div>
                <div className="flex flex-col gap-y-1">
                  <h4 className="leading-6 font-medium text-sm text-content-primary text-start">
                    Connected wallet
                  </h4>
                  <p className="text-content-secondary bg-background-muted text-sm py-1 px-3 rounded-xl">
                    {toSubstring(walletObject?.publicKey?.toString(), 10, true)}
                  </p>
                </div>
              </div>
              {/* Divider */}
              <div className="h-12 w-px bg-background-light ml-3 transform -translate-y-4"></div>
              {/* Step 2 */}
              <div className="flex gap-x-6">
                <div className="shrink-0 w-6 h-6 rounded-full bg-content-contrast  text-content-primary text-xs grid place-content-center">
                  2
                </div>
                <div className="flex flex-col gap-y-1">
                  <h4 className="leading-6 font-medium text-sm text-content-primary text-start">
                    Sign {isLedgerWallet ? "transaction" : "message"}
                  </h4>
                  <p className="text-content-secondary text-xs text-start">
                    {isLedgerWallet
                      ? "Signed transaction is not sent to blockchain and only serves for ownership verification"
                      : "Message signed by your wallet only serves for ownership verification"}
                  </p>
                  <div className="text-content-secondary text-sm mt-2">
                    <Toggle
                      text="Are you using Ledger?"
                      onChange={() => setIsLedgerWallet(!isLedgerWallet)}
                      checked={isLedgerWallet}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      {walletObject.connected &&
        !isSigned &&
        walletObject.network === "solana" && (
          <>
            <Button
              className="w-full mt-10"
              title={t("wallet-not-connected.sign-message").toString()}
              variant="gradient"
              onClick={handleLogin}
            />
            <Button
              className="w-full mt-3"
              title={`Disconnect`}
              variant="default"
              onClick={() => {
                walletObject.disconnect()
                disconnect()
              }}
            />
          </>
        )}
    </div>
  )
}
