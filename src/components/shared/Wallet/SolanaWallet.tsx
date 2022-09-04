/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WalletName } from "@solana/wallet-adapter-base"
import { WalletReadyState } from "@solana/wallet-adapter-base"
import type { Wallet } from "@solana/wallet-adapter-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui"
import type { FC, MouseEvent } from "react"
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
import { useAppDispatch } from "app/hooks"
import { useZebecWallet } from "hooks/useWallet"
import { login } from "api"
import { changeSignState } from "features/modals/signModalSlice"

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
  const { setVisible } = useWalletModal()
  const [expanded, setExpanded] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)
  const [portal, setPortal] = useState<Element | null>(null)

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
    setFadeIn(false)
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
    setTimeout(() => setFadeIn(true), 0)
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

  useLayoutEffect(
    () => setPortal(document.querySelector(container)),
    [container]
  )

  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const handleLogin: () => void = async () => {
    const response = await login(walletObject)
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
      {installedWallets.map((wallet) => (
        <Button
          key={wallet.adapter.name}
          className="w-full justify-between"
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
          onClick={(event) =>
            walletObject.connected
              ? handleLogin()
              : handleWalletClick(event, wallet.adapter.name)
          }
          childrenClassName="flex items-center justify-start"
        />
      ))}
      {otherWallets.length ? (
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
                onClick={(event) =>
                  handleWalletClick(event, wallet.adapter.name)
                }
                childrenClassName="flex items-center justify-start"
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </Collapse>
    </div>
  )
}
