export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss"],
  plugins: ["~/plugins/onedollarstats.client.ts"],
});
