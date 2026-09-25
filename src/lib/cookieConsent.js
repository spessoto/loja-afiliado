import { useEffect, useState } from "react";

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
  window.dispatchEvent(new Event("pa-consent"));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  const salvar = (prefs) => {
    writeConsent(prefs);
    setConsent(readConsent());
  };

  return {
    consent,
    ready,
    aceitarTodos: () => salvar({ desempenho: true, funcionais: true, marketing: true }),
    recusar: () => salvar({ desempenho: false, funcionais: false, marketing: false }),
    salvarPersonalizado: salvar
  };
}
