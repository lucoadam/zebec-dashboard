//Wallet Adapter
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection, clusterApiUrl } from "@solana/web3.js";

//getRPC
const getRPCNetwork = () => {
  if (process.env.RPC_NETWORK === "devnet") return WalletAdapterNetwork.Devnet;
  if (process.env.RPC_NETWORK === "mainnet")
    return WalletAdapterNetwork.Mainnet;
  if (process.env.RPC_NETWORK === "testnet")
    return WalletAdapterNetwork.Testnet;
  return WalletAdapterNetwork.Devnet;
};

//getClusterApiUrl
const getClusterApiUrl = () => {
    if (process.env.RPC_NETWORK === "devnet")
        return clusterApiUrl("devnet");
    if (process.env.RPC_NETWORK === "mainnet")
        return clusterApiUrl("mainnet-beta");
    if (process.env.RPC_NETWORK === "testnet")
        return clusterApiUrl("testnet");
    return clusterApiUrl("devnet");
}

export const connection = new Connection(getClusterApiUrl());

//Constants
export const RPC_NETWORK = getRPCNetwork();
export const CLUSTER_API_URL = getClusterApiUrl();
