import settings from "./settings";
import { writable, get } from "svelte/store";

const defaultTheme =
  get(settings)?.theme ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light") ||
  "dark";
const theme = writable(defaultTheme);

settings.subscribe((s) => {
  if (s?.theme) theme.update(() => s.theme);
});

export default theme;
