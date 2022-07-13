import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction
} from "@reduxjs/toolkit"
import counterSlice from "features/count/counterSlice"
import exportSlice from "features/export-report/exportSlice"
import layoutSlice from "features/layout/layoutSlice"
import cancelModalSlice from "features/modals/cancelModal/cancelModalSlice"
import pauseModalSlice from "features/modals/pauseModal/pauseModalSlice"
import resumeModalSlice from "features/modals/resumeModal/resumeModalSlice"
import tokenDetailsSlice from "features/tokenDetails/tokenDetailsSlice"
import treasuryBalanceSlice from "features/treasuryBalance/treasuryBalanceSlice"
import treasuryStreamingSlice from "features/treasuryStreamingBalance/treasuryStreamingSlice"
import userSlice from "features/user/userSlice"
import walletBalanceSlice from "features/walletBalance/walletBalanceSlice"
import zebecBalanceSlice from "features/zebecBalance/zebecBalanceSlice"
import zebecStreamingSlice from "features/zebecStreamingBalance/zebecStreamingSlice"

const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
  tokenDetails: tokenDetailsSlice,
  walletBalance: walletBalanceSlice,
  treasuryBalance: treasuryBalanceSlice,
  zebecBalance: zebecBalanceSlice,
  zebecStreamingBalance: zebecStreamingSlice,
  treasuryStreamingBalance: treasuryStreamingSlice,
  layout: layoutSlice,
  exportReport: exportSlice,
  pause: pauseModalSlice,
  cancel: cancelModalSlice,
  resume: resumeModalSlice
})

// export const store = configureStore({
//   reducer: {
//     counter: counterSlice,
//   },
// });

export const store = configureStore({
  reducer: combineReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
