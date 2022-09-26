import { writable, type Writable } from "svelte/store";
import { settings as persistence } from "../helpers/firebase/db";

export interface ISettings {
  endofday?: string;
  autoStop?: boolean;
}

const settings: Writable<ISettings> = writable(null);

async function load() {
  const existing: ISettings = await persistence.get();
  if (existing) settings.update(() => existing);
}

settings.subscribe((settings) => {
  if (!settings) return;
  persistence.update(settings);
});

export default settings;
export { load };
