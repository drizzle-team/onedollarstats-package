import { configure } from "onedollarstats";

export function initAnalytics() {
  if (typeof window !== "undefined") {
    configure({
      trackLocalhostAs: "test.com",
    });
  }
}
