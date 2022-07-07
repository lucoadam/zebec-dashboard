import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface ResumeState {
    resumeModal: boolean;
    isResumed: boolean;
}

const initialState: ResumeState = {
    resumeModal: false,
    isResumed: false
};

export const ResumeSlice = createSlice({
    name: "ResumeModal",
    initialState,
    reducers: {
        toggleResumeModal: (state) => {
            state.resumeModal = !state.resumeModal;
        },
        resumedModal: (state) => {
            state.isResumed = !state.isResumed;
        },
    }
})

export const { toggleResumeModal, resumedModal } =
    ResumeSlice.actions;

export default ResumeSlice.reducer;
