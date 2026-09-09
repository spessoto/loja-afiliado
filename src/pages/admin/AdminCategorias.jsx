import { useEffect, useState } from "react";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";

const empty = { name: "", image_url: "" };

export default function AdminCategorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Categorias — Admin Promo Aspiradores";
    load();
  }, []);

  function startEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, image_url: c.image_url || "" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar categoria");
      return;
    }
    resetForm();
    load();
  }

  async function remove(id) {
    if (!confirm("Remover esta categoria?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  return (
    <AdminShell title="Categorias">
      <form onSubmit={submit} className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 0 24px", padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
        {error && <p style={{ color: "#DC2626", gridColumn: "1 / -1", margin: 0 }}>{error}</p>}
        <input placeholder="Nome da categoria" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input placeholder="URL da imagem" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
          <button type="submit" style={btnStyle}>{editingId ? "Salvar alterações" : "Adicionar categoria"}</button>
          {editingId && <button type="button" onClick={resetForm} style={{ ...btnStyle, background: "#64748B" }}>Cancelar</button>}
        </div>
      </form>

      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : categories.length === 0 ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {categories.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 14, border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} style={{ width: 44, height: 44, objectFit: "contain", flex: "none" }} />
                ) : (
                  <div style={{ width: 44, height: 44, flex: "none", borderRadius: 6, background: "#F1F5F9" }} />
                )}
                <strong style={{ font: "600 14px Inter", color: "#1E293B" }}>{c.name}</strong>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <button onClick={() => startEdit(c)} style={btnStyle}>Editar</button>
                <button onClick={() => remove(c.id)} style={{ ...btnStyle, background: "#DC2626" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
