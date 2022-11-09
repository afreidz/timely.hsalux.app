import "./app.postcss";
import App from "./App.svelte";
// import config from "@app-config/main";

// console.log("CONFIG", config);

const app = new App({
  target: document.getElementById("app"),
});

export default app;
