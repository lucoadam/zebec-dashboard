import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import counterSlice from "features/count/counterSlice";
import tokenSlice from "features/token/tokenSlice";
import userSlice from "features/user/userSlice";

const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
  token: tokenSlice,
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
