import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains
} from "wagmi"

import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: "YV0pS3SwQaYy4_FQjg8ZGNFjraZtGe9U" }),
  publicProvider()
])

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi"
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    })
  ],
  provider,
  webSocketProvider
})
interface EthereumWalletProviderProps {
  children: React.ReactNode
}
// Pass client to React Context Provider
function EthereumWalletProvider(props: EthereumWalletProviderProps) {
  return <WagmiConfig client={client}>{props.children}</WagmiConfig>
}

export default EthereumWalletProvider
