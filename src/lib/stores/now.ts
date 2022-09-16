import { writable } from "svelte/store";

const now = writable(new Date());
let timer: ReturnType<typeof setInterval>;

if (!timer) {
  timer = setInterval(() => now.update(() => new Date()), 5000);
}

export default now;
