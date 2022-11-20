import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { login } from "api"
import TokenService from "api/services/token.service"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Button, IconButton, Modal, Toggle } from "components/shared"
import { changeSignState } from "features/common/commonSlice"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import { toSubstring } from "utils"
import * as Icons from "assets/icons"

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
  const [isInitialized, setIsInitialized] = useState(true)
  const [isLedgerWallet, setIsLedgerWallet] = useState(false)
  const { isSigned } = useAppSelector((state) => state.common)
  const dispatch = useAppDispatch()

  const handleLogin: () => void = async () => {
    const response = await login(walletObject, isLedgerWallet)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }

  useEffect(() => {
    if (
      walletObject.connected &&
      walletObject.wallet?.adapter.name === "Ledger"
    )
      setIsLedgerWallet(true)
    // eslint-disable-next-line
  }, [walletObject.connected])

  useEffect(() => {
    if (walletObject.connected) {
      const token = TokenService.getLocalAccessToken()
      if (!token) null
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
          <div className="relative px-6 py-8">
            {/* Cross Button */}
            {walletObject.connected && !isSigned && (
              <IconButton
                icon={<Icons.CrossIcon />}
                className="absolute right-0 -top-2 w-9 h-9"
                onClick={() => walletObject.disconnect()}
              />
            )}
            {/* Main Content */}
            <div className="text-content-primary text-2xl font-semibold text-center">
              {walletObject.connected && !isSigned
                ? t("wallet-not-connected.sign-message")
                : t("wallet-not-connected.title")}
            </div>
            <p className="text-sm space-x-1 text-content-secondary mt-3 text-center">
              {walletObject.connected && !isSigned
                ? "In order to authenticate yourself please verify your wallet by following the steps below."
                : t("wallet-not-connected.description")}
            </p>

            {walletObject.connected && !isSigned && (
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
                        {toSubstring(
                          walletObject?.publicKey?.toString(),
                          10,
                          true
                        )}
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

            {walletObject.connected && !isSigned && (
              <Button
                className="w-full mt-3"
                title={`Disconnect`}
                variant="default"
                onClick={() => walletObject.disconnect()}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

export default WalletNotConnectedModal
