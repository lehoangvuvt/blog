import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppSettingsState, Font, FontSize, Theme } from "./types";

const initialState: AppSettingsState = {
  theme: "light",
  font: "sans-serif",
  fontSize: "medium",
  isOpenSideBar: true,
};

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setFont: (state, action: PayloadAction<Font>) => {
      state.font = action.payload;
    },
    setFontSize: (state, action: PayloadAction<FontSize>) => {
      state.fontSize = action.payload;
    },
    toggleSideBar: (state) => {
      state.isOpenSideBar = !state.isOpenSideBar;
    },
  },
});

export const { setTheme, setFont, setFontSize, toggleSideBar } =
  appSettingsSlice.actions;
export default appSettingsSlice.reducer;
