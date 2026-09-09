import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell, { inputStyle, btnStyle } from "../../components/AdminShell.jsx";
import { useCategories } from "../../lib/categories.js";

const empty = { name: "", brand: "", category: "", description: "", image_url: "", images: "", affiliate_url: "", price_from: "", price_to: "", installment: "", badge: "", tags: "", specs: "", indicado: "", nao_indicado: "", rating_avg: "", rating_count: "", rating_dist: "", reviews: "", frete: "", garantia: "", potencia: "", voltagem: "" };

export default function AdminProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    document.title = id ? "Editar produto — Admin" : "Novo produto — Admin";
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setForm({ ...empty, ...data }))
      .finally(() => setLoading(false));
  }, [id]);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/products/${id}` : "/api/products";
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
    navigate("/admin/produtos");
  }

  return (
    <AdminShell title={id ? "Editar produto" : "Novo produto"}>
      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : (
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" }}>
          {error && <p style={{ color: "#DC2626", gridColumn: "1 / -1", margin: 0 }}>{error}</p>}
          <input placeholder="Nome" value={form.name} onChange={set("name")} required style={inputStyle} />
          <input placeholder="Marca" value={form.brand} onChange={set("brand")} style={inputStyle} />
          <select value={form.category} onChange={set("category")} style={inputStyle}>
            <option value="">Sem categoria</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input placeholder="Selo (ex: MAIS VENDIDO)" value={form.badge} onChange={set("badge")} style={inputStyle} />
          <input placeholder="URL da imagem principal" value={form.image_url} onChange={set("image_url")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <textarea placeholder="Imagens da galeria (uma URL por linha)" value={form.images} onChange={set("images")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
          <input placeholder="URL de afiliado" value={form.affiliate_url} onChange={set("affiliate_url")} required style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <input placeholder="Preço de (ex: 1029.90)" value={form.price_from} onChange={set("price_from")} style={inputStyle} />
          <input placeholder="Preço por (ex: 699.90)" value={form.price_to} onChange={set("price_to")} style={inputStyle} />
          <input placeholder="Parcelamento (ex: 10x de R$ 69,99)" value={form.installment} onChange={set("installment")} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <input placeholder="Frete (ex: Grátis) — deixe em branco para ocultar" value={form.frete} onChange={set("frete")} style={inputStyle} />
          <input placeholder="Garantia (ex: 12 meses) — deixe em branco para ocultar" value={form.garantia} onChange={set("garantia")} style={inputStyle} />
          <input placeholder="Potência (ex: 450 W)" value={form.potencia} onChange={set("potencia")} style={inputStyle} />
          <input placeholder="Voltagem (ex: 127/220V)" value={form.voltagem} onChange={set("voltagem")} style={inputStyle} />
          <textarea placeholder="Descrição" value={form.description} onChange={set("description")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
          <textarea placeholder="Tags (uma por linha, ex: Sem fio HEPA lavável)" value={form.tags} onChange={set("tags")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 70 }} />
          <textarea placeholder="Especificações técnicas (uma por linha, formato: Chave: Valor)" value={form.specs} onChange={set("specs")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 110 }} />
          <textarea placeholder="Indicado para (uma frase por linha)" value={form.indicado} onChange={set("indicado")} style={{ ...inputStyle, height: 90 }} />
          <textarea placeholder="Não indicado para (uma frase por linha)" value={form.nao_indicado} onChange={set("nao_indicado")} style={{ ...inputStyle, height: 90 }} />
          <input placeholder="Nota média (ex: 4.8)" value={form.rating_avg} onChange={set("rating_avg")} style={inputStyle} />
          <input placeholder="Total de avaliações (ex: 18429)" value={form.rating_count} onChange={set("rating_count")} style={inputStyle} />
          <textarea placeholder="Distribuição por estrela (uma por linha, formato: 5:90.4)" value={form.rating_dist} onChange={set("rating_dist")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 90 }} />
          <textarea placeholder={"Avaliações (bloco por review separado por linha \"---\":\nNome\nNota (1-5)\nTexto do depoimento\nMeta (ex: Compra verificada • há 2 semanas)"} value={form.reviews} onChange={set("reviews")} style={{ ...inputStyle, gridColumn: "1 / -1", height: 160 }} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" style={btnStyle}>{id ? "Salvar alterações" : "Adicionar produto"}</button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
