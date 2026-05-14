import type { RootState } from "@/store/store";

export const selectAppSettings = (state: RootState) => state.appSettings;

export const selectTheme = (state: RootState) => state.appSettings.theme;

export const selectFont = (state: RootState) => state.appSettings.font;

export const selectFontSize = (state: RootState) => state.appSettings.fontSize;

export const selectSideBarStatus = (state: RootState) =>
  state.appSettings.isOpenSideBar;
