import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface PauseState {
    pauseModal: boolean;
    isPaused: boolean;
}

const initialState: PauseState = {
    pauseModal: false,
    isPaused: false

};

export const PauseSlice = createSlice({
    name: "PauseModal",
    initialState,
    reducers: {
        togglePauseModal: (state) => {
            state.pauseModal = !state.pauseModal;
        },
        pausedModal: (state) => {
            state.isPaused = !state.isPaused;
        },
    }
})

export const { togglePauseModal, pausedModal } =
    PauseSlice.actions;

export default PauseSlice.reducer;
