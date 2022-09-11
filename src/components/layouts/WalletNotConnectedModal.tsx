import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { login } from "api"
import TokenService from "api/services/token.service"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button, Modal } from "components/shared"
import { changeSignState } from "features/common/commonSlice"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"

interface DecodedTokenProps {
  token_type: string
  exp: number
  iat: number
  jti: string
  wallet_address: string
}

const WalletNotConnectedModal: NextPage = () => {
  const { t } = useTranslation("common")
  const walletObject = useWallet()
  const walletModalObject = useWalletModal()
  const [isInitialized, setIsInitialized] = useState(false)
  const { isSigned } = useAppSelector((state) => state.common)
  const dispatch = useAppDispatch()

  const handleLogin: () => void = async () => {
    const response = await login(walletObject)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }

  useEffect(() => {
    if (walletObject.connected) {
      const token = TokenService.getLocalAccessToken()
      if (!token) handleLogin()
      else {
        const decodedToken: DecodedTokenProps = jwt_decode(token)
        if (
          decodedToken.wallet_address === walletObject.publicKey?.toString()
        ) {
          dispatch(changeSignState(!!token))
        } else {
          handleLogin()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletObject.connected, isSigned])

  const handleConnectWallet: () => void = () => {
    walletObject.wallet
      ? walletObject.connect()
      : walletModalObject.setVisible(!walletModalObject.visible)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true)
    }, 800)
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
