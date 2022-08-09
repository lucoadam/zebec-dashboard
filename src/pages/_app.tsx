/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppProps } from "next/app"
import { useMemo } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { store } from "app/store"
import { appWithTranslation } from "next-i18next"
import { ThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import { ZebecContextProvider } from "app/zebecContext"
import Common from "components/layouts/Common"
//Styles
import "@solana/wallet-adapter-react-ui/styles.css"
import "styles/globals.css"
import axios from "axios"
import { TokenResponse } from "features/tokenDetails/tokenDetailsSlice.d"

const MyApp = ({
  Component,
  pageProps,
  tokenDetails
}: AppProps & { tokenDetails: TokenResponse[] }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  //wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network })
    ],
    [network]
  )
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

MyApp.getInitialProps = async () => {
  const { data } = await axios.get(`${process.env.DB_HOST}/token/`)
  return {
    tokenDetails: data as TokenResponse[]
  }
}

export default appWithTranslation(MyApp)
