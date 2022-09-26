import { writable, type Writable } from "svelte/store";

const viewDate: Writable<Date> = writable(null);

export default viewDate;
