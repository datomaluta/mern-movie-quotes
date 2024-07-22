import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../types/user";

const initialState: { currentUser: UserType | null } = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { saveUserInfo } = userSlice.actions;

export default userSlice.reducer;
