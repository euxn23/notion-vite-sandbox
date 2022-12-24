import ReactDOMServer from "react-dom/server";
import React from "react";
import App from "./src/App";
import {PassThrough} from "stream"

async function main() {
  const tunnel = new PassThrough();
  const domStream = ReactDOMServer.renderToPipeableStream(<App />, {
    onAllReady: async () => domStream.pipe(tunnel),
  });
  let chunks: any = [];
  for await (const chunk of tunnel) {
    chunks.push(chunk)
    console.log(Buffer.from(chunk).toString("utf8"))
  }
  console.log(Buffer.concat(chunks).toString("utf8"))
}

main();
