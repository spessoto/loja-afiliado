import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { InitialDataContext } from "./lib/initialData.jsx";

// Renderiza a página no servidor (mesma árvore do cliente) e devolve o HTML; aguarda as páginas lazy.
export function render(url, data) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const sink = new Writable({
      write(chunk, _enc, cb) { chunks.push(chunk); cb(); }
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <InitialDataContext.Provider value={data}>
          <App />
        </InitialDataContext.Provider>
      </StaticRouter>,
      {
        onAllReady() { pipe(sink); },
        onShellError: reject,
        onError(err) { console.error("SSR:", err); }
      }
    );
    setTimeout(() => abort(), 8000);
  });
}
