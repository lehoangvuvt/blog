export const themes = ["light", "dark"] as const;
export type Theme = (typeof themes)[number];

export const fonts = ["sans-serif", "serif", "monospace"] as const;
export type Font = (typeof fonts)[number];

export const fontSize = ["small", "medium", "large"] as const;
export type FontSize = (typeof fontSize)[number];

export type AppSettingsState = {
  theme: Theme;
  font: Font;
  fontSize: FontSize;
  isOpenSideBar: boolean;
  isOpenSignInModal: boolean;
};
