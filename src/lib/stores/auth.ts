import paused from "./paused";
import { getAuth, type IUser } from "../helpers/auth";
import { get, writable, type Writable } from "svelte/store";

const auth: Writable<IUser> = writable(null);
let timer: ReturnType<typeof setInterval>;

getAuth().then((user) => auth.set(user));

if (!timer) {
  timer = setInterval(async () => {
    if (get(paused)) return;
    const updatedAuth = await getAuth();
    auth.update(() => updatedAuth);
  }, 5 * 1000 * 60);
}

export default auth;
