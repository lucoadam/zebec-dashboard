import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import counterSlice from "features/count/counterSlice";
import tokenDetailsSlice from "features/tokenDetails/tokenDetailsSlice";
import treasuryBalanceSlice from "features/treasuryBalance/treasuryBalanceSlice";
import userSlice from "features/user/userSlice";
import walletBalanceSlice from "features/walletBalance/walletBalanceSlice";

const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
  tokenDetails: tokenDetailsSlice,
  walletBalance: walletBalanceSlice,
  treasuryBalance: treasuryBalanceSlice,
});

// export const store = configureStore({
//   reducer: {
//     counter: counterSlice,
//   },
// });

export const store = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
