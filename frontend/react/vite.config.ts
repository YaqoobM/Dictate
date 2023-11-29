import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command == "build" ? "/static/frontend/react/" : "/",
    build: {
      emptyOutDir: true,
      outDir: "../static/frontend/react",
    },
  };
});
