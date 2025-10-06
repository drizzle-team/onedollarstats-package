import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  plugins: [react(), tailwindcss()]
});
