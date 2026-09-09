import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell, { btnStyle } from "../../components/AdminShell.jsx";
import { formatBRL } from "../../lib/products.js";

export default function AdminProdutos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Produtos — Admin Promo Aspiradores";
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Remover este produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  return (
    <AdminShell title="Produtos">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Link to="/admin/produtos/novo" style={{ ...btnStyle, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>+ Novo produto</Link>
      </div>

      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : products.length === 0 ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Nenhum produto cadastrado ainda.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {products.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 14, border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: "contain", flex: "none" }} />
                ) : (
                  <div style={{ width: 44, height: 44, flex: "none", borderRadius: 6, background: "#F1F5F9" }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: "600 14px Inter", color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ font: "400 12.5px Inter", color: "#94A3B8" }}>{p.brand} • {p.category || "sem categoria"} • {formatBRL(p.price_to) || "sem preço"}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <Link to={`/admin/produtos/${p.id}/editar`} style={{ ...btnStyle, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Editar</Link>
                <button onClick={() => remove(p.id)} style={{ ...btnStyle, background: "#DC2626" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
