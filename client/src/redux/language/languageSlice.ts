import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: "ka",
};

const languageSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setLanguage: (state, { payload }) => {
      state.lang = payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
