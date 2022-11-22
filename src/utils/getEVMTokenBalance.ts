import { ethers, Signer } from "ethers"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { EVMTokenABI } from "../constants/evm"

export const getEVMTokenBalance = async (
  address: string,
  tokens: TokenDetails[],
  signer: Signer
) => {
  if (!signer.provider) {
    console.debug("getEVMTokenBalance", "Signer has no provider")
    return {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const balance: any = await signer.provider.getBalance(address)
  const tokenBalances = await Promise.all(
    tokens
      .filter((token) => token.mint !== "binancecoin")
      .map(async (token) => {
        const contract = new ethers.Contract(token.mint, EVMTokenABI, signer)
        const balance = await contract.balanceOf(address)
        return [token.mint, balance.toString() / 10 ** token.decimal]
      })
  )

  return Object.fromEntries([
    ["binancecoin", balance.toString() / 10 ** 18],
    ...tokenBalances
  ])
}
