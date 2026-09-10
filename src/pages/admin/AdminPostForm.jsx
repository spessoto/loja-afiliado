import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";
import { useCategories } from "../../lib/categories.js";

const empty = { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", author: "", category: "", meta_description: "", published: false };

export default function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    document.title = id ? "Editar publicação — Admin" : "Nova publicação — Admin";
    if (!id) return;
    fetch(`/api/admin/posts/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setForm({ ...empty, ...data, published: !!data.published }))
      .finally(() => setLoading(false));
  }, [id]);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/posts/${id}` : "/api/admin/posts";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Falha ao salvar publicação");
      return;
    }
    navigate("/admin/blog");
  }

  return (
    <AdminShell title={id ? "Editar publicação" : "Nova publicação"}>
      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : (
        <form onSubmit={submit} className="stack-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
          {error && <p style={{ color: "#DC2626", gridColumn: "1 / -1", margin: 0 }}>{error}</p>}
          <input placeholder="Título" value={form.title} onChange={set("title")} required style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <input placeholder="URL amigável (slug) — deixe em branco para gerar do título" value={form.slug} onChange={set("slug")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <input placeholder="Autor" value={form.author} onChange={set("author")} style={inputStyle} />
          <select value={form.category} onChange={set("category")} style={inputStyle}>
            <option value="">Sem categoria</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input placeholder="URL da imagem de capa" value={form.cover_image_url} onChange={set("cover_image_url")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <textarea placeholder="Resumo (aparece na listagem do blog)" value={form.excerpt} onChange={set("excerpt")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 80 }} />
          <textarea placeholder="Conteúdo (parágrafos separados por linha em branco)" value={form.content} onChange={set("content")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 260 }} />
          <textarea placeholder="Meta description (SEO, opcional — usa o resumo se vazio)" value={form.meta_description} onChange={set("meta_description")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 70 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, gridColumn: "1 / -1", font: "500 14px Inter", color: "#1E293B" }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} style={{ width: 16, height: 16 }} />
            Publicado (visível no site)
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" style={btnStyle}>{id ? "Salvar alterações" : "Criar publicação"}</button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
