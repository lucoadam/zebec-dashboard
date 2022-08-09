import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { login } from "api"
import TokenService from "api/services/token.service"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button, Modal } from "components/shared"
import { changeSignState } from "features/modals/signModalSlice"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"

declare global {
  interface Window {
    phantom: any
  }
}

const WalletNotConnectedModal: NextPage = () => {
  const { t } = useTranslation("common")
  const walletObject = useWallet()
  const walletModalObject = useWalletModal()
  const [isInitialized, setIsInitialized] = useState(false)
  const { isSigned } = useAppSelector((state) => state.signTransaction)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (walletObject.connected) {
      const token = TokenService.getLocalAccessToken()
      if (!token) handleLogin()
      else dispatch(changeSignState(!!token))
    }
  }, [walletObject.connected, isSigned])

  const handleConnectWallet: () => void = () => {
    walletObject.wallet
      ? walletObject.connect()
      : walletModalObject.setVisible(!walletModalObject.visible)
  }

  const handleLogin: () => void = async () => {
    const response = await login(walletObject)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true)
    }, 800)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const provider = window.phantom?.solana

      provider.on("accountChanged", (publicKey: any) => {
        if (publicKey) {
          // Set new public key and continue as usual
          console.log(`Switched to account ${publicKey.toBase58()}`)
          walletObject.disconnect()
          TokenService.removeTokens()
        } else {
          // Attempt to reconnect to Phantom
          provider.connect().catch((error: any) => {
            // Handle connection failure
          })
        }
      })
    }
  }, [])

  return (
    <>
      {isInitialized && (
        <Modal
          show={!walletObject.connected || !isSigned}
          toggleModal={() => null}
          className="rounded-2xl"
          hasCloseIcon={false}
        >
          <div className="text-center px-6 py-8">
            <span className="text-content-primary text-2xl font-semibold">
              {t("wallet-not-connected.title")}
            </span>
            <p className="text-sm space-x-1 text-content-secondary mt-3">
              {t("wallet-not-connected.description")}
            </p>
            <Button
              className="w-full mt-10"
              title={`${
                walletObject.connected && !isSigned
                  ? t("wallet-not-connected.sign-message")
                  : t("wallet-not-connected.connect-wallet")
              }`}
              variant="gradient"
              onClick={() =>
                walletObject.connected && !isSigned
                  ? handleLogin()
                  : handleConnectWallet()
              }
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default WalletNotConnectedModal
