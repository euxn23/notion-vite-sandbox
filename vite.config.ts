import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pages, { DefaultPageStrategy } from "vite-plugin-react-pages";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pages({
      pagesDir: path.join(__dirname, "src/pages"),
      pageStrategy: new DefaultPageStrategy({

      })
    }),
  ],
});
