import { writable, type Writable } from "svelte/store";
import { onAuthChange, type IUser } from "../helpers/azure/auth";

const auth: Writable<IUser> = writable(null);
onAuthChange((user) => auth.update(() => user));

export default auth;
