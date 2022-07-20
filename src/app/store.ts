import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction
} from "@reduxjs/toolkit"
import counterSlice from "features/count/counterSlice"
import exportSlice from "features/export-report/exportSlice"
import layoutSlice from "features/layout/layoutSlice"
import cancelModalSlice from "features/modals/cancelModalSlice"
import pauseModalSlice from "features/modals/pauseModalSlice"
import resumeModalSlice from "features/modals/resumeModalSlice"
import tokenDetailsSlice from "features/tokenDetails/tokenDetailsSlice"
import treasuryBalanceSlice from "features/treasuryBalance/treasuryBalanceSlice"
import treasuryStreamingSlice from "features/treasuryStreamingBalance/treasuryStreamingSlice"
import userSlice from "features/user/userSlice"
import walletBalanceSlice from "features/walletBalance/walletBalanceSlice"
import zebecBalanceSlice from "features/zebecBalance/zebecBalanceSlice"
import zebecStreamingSlice from "features/zebecStreamingBalance/zebecStreamingSlice"
import toastsSlice from "features/toasts/toastsSlice"
import commonSlice from "features/common/commonSlice"
import rejectModalSlice from "features/modals/rejectModalSlice"
import signModalSlice from "features/modals/signModalSlice"
import addressBookSlice from "features/address-book/addressBookSlice"
import stakeSlice from "features/modals/stakeSlice"
import unStakeSlice from "features/modals/unStakeSlice"
import harvestSlice from "features/modals/harvestSlice"

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
  toasts: toastsSlice,
  common: commonSlice,
  exportReport: exportSlice,
  pause: pauseModalSlice,
  cancel: cancelModalSlice,
  resume: resumeModalSlice,
  address: addressBookSlice,
  rejectTransaction: rejectModalSlice,
  signTransaction: signModalSlice,
  stake: stakeSlice,
  unstake: unStakeSlice,
  harvest: harvestSlice
})

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
