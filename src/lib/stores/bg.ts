import viewDate from "./viewDate";
import { writable, get } from "svelte/store";

const bg = writable(false);

bg.subscribe((isBg) => {
  if (!isBg) viewDate.update((d) => d);
});

export default bg;
