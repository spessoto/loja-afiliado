import { useEffect, useState } from "react";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";

const empty = { name: "", email: "", phone: "" };

export default function AdminUsuarios() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/customers", { credentials: "include" })
      .then(res => (res.ok ? res.json() : []))
      .then(setCustomers)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Usuários — Admin Promo Aspiradores";
    load();
  }, []);

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone || "" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/customers/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar cliente");
      return;
    }
    resetForm();
    load();
  }

  return (
    <AdminShell title="Usuários">
      {editingId && (
        <form onSubmit={submit} className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "0 0 24px", padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
          {error && <p style={{ color: "#DC2626", gridColumn: "1 / -1", margin: 0 }}>{error}</p>}
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          <input placeholder="E-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
          <input placeholder="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" style={btnStyle}>Salvar alterações</button>
            <button type="button" onClick={resetForm} style={{ ...btnStyle, background: "#64748B" }}>Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : customers.length === 0 ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {customers.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 14, border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff" }}>
              <div>
                <div style={{ font: "600 14px Inter", color: "#1E293B" }}>{c.name}</div>
                <div style={{ font: "400 12.5px Inter", color: "#94A3B8" }}>{c.email} {c.phone ? `• ${c.phone}` : ""}</div>
              </div>
              <button onClick={() => startEdit(c)} style={btnStyle}>Editar</button>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
