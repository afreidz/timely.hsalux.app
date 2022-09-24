import type { User } from "firebase/auth";
import { writable, type Writable } from "svelte/store";
import { onAuthChange } from "../helpers/firebase/auth";

const auth: Writable<User> = writable(null);
onAuthChange((user) => auth.update(() => user));

export default auth;
