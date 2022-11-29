import * as api from "../helpers/api";
import { writable, type Writable } from "svelte/store";

export interface ISettings {
  endofday?: string;
  autoSnap?: boolean;
  autoStop?: boolean;
  startofday?: string;
  showHours?: string[];
  hideInReports: string[];
  theme?: "dark" | "light";
  multipleRunning?: boolean;
  rounding?: "none" | "0.25" | "0.5" | "1";
}

const settings: Writable<ISettings> = writable(null);

async function load() {
  const existing: ISettings = await api.call("/settings");
  if (existing) settings.update(() => existing);
}

settings.subscribe(async (settings) => {
  if (!settings) return;
  await api.call("/settings", "put", settings);
});

export default settings;
export { load };
