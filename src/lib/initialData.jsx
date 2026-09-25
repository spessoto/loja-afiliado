import { createContext, useContext } from "react";

// Dados que o servidor já buscou para renderizar a página (SSR). No cliente vêm de window.__INITIAL__
// só na primeira renderização; depois de hidratar o provider passa a null e os hooks voltam a usar fetch.
export const InitialDataContext = createContext(null);

export function useInitial(key) {
  return useContext(InitialDataContext)?.[key];
}
