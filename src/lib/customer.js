import { useEffect, useState, useCallback } from "react";

export function useCustomer() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetch("/api/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCustomer(data.authenticated ? { name: data.name } : null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function logout() {
    await fetch("/api/customer-logout", { method: "POST", credentials: "include" });
    setCustomer(null);
  }

  return { customer, loading, refresh, logout };
}
