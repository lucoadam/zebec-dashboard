import { EVMChainId } from "@certusone/wormhole-sdk"

export const wormholeChains = {
  unset: 0,
  solana: 1,
  ethereum: 2,
  terra: 3,
  bsc: 4,
  polygon: 5,
  avalanche: 6,
  oasis: 7,
  algorand: 8,
  aurora: 9,
  fantom: 10,
  karura: 11,
  acala: 12,
  klaytn: 13,
  celo: 14,
  near: 15,
  moonbeam: 16,
  neon: 17,
  terra2: 18,
  injective: 19,
  osmosis: 20,
  sui: 21,
  aptos: 22,
  arbitrum: 23,
  optimism: 24,
  gnosis: 25,
  pythnet: 26,
  ropsten: 10001,
  wormholechain: 3104
}

export const EVMToWormholeChainMapping = {
  97: wormholeChains.bsc,
  56: wormholeChains.bsc,
  1: wormholeChains.ethereum,
  3: wormholeChains.ethereum,
  4: wormholeChains.ethereum,
  42: wormholeChains.ethereum,
  137: wormholeChains.polygon,
  8001: wormholeChains.polygon
}

export const getEVMToWormholeChain = (chainId: number | string | undefined) => {
  return (EVMToWormholeChainMapping[
    chainId as keyof typeof EVMToWormholeChainMapping
  ] || wormholeChains.unset) as EVMChainId
}
