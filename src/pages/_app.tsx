/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ZebecContextProvider } from "app/zebecContext"
import Common from "components/layouts/Common"
import { appWithTranslation } from "next-i18next"
import { ThemeProvider } from "next-themes"
import type { AppProps } from "next/app"
import { useMemo } from "react"
import { Provider } from "react-redux"
//Styles
import "@solana/wallet-adapter-react-ui/styles.css"
import { TokenResponse } from "features/tokenDetails/tokenDetailsSlice.d"
import "styles/globals.css"

const MyApp = ({
  Component,
  pageProps,
  tokenDetails = [
    {
      "symbol": "SOL",
      "name": "Solana",
      "decimal": 18,
      "mint": "solana",
      "coingeco_id": "solana"
    },
    {
      "symbol": "ZBC",
      "name": "Zebec",
      "decimal": 9,
      "mint": "2iB2oZaJZZBCmMecrz79wrMdu6Zn5UA2apUYdVy4jJUD",
      "coingeco_id": "zebec-protocol"
    }
  ]
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

// MyApp.getInitialProps = async () => {
//   const { data } = await axios.get(`${process.env.DB_HOST}/token/`)
//   return {
//     tokenDetails: data as TokenResponse[]
//   }
// }

export default appWithTranslation(MyApp)
