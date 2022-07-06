import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface CancelState {
    CancelModal: boolean;
}

const initialState: CancelState = {
    CancelModal: false
};

export const CancelSlice = createSlice({
    name: "CancelModal",
    initialState,
    reducers: {
        toggleCancelModal: (state) => {
            state.CancelModal = !state.CancelModal;
        },
    }
})

export const { toggleCancelModal } =
    CancelSlice.actions;

export default CancelSlice.reducer;
