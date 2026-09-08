import { useEffect, useState } from "react";

const empty = { name: "", brand: "", category: "", description: "", image_url: "", images: "", affiliate_url: "", price_from: "", price_to: "", installment: "", badge: "", tags: "", specs: "", indicado: "", nao_indicado: "", rating_avg: "", rating_count: "", rating_dist: "", reviews: "" };

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) return setError("E-mail ou senha inválidos");
    onLogin();
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: "40px 24px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ font: "800 24px Montserrat, sans-serif", color: "#012746", marginBottom: 20 }}>Admin — Login</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: "#DC2626", margin: 0 }}>{error}</p>}
        <button type="submit" style={btnStyle}>Entrar</button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin — Promo Aspiradores";
  }, []);

  useEffect(() => {
    fetch("/api/session", { credentials: "include" })
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => { if (authenticated) loadProducts(); }, [authenticated]);

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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
    await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    loadProducts();
  }

  if (authenticated === null) return null;
  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ font: "800 28px Montserrat, sans-serif", color: "#012746" }}>Admin — Produtos</h1>
        <button onClick={logout} style={{ ...btnStyle, background: "#64748B" }}>Sair</button>
      </div>

      {error && <p style={{ color: "#DC2626" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0", padding: 20, border: "1px solid #E2E8F0", borderRadius: 12 }}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
        <input placeholder="Marca" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} style={inputStyle} />
        <input placeholder="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} />
        <input placeholder="Selo (ex: MAIS VENDIDO)" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} style={inputStyle} />
        <input placeholder="URL da imagem principal" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <textarea placeholder="Imagens da galeria (uma URL por linha)" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
        <input placeholder="URL de afiliado" value={form.affiliate_url} onChange={e => setForm({ ...form, affiliate_url: e.target.value })} required style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <input placeholder="Preço de (ex: 1029.90)" value={form.price_from} onChange={e => setForm({ ...form, price_from: e.target.value })} style={inputStyle} />
        <input placeholder="Preço por (ex: 699.90)" value={form.price_to} onChange={e => setForm({ ...form, price_to: e.target.value })} style={inputStyle} />
        <input placeholder="Parcelamento (ex: 10x de R$ 69,99)" value={form.installment} onChange={e => setForm({ ...form, installment: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
        <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
        <textarea placeholder="Tags (uma por linha, ex: Sem fio HEPA lavável)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 70 }} />
        <textarea placeholder="Especificações técnicas (uma por linha, formato: Chave: Valor)" value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 110 }} />
        <textarea placeholder="Indicado para (uma frase por linha)" value={form.indicado} onChange={e => setForm({ ...form, indicado: e.target.value })} style={{ ...inputStyle, height: 90 }} />
        <textarea placeholder="Não indicado para (uma frase por linha)" value={form.nao_indicado} onChange={e => setForm({ ...form, nao_indicado: e.target.value })} style={{ ...inputStyle, height: 90 }} />
        <input placeholder="Nota média (ex: 4.8)" value={form.rating_avg} onChange={e => setForm({ ...form, rating_avg: e.target.value })} style={inputStyle} />
        <input placeholder="Total de avaliações (ex: 18429)" value={form.rating_count} onChange={e => setForm({ ...form, rating_count: e.target.value })} style={inputStyle} />
        <textarea placeholder="Distribuição por estrela (uma por linha, formato: 5:90.4)" value={form.rating_dist} onChange={e => setForm({ ...form, rating_dist: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
        <textarea placeholder={"Avaliações (bloco por review separado por linha \"---\":\nNome\nNota (1-5)\nTexto do depoimento\nMeta (ex: Compra verificada • há 2 semanas)"} value={form.reviews} onChange={e => setForm({ ...form, reviews: e.target.value })} style={{ ...inputStyle, gridColumn: "1 / -1", height: 160 }} />
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
