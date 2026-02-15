import { configure } from "onedollarstats";

export default defineNuxtPlugin(() => {
  configure({ hostname: "example.com", devmode: true });
});
