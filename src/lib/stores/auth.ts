import { writable, type Writable } from "svelte/store";
import { getAuth, type IUser } from "../helpers/azure/auth";

const auth: Writable<IUser> = writable(await getAuth());
let timer: ReturnType<typeof setInterval>;

if (!timer) {
  timer = setInterval(async () => {
    const updatedAuth = await getAuth();
    auth.update(() => updatedAuth);
  }, 5 * 1000 * 60);
}

export default auth;
