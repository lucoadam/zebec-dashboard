/* eslint-disable @typescript-eslint/no-explicit-any */
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
