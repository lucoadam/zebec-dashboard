/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  ExodusWalletAdapter,
  SolletExtensionWalletAdapter,
  TorusWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  LedgerWalletAdapter,
  SolongWalletAdapter,
  MathWalletAdapter,
  GlowWalletAdapter,
  SpotWalletAdapter,
  BitKeepWalletAdapter
} from "@solana/wallet-adapter-wallets"
import { store } from "app/store"
import { ZebecContextProvider } from "app/zebecContext"
import Common from "components/layouts/Common"
import { appWithTranslation } from "next-i18next"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import { useMemo } from "react"
import { Provider } from "react-redux"
import { TokenResponse } from "features/tokenDetails/tokenDetailsSlice.d"
import { CLUSTER_API_URL, RPC_NETWORK } from "constants/cluster"
//Styles
import "@solana/wallet-adapter-react-ui/styles.css"
import "styles/globals.css"
import axios from "axios"
import EthereumWalletProvider from "components/shared/Wallet/EthereumWalletProvider"

const bscTokens = [
  {
    symbol: "WSOL",
    name: "Wrapped Solana",
    decimal: 9,
    mint: "So11111111111111111111111111111111111111112",
    coingeco_id: "solana",
    chainId: "solana",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "WWSOL",
    name: "Wormhole Wrapped SOL",
    decimal: 9,
    mint: "0x30f19eBba919954FDc020B8A20aEF13ab5e02Af0",
    coingeco_id: "solana",
    chainId: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "USDT",
    name: "BSC USDT",
    decimal: 18,
    mint: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    coingeco_id: "tether",
    chainId: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "ZBC",
    name: "Zebec",
    decimal: 9,
    mint: "0xe12823c93D6E7B7f56e5740a8ba0eF8EDC82D1eb",
    coingeco_id: "zebec-protocol",
    chainId: "97",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "ZBC",
    name: "Zebec",
    decimal: 9,
    mint: "AbLwGR8A1wvsiLWrzzA5eYPoQw51NVMcMMTPvAv5LTJ",
    coingeco_id: "zebec-protocol",
    chainId: "solana",
    network: "Binance Smart Chain Testnet"
  },
  {
    symbol: "USDT",
    name: "BSC USDT",
    decimal: 8,
    mint: "F6d4we2yt9DxPwYbo18YG4bGDxMFpghQcgYWsoJTmtia",
    coingeco_id: "tether",
    chainId: "solana",
    network: "Binance Smart Chain Testnet"
  }
]

const MyApp = ({
  Component,
  pageProps,
  tokenDetails
}: AppProps & { tokenDetails: TokenResponse[] }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = RPC_NETWORK
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => CLUSTER_API_URL, [])
  //wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
      new ExodusWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new TorusWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new LedgerWalletAdapter(),
      new SolongWalletAdapter(),
      new MathWalletAdapter(),
      new GlowWalletAdapter(),
      new SpotWalletAdapter(),
      new BitKeepWalletAdapter()
    ],
    [network]
  )
  return (
    <Provider store={store}>
      <EthereumWalletProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ThemeProvider>
                <ZebecContextProvider>
                  <Component {...pageProps} />
                  <Common tokenDetails={tokenDetails} />
                </ZebecContextProvider>
              </ThemeProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </EthereumWalletProvider>
    </Provider>
  )
}

MyApp.getInitialProps = async () => {
  let data = []
  try {
    const response = await axios.get(`${process.env.DB_HOST}/token/`)
    data = response.data.map((item: TokenResponse) => ({
      ...item,
      network: "solana",
      chainId: "solana"
    }))
  } catch (error) {
    data = []
  }
  return {
    tokenDetails: [...data, ...bscTokens] as TokenResponse[]
  }
}

export default appWithTranslation(MyApp)
