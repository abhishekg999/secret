import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnpluginTypia from "@typia/unplugin/vite";

export default defineConfig({
  plugins: [UnpluginTypia(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
