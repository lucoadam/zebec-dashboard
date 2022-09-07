import { ethers, Signer } from "ethers"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { EVMTokenABI } from "../constants/evm"

export const getEVMTokenBalance = async (
  address: string,
  tokens: TokenDetails[],
  signer: Signer
) => {
  const tokenBalances = await Promise.all(
    tokens.map(async (token) => {
      const contract = new ethers.Contract(token.mint, EVMTokenABI, signer)
      const balance = await contract.balanceOf(address)
      return [token.mint, balance.toString() / 10 ** token.decimal]
    })
  )
  return Object.fromEntries(tokenBalances)
}
