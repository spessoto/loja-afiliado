import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { InitialDataContext } from "./lib/initialData.jsx";
import "./styles/global.css";

// Dados que o servidor injetou (SSR) valem só para a primeira renderização; depois os hooks voltam a usar fetch.
function Root() {
  const [initial, setInitial] = useState(() => window.__INITIAL__ ?? null);
  useEffect(() => { setInitial(null); }, []);
  return (
    <InitialDataContext.Provider value={initial}>
      <App />
    </InitialDataContext.Provider>
  );
}

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);

const container = document.getElementById("root");
if (window.__INITIAL__) ReactDOM.hydrateRoot(container, tree);
else ReactDOM.createRoot(container).render(tree);
