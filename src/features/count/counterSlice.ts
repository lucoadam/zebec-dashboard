import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// import type { RootState } from "app/store";

//declare types for state
interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0
}

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increament: (state) => {
      state.value++
    },
    decreament: (state) => {
      state.value--
    },
    increamentByAmount: (
      state,
      action: PayloadAction<typeof initialState.value>
    ) => {
      state.value += action.payload
    }
  }
  //   extraReducers: {
  //     ["cake/ordered"]: (state, action) => {
  //       state.cakesValue--;
  //     },
  //   },
  //   extraReducers: (builder) => {
  //       builder.addCase(cakeActions.ordered, (state, action) => {
  //           state.cakesValue--
  //       })
  //   }
})

//helper function
// export const getCounterState = (state: { counter: CounterState }) =>
//   state.counter;
// export const getCount = (state: RootState) => state.counter.value;

export const { increament, decreament, increamentByAmount } =
  counterSlice.actions

export default counterSlice.reducer
