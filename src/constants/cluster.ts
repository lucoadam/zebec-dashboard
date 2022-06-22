//Wallet Adapter
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

//getRPC
const getRPCNetwork = () => {
  if (process.env.RPC_NETWORK === "devnet") return WalletAdapterNetwork.Devnet;
  if (process.env.RPC_NETWORK === "mainnet")
    return WalletAdapterNetwork.Mainnet;
  if (process.env.RPC_NETWORK === "testnet")
    return WalletAdapterNetwork.Testnet;
  return WalletAdapterNetwork.Devnet;
};

//Constants
export const RPC_NETWORK = getRPCNetwork();
