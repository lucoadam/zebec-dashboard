import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface CancelState {
    cancelModal: boolean;
    isCancelled: boolean
}

const initialState: CancelState = {
    cancelModal: false,
    isCancelled: false
};

export const CancelSlice = createSlice({
    name: "CancelModal",
    initialState,
    reducers: {
        toggleCancelModal: (state) => {
            state.cancelModal = !state.cancelModal;
        },
        cancelledModal: (state) => {
            state.isCancelled = !state.isCancelled;
        },
    }
})

export const { toggleCancelModal, cancelledModal } =
    CancelSlice.actions;

export default CancelSlice.reducer;
