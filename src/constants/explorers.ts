import { RPC_NETWORK } from "./cluster"

export const explorers = [
  {
    name: "SolScan",
    url: `https://solscan.io/tx/hash?cluster=${RPC_NETWORK}`
  },
  {
    name: "Solana Explorer",
    url: `https://explorer.solana.com/tx/hash?cluster=${RPC_NETWORK}`
  },
  {
    name: "Solana FM",
    url: `https://solana.fm/tx/hash?cluster=${
      RPC_NETWORK === "mainnet-beta" ? "mainnet-bd1" : `${RPC_NETWORK}-solana`
    }`
  }
]

export const getExplorer = (name: string) => {
  return explorers.find((explorer) => explorer.name === name) || explorers[0]
}

export const getExplorerUrl = (name: string, url: string) => {
  const explorer = getExplorer(name)
  return explorer.url.replace("hash", url)
}
