import { useEffect, useState } from "react";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";

export default function AdminConfiguracoes() {
  const [form, setForm] = useState({ ga_measurement_id: "", search_console_meta: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Configurações — Admin Promo Aspiradores";
    fetch("/api/settings", { credentials: "include" })
      .then(res => (res.ok ? res.json() : {}))
      .then(data => setForm({ ga_measurement_id: data.ga_measurement_id || "", search_console_meta: data.search_console_meta || "" }))
      .finally(() => setLoading(false));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar configurações");
      return;
    }
    setSaved(true);
  }

  if (loading) return <AdminShell title="Configurações"><p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p></AdminShell>;

  return (
    <AdminShell title="Configurações">
      <form onSubmit={submit} style={{ display: "grid", gap: 20, maxWidth: 560, padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
        {error && <p style={{ color: "#DC2626", margin: 0 }}>{error}</p>}
        {saved && <p style={{ color: "#16A34A", margin: 0 }}>Configurações salvas com sucesso.</p>}

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ font: "600 13px Inter", color: "#1E293B" }}>ID de métricas do Google Analytics (GA4)</span>
          <input
            placeholder="G-XXXXXXXXXX"
            value={form.ga_measurement_id}
            onChange={e => setForm({ ...form, ga_measurement_id: e.target.value.trim() })}
            style={inputStyle}
          />
          <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>Encontrado em Admin do GA4 → Fluxos de dados → seu fluxo web.</span>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ font: "600 13px Inter", color: "#1E293B" }}>Código de verificação do Google Search Console</span>
          <input
            placeholder="Apenas o valor content=&quot;...&quot; da tag meta"
            value={form.search_console_meta}
            onChange={e => setForm({ ...form, search_console_meta: e.target.value.trim() })}
            style={inputStyle}
          />
          <span style={{ font: "400 12px Inter", color: "#94A3B8" }}>
            No Search Console, escolha verificação por "Tag HTML" e cole aqui apenas o valor do atributo <code>content</code>.
          </span>
        </label>

        <div>
          <button type="submit" style={btnStyle}>Salvar</button>
        </div>
      </form>
    </AdminShell>
  );
}
