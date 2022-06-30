import {
  Action,
  configureStore,
  ThunkAction,
  combineReducers,
} from "@reduxjs/toolkit";
import counterSlice from "features/count/counterSlice";
import userSlice from "features/user/userSlice";

const combineReducer = combineReducers({
  counter: counterSlice,
  user: userSlice,
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
