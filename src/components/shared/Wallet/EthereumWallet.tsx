import { useConnect } from "wagmi"
import { Button } from "components/shared"
import * as Icons from "assets/icons"
import { useZebecWallet } from "hooks/useWallet"

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
  const { connect, connectors } = useConnect()
  const walletObject = useZebecWallet()

  return (
    <div className="flex flex-col mt-6 text-content-primary">
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          startIcon={getAdapterIcon(connector.name)}
          onClick={() => {
            walletObject.disconnect()
            setTimeout(() => {
              connect({ connector })
            }, 200)
          }}
          title={connector.name}
          variant="gradient"
          className="w-full mb-2"
          childrenClassName="flex items-center justify-start"
        />
      ))}
    </div>
  )
}
