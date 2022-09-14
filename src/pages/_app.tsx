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
// import axios from "axios"
import EthereumWalletProvider from "components/shared/Wallet/EthereumWalletProvider"

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
  // let data = []
  // try {
  //   const response = await axios.get(`${process.env.DB_HOST}/token/`)
  //   data = response.data
  // } catch (error) {
  //   data = []
  // }
  return {
    // tokenDetails: data as TokenResponse[]
    tokenDetails: [
      {
        symbol: "ZBC",
        name: "ZEBEC",
        decimal: 9,
        mint: "2iB2oZaJZZBCmMecrz79wrMdu6Zn5UA2apUYdVy4jJUD",
        coingeco_id: "zebec-protocol",
        chainId: "solana"
      },
      {
        symbol: "SOL",
        name: "Solana",
        decimal: 9,
        mint: null,
        coingeco_id: "solana",
        chainId: "solana"
      },
      {
        symbol: "WSOL",
        name: "Wrapped Solana",
        decimal: 9,
        mint: "So11111111111111111111111111111111111111112",
        coingeco_id: "solana",
        chainId: "solana"
      },
      {
        symbol: "WWSOL",
        name: "Wormhole Wrapped SOL",
        decimal: 9,
        mint: "0x30f19eBba919954FDc020B8A20aEF13ab5e02Af0",
        coingeco_id: "solana",
        chainId: "97"
      }
    ]
  }
}

export default appWithTranslation(MyApp)
