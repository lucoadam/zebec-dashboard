import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicKey } from "@solana/web3.js";
import { RootState } from "app/store";
import { connection } from "constants/cluster";
import { constants } from "constants/constants";
import { streamingSchema } from "utils/deserialize/streamingSchema";
import { StreamingTokenState } from "./zebecStreamingSlice.d";

const initialState: StreamingTokenState = {
  loading: false,
  tokens: [],
  error: "",
};

//Generates pending, fulfilled and rejected action types
export const fetchZebecStreamingBalance: any = createAsyncThunk(
  "balance/fetchZebecStreamingBalance",
  async (wallet: string, { getState }) => {
    try {
      const { tokenDetails } = getState() as RootState;
      const tokens = tokenDetails.tokens;
      const base58PublicKey = new PublicKey(constants.PROGRAM_ID);
      const streamingBalance = await Promise.all(
        tokens.map(async (token) => {
          const senderAddress = new PublicKey(wallet);
          let withdraw_data;
          if (token.symbol.toUpperCase() === "SOL") {
            withdraw_data = await PublicKey.findProgramAddress(
              [Buffer.from("withdraw_sol"), senderAddress.toBuffer()],
              base58PublicKey
            );
          } else {
            const tokenMint = new PublicKey(token.mint);
            withdraw_data = await PublicKey.findProgramAddress(
              [
                Buffer.from("withdraw_token"),
                senderAddress.toBuffer(),
                tokenMint.toBuffer(),
              ],
              base58PublicKey
            );
          }
          const withdrawDataPubKey = withdraw_data[0];
          const accountInfo = await connection.getAccountInfo(
            withdrawDataPubKey,
            "confirmed"
          );
          let balance = null;
          if (accountInfo) {
            const resp = streamingSchema.decode(accountInfo.data);
            balance = resp.amount.toString();
          } else {
            balance = 0;
          }
          return {
            symbol: token.symbol,
            balance: balance,
          };
        })
      );
      return streamingBalance;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const streamingBalanceSlice = createSlice({
  name: "zebecStreamingBalance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchZebecStreamingBalance.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchZebecStreamingBalance.fulfilled,
      (state, action: PayloadAction<typeof initialState.tokens>) => {
        state.loading = false;
        state.tokens = action.payload;
        state.error = "";
      }
    );
    builder.addCase(fetchZebecStreamingBalance.rejected, (state, action) => {
      state.loading = false;
      state.tokens = [];
      state.error = action.error.message ?? "Something went wrong";
    });
  },
});

export default streamingBalanceSlice.reducer;
