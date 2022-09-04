import { useConnect, useAccount, useDisconnect, useSignMessage } from "wagmi"
import { Button } from "components/shared"
import * as Icons from "assets/icons"

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
  const { isConnected, address } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  const signMessage = useSignMessage()
  return (
    <div className="flex flex-col mt-6 text-content-primary">
      {isConnected && (
        <div className="text-content-primary">
          Connected to {address}
          <button onClick={() => disconnect()}>Disconnect</button>
          <button
            onClick={async () =>
              await signMessage.signMessage({
                message: "hi"
              })
            }
          >
            sign
          </button>
        </div>
      )}
      {!isConnected &&
        connectors.map((connector) => (
          <Button
            disabled={!connector.ready}
            key={connector.id}
            startIcon={getAdapterIcon(connector.name)}
            onClick={() => connect({ connector })}
            title={connector.name}
            variant="gradient"
            className="w-full mb-2"
            childrenClassName="flex items-center justify-start"
          />
        ))}

      {error && (
        <div className="text-content-primary text-error">{error.message}</div>
      )}
    </div>
  )
}
