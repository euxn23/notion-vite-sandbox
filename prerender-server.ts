import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import * as vite from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createServer(root = process.cwd()) {
  const app = express();

  const v = await vite.createServer({
    root,
    logLevel: "info",
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: "custom",
  });
  // use vite's connect instance as middleware
  app.use(v.middlewares);

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      const indexHtml = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      if (!indexHtml) {
        throw new Error();
      }
      const template = await v.transformIndexHtml(url, indexHtml);
      const { render } = await v.ssrLoadModule("/src/entry-server.tsx");

      const appHtml = render(url, {});

      const html = template.replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(e as any);
      v.ssrFixStacktrace(err);
      console.log(err.stack);
      res.status(500).end(err.stack);
    }
  });

  return { app, vite };
}

async function main() {
  const { app } = await createServer();
  app.listen(5173, () => {
    console.log("http://localhost:5173");
  });
}

main();
