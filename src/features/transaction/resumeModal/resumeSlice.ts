import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "app/store";

//declare types for state
interface ResumeState {
    ResumeModal: boolean;
}

const initialState: ResumeState = {
    ResumeModal: false
};

export const ResumeSlice = createSlice({
    name: "ResumeModal",
    initialState,
    reducers: {
        toggleResumeModal: (state) => {
            state.ResumeModal = !state.ResumeModal;
        },
    }
})

export const { toggleResumeModal } =
    ResumeSlice.actions;

export default ResumeSlice.reducer;
