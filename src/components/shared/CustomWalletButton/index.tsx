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
import { Button } from "../Button"
import { Collapse } from "./Collapse"
import { WalletSVG } from "./WalletSVG"

export interface WalletModalProps {
  className?: string
  container?: string
}

export const CustomWalletButton: FC<WalletModalProps> = ({
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

  const getStartedWallet = useMemo(() => {
    return installedWallets.length
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        installedWallets[0]!
      : wallets.find(
          (wallet: { adapter: { name: WalletName } }) =>
            wallet.adapter.name === "Torus"
        ) ||
          wallets.find(
            (wallet: { adapter: { name: WalletName } }) =>
              wallet.adapter.name === "Phantom"
          ) ||
          wallets.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (wallet: { readyState: any }) =>
              wallet.readyState === WalletReadyState.Loadable
          ) ||
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          otherWallets[0]!
  }, [installedWallets, wallets, otherWallets])

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

  return (
    <div className={"text-content-primary">
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
          onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
        />
      ))}
      {otherWallets.length ? (
        <button
          className="wallet-adapter-modal-list-more"
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
          <svg
            width="13"
            height="7"
            viewBox="0 0 13 7"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              expanded ? "wallet-adapter-modal-list-more-icon-rotate" : ""
            }`}
          >
            <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
          </svg>
        </button>
      ) : null}
      <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
        {otherWallets.length ? (
          <>
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
                className="w-full mb-4"
                variant="gradient"
                title={wallet.adapter.name}
                onClick={(event) =>
                  handleWalletClick(event, wallet.adapter.name)
                }
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Collapse>
    </div>
  )
}
