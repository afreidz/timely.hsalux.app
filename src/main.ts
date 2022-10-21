import "./app.postcss";
import App from "./App.svelte";
import update from "./lib/stores/update";
import subview from "./lib/stores/subview";
import { registerSW } from "virtual:pwa-register";
import { onAuthChange } from "./lib/helpers/firebase/auth";

let app: App;

onAuthChange(() => {
  if (!app) {
    app = new App({
      target: document.getElementById("app"),
    });
  }
});

const updateSW = registerSW({
  onNeedRefresh: () => subview.set("update"),
});

update.set(updateSW);

export default app;
