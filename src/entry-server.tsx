import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";
import {PassThrough} from "stream"

export async function render(url, context) {
    // return ReactDOMServer.renderToString(
    //         <React.StrictMode>
    //             <App />
    //         </React.StrictMode>
    //         );
  const tunnel = new PassThrough();
  const domStream = ReactDOMServer.renderToPipeableStream(<App />, {
    onAllReady: async () => domStream.pipe(tunnel),
  });
  let chunks: any = [];
  for await (const chunk of tunnel) {
    chunks.push(chunk)
    console.log(Buffer.from(chunk).toString("utf8"))
  }
  return Buffer.concat(chunks).toString("utf8")
}
