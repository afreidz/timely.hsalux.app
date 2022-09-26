import app from "./app";
import {
  getAuth,
  type User,
  deleteUser,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "firebase/auth";

const auth = getAuth(app);
const provider = new OAuthProvider("microsoft.com");
provider.setCustomParameters({
  tenant: "e85feadf-11e7-47bb-a160-43b98dcc96f1",
});

export async function signin(callback: VoidFunction) {
  await signInWithPopup(auth, provider);
  callback?.();
}

export async function signout(callback: VoidFunction) {
  await fbSignOut(auth);
  callback?.();
}

export function onAuthChange(callback: (user: User | null) => void) {
  onAuthStateChanged(auth, callback);
}

export { deleteUser } from "firebase/auth";

export default { signin, onAuthChange, signout, deleteUser };
