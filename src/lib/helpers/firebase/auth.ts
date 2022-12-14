import app from "./app";
import {
  getAuth,
  type User,
  deleteUser,
  OAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "firebase/auth";

const auth = getAuth(app);
const provider = new OAuthProvider("microsoft.com");
const demoProvider = new OAuthProvider("google.com");
provider.setCustomParameters({
  tenant: "e85feadf-11e7-47bb-a160-43b98dcc96f1",
});

export async function signin(callback: VoidFunction) {
  await signInWithRedirect(auth, provider);
  callback?.();
}

export async function demoSignin(callback: VoidFunction) {
  await signInWithRedirect(auth, demoProvider);
  callback?.();
}

export async function signout(callback?: VoidFunction) {
  await fbSignOut(auth);
  callback?.();
}

export function onAuthChange(callback: (user: User | null) => void) {
  onAuthStateChanged(auth, callback);
}

export { deleteUser } from "firebase/auth";

export default { demoSignin, signin, onAuthChange, signout, deleteUser };
