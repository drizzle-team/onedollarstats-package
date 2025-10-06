"use client";
import { configure } from "onedollarstats";
import { useEffect } from "react";

export default function Analytics() {
  useEffect(() => {
    configure({
      trackLocalhostAs: "test.com",
    });
  }, []);

  return null;
}
