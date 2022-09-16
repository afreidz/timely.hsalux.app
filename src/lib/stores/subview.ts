import { writable, type Writable } from "svelte/store";

const subview: Writable<string> = writable(null);

export default subview;
