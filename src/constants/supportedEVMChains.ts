export const supportedEVMChains = [
  {
    chainId: "solana",
    chainName: "Solana",
    nativeCurrency: {
      name: "SOL",
      symbol: "SOL",
      decimals: 9
    },
    rpcUrls: ["https://api.mainnet-beta.solana.com"],
    blockExplorerUrls: ["https://explorer.solana.com"]
  },
  {
    chainId: "97",
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Smart Chain Testnet",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  },
  {
    chainId: "56",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"]
  }
]
