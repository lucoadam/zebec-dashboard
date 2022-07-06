import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface PauseState {
    pauseModal: boolean;
}

const initialState: PauseState = {
    pauseModal: false
};

export const PauseSlice = createSlice({
    name: "PauseModal",
    initialState,
    reducers: {
        togglePauseModal: (state) => {
            state.pauseModal = !state.pauseModal;
        },
    }
})

export const { togglePauseModal } =
    PauseSlice.actions;

export default PauseSlice.reducer;
