import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: ["index.ts", "src"] })],
  build: {
    lib: {
      name: "index",
      formats: ["es", "cjs"],
      fileName: (module, entry) => `${entry}.${module === "es" ? "m" : "c"}js`,
      entry: resolve(__dirname, "index.ts"),
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
});
