import { WagmiConfig, createClient, configureChains, Chain } from "wagmi"

import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

const binanceMainnet: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "binance",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB"
  },
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org/"
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com/" }
  },
  testnet: false
}

const binanceTestnet: Chain = {
  id: 97,
  name: "Binance Smart Chain Testnet",
  network: "binance",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "tBNB"
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s3.binance.org:8545/"
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com/" }
  },
  testnet: true
}

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [binanceTestnet, binanceMainnet],
  [
    alchemyProvider({ apiKey: "YV0pS3SwQaYy4_FQjg8ZGNFjraZtGe9U" }),
    publicProvider()
  ]
)

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
