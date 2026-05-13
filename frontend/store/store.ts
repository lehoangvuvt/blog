import { configureStore } from "@reduxjs/toolkit";
import appSettingsReducer from "@/features/app-settings/slice";

export const store = configureStore({
  reducer: {
    appSettings: appSettingsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;