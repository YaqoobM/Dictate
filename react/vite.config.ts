import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react(), nodePolyfills()],
    base: command == "build" ? "/static/frontend/react/" : "/",
  };
});
