import { useEffect, useState } from "react";

const empty = { name: "", brand: "", category: "", description: "", image_url: "", affiliate_url: "", price_from: "", price_to: "", installment: "", badge: "" };

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin — Promo Aspiradores";
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("admin_token", token);
  }, [token]);

  async function loadProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => { loadProducts(); }, []);

  function startEdit(p) {
    setEditingId(p.id);
    setForm({ ...empty, ...p });
  }

  function resetForm() {
    setEditingId(null);
    setForm(empty);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar produto");
      return;
    }
    resetForm();
    loadProducts();
  }

  async function remove(id) {
    if (!confirm("Remover este produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    loadProducts();
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ font: "800 28px Montserrat, sans-serif", color: "#012746" }}>Admin — Produtos</h1>

      <label style={{ display: "block", margin: "16px 0" }}>
        Token de admin
        <input value={token} onChange={e => setToken(e.target.value)} style={{ display: "block", width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, marginTop: 6 }} />
      </label>

      {error && <p style={{ color: "#DC2626" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0", padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input placeholder="Marca" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} style={inputStyle} />
        <input placeholder="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input placeholder="Selo (ex: MAIS VENDIDO)" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} style={inputStyle} />
        <input placeholder="URL da imagem" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <input placeholder="URL de afiliado" value={form.affiliate_url} onChange={e => setForm({ ...form, affiliate_url: e.target.value })} required style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <input placeholder="Preço de (ex: 1029.90)" value={form.price_from} onChange={e => setForm({ ...form, price_from: e.target.value })} style={inputStyle} />
        <input placeholder="Preço por (ex: 699.90)" value={form.price_to} onChange={e => setForm({ ...form, price_to: e.target.value })} style={inputStyle} />
        <input placeholder="Parcelamento (ex: 10x de R$ 69,99)" value={form.installment} onChange={e => setForm({ ...form, installment: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
          <button type="submit" style={btnStyle}>{editingId ? "Salvar alterações" : "Adicionar produto"}</button>
          {editingId && <button type="button" onClick={resetForm} style={{ ...btnStyle, background: "#64748B" }}>Cancelar</button>}
        </div>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {products.map(p => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, border: "1px solid #E2E8F0", borderRadius: 10 }}>
            <div>
              <strong>{p.name}</strong> — {p.brand} — R$ {p.price_to}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(p)} style={btnStyle}>Editar</button>
              <button onClick={() => remove(p.id)} style={{ ...btnStyle, background: "#DC2626" }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { height: 44, padding: "0 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, font: "400 14px Inter, sans-serif" };
const btnStyle = { height: 40, padding: "0 18px", border: 0, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13px Montserrat, sans-serif", cursor: "pointer" };
