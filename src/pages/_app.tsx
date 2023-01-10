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
  LedgerWalletAdapter
} from "@solana/wallet-adapter-wallets"
import { store } from "app/store"
import { ZebecContextProvider } from "app/zebecContext"
import Common from "components/layouts/Common"
import { appWithTranslation } from "next-i18next"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import { useMemo } from "react"
import { Provider } from "react-redux"
import { CLUSTER_API_URL, RPC_NETWORK } from "constants/cluster"
//Styles
import "@solana/wallet-adapter-react-ui/styles.css"
import "styles/globals.css"
import EthereumWalletProvider from "components/shared/Wallet/EthereumWalletProvider"

const MyApp = ({ Component, pageProps }: AppProps) => {
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
      new LedgerWalletAdapter()
    ],
    [network]
  )
  return (
    <Provider store={store}>
      <EthereumWalletProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <ThemeProvider
                enableSystem={false}
                disableTransitionOnChange={true}
              >
                <ZebecContextProvider>
                  <Component {...pageProps} />
                  <Common />
                </ZebecContextProvider>
              </ThemeProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </EthereumWalletProvider>
    </Provider>
  )
}

export default appWithTranslation(MyApp)
