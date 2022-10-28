import "./app.postcss";
import App from "./App.svelte";
import { onAuthChange } from "./lib/helpers/firebase/auth";

let app: App;

onAuthChange(() => {
  if (!app) {
    app = new App({
      target: document.getElementById("app"),
    });
  }
});

export default app;
