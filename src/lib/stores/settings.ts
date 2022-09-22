import lf from "localforage";
import { writable, type Writable } from "svelte/store";

interface ISettings {
  autoStop?: boolean;
  autoStopTimers?: Date[];
}

const persistence = lf.createInstance({
  name: "settings.time.me",
});

const settings: Writable<ISettings> = writable(null);
const existing: ISettings = await persistence.getItem(`settings`);

if (existing) settings.set(existing);

settings.subscribe((settings) => {
  persistence.setItem(`settings`, settings);
});

export { settings };
