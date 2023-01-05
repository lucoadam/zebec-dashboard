import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AppDispatch } from "app/store"
import axios from "axios"
import { connection } from "constants/cluster"

interface NFTDetail {
  name: string
  image: string
  address: string
}

interface TreasuryNFTProps {
  loading: boolean
  error: string
  walletNfts: NFTDetail[]
  treasuryNfts: NFTDetail[]
}

const initialState: TreasuryNFTProps = {
  loading: false,
  error: "",
  walletNfts: [],
  treasuryNfts: []
}

export const fetchAssociatedNfts = createAsyncThunk<
  any,
  { address: string; type: "treasury" | "wallet" },
  { dispatch: AppDispatch }
>(
  "treasuryNft/fetchAssociatedNfts",
  async ({ address, type }, { dispatch }) => {
    try {
      const data = await getParsedNftAccountsByOwner({
        publicAddress: address,
        connection: connection
      })
      let nftValues: any[] = []
      for (let i = 0; i < data.length; i++) {
        let val = await axios.get(data[i].data.uri)
        nftValues.push({ ...val.data, mint: data[i].mint })
      }
      const nfts = nftValues.map((nft) => {
        return {
          name: nft.name,
          image: nft.image,
          address: nft.mint
        }
      })
      if (type === "treasury") return dispatch(setTreasuryNfts(nfts))
      else if (type === "wallet") return dispatch(setWalletNfts(nfts))
      else return null
    } catch (error) {}
  }
)

const treasuryNftSlice = createSlice({
  name: "treasuryNft",
  initialState,
  reducers: {
    setWalletNfts: (state, action) => {
      state.walletNfts = action.payload
    },
    setTreasuryNfts: (state, action) => {
      state.treasuryNfts = action.payload
    }
  },
  extraReducers: (builder) => {
    //Fetch treasury nfts
    builder.addCase(fetchAssociatedNfts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAssociatedNfts.fulfilled, (state) => {
      state.loading = false
      state.error = ""
    })
    builder.addCase(fetchAssociatedNfts.rejected, (state, action) => {
      state.loading = false
      state.error = action?.error?.message ?? "Something went wrong"
    })
  }
})

export const { setWalletNfts, setTreasuryNfts } = treasuryNftSlice.actions

export default treasuryNftSlice.reducer
