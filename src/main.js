import { setClient } from "svelte-routing";
import App from "./App.svelte";

const app = new App({
  target: document.body,
});

export default app;
