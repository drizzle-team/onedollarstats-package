import { configure } from "onedollarstats";

export default defineNuxtPlugin(() => {
  configure({
    trackLocalhostAs: "test.com",
  });
});
