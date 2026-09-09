import { useEffect, useState } from "react";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";

const empty = { email: "", password: "" };

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin-users", { credentials: "include" })
      .then(res => (res.ok ? res.json() : []))
      .then(setAdmins)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Administradores — Admin Promo Aspiradores";
    load();
  }, []);

  function startEdit(a) {
    setEditingId(a.id);
    setForm({ email: a.email, password: "" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin-users/${editingId}` : "/api/admin-users";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar administrador");
      return;
    }
    resetForm();
    load();
  }

  async function remove(id) {
    if (!confirm("Remover este administrador?")) return;
    const res = await fetch(`/api/admin-users/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "Falha ao remover administrador");
      return;
    }
    load();
  }

  return (
    <AdminShell title="Administradores">
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 0 24px", padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
        {error && <p style={{ color: "#DC2626", gridColumn: "1 / -1", margin: 0 }}>{error}</p>}
        <input placeholder="E-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
        <input placeholder={editingId ? "Nova senha (deixe em branco para manter)" : "Senha"} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editingId} style={inputStyle} />
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
          <button type="submit" style={btnStyle}>{editingId ? "Salvar alterações" : "Adicionar administrador"}</button>
          {editingId && <button type="button" onClick={resetForm} style={{ ...btnStyle, background: "#64748B" }}>Cancelar</button>}
        </div>
      </form>

      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {admins.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 14, border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff" }}>
              <strong style={{ font: "600 14px Inter", color: "#1E293B" }}>{a.email}</strong>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(a)} style={btnStyle}>Editar</button>
                <button onClick={() => remove(a.id)} style={{ ...btnStyle, background: "#DC2626" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
