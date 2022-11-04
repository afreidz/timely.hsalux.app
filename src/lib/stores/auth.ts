import { writable, type Writable } from "svelte/store";
import { getAuth, type IUser } from "../helpers/azure/auth";

const auth: Writable<IUser> = writable(null);
let timer: ReturnType<typeof setInterval>;

getAuth().then((user) => auth.set(user));

if (!timer) {
  timer = setInterval(async () => {
    const updatedAuth = await getAuth();
    auth.update(() => updatedAuth);
  }, 5 * 1000 * 60);
}

export default auth;
