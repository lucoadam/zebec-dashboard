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
import zebecBalanceSlice from "features/zebecBalance/zebecBalanceSlice";
const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
  tokenDetails: tokenDetailsSlice,
  zebecBalance: zebecBalanceSlice,
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
