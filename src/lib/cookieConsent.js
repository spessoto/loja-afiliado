import { useState } from "react";

const KEY = "pa_consent";

export function readConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeConsent(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...prefs, essenciais: true, data: new Date().toISOString() }));
  } catch {}
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(readConsent);

  const salvar = (prefs) => {
    writeConsent(prefs);
    setConsent(readConsent());
  };

  return {
    consent,
    aceitarTodos: () => salvar({ desempenho: true, funcionais: true, marketing: true }),
    recusar: () => salvar({ desempenho: false, funcionais: false, marketing: false }),
    salvarPersonalizado: salvar
  };
}
