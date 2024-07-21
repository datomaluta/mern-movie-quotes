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
    toggleLanguage: (state) => {
      state.lang = state.lang === "ka" ? "en" : "ka";
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

export default languageSlice.reducer;
