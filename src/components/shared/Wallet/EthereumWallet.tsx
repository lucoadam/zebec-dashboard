import { useConnect, useNetwork } from "wagmi"
import { Button } from "components/shared"
import * as Icons from "assets/icons"
import { login } from "api"
import { useAppDispatch } from "app/hooks"
import { changeSignState } from "features/common/commonSlice"
import { useZebecWallet } from "hooks/useWallet"
import { useEffect } from "react"

const getAdapterIcon = (name: string) => {
  switch (name) {
    case "MetaMask":
      return <Icons.MetamaskIcon />
    case "Coinbase Wallet":
      return <Icons.CoinbaseIcon />
    case "WalletConnect":
      return <Icons.WalletConnectIcon />
    default:
      return <></>
  }
}
export const EthereumWallet = () => {
  const { connect, connectors, error } = useConnect()
  const { chain, chains } = useNetwork()
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const handleLogin: () => void = async () => {
    const response = await login(walletObject)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }
  useEffect(() => {
    console.log(chain, chains, "connector")
  }, [chain, chains])

  return (
    <div className="flex flex-col mt-6 text-content-primary">
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          startIcon={getAdapterIcon(connector.name)}
          onClick={() =>
            walletObject.connected ? handleLogin() : connect({ connector })
          }
          title={connector.name}
          variant="gradient"
          className="w-full mb-2"
          childrenClassName="flex items-center justify-start"
        />
      ))}
      {error && <div className="text-error">{error.message}</div>}
    </div>
  )
}
