import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell, { btnStyle } from "../../components/AdminShell.jsx";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/admin/posts", { credentials: "include" })
      .then(res => (res.ok ? res.json() : []))
      .then(setPosts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    document.title = "Blog — Admin Promo Aspiradores";
    load();
  }, []);

  async function remove(id) {
    if (!confirm("Remover esta publicação?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE", credentials: "include" });
    load();
  }

  return (
    <AdminShell title="Blog">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Link to="/admin/blog/novo" style={{ ...btnStyle, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>+ Nova publicação</Link>
      </div>

      {loading ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando...</p>
      ) : posts.length === 0 ? (
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Nenhuma publicação cadastrada ainda.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: 14, border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ font: "600 14px Inter", color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                  <span style={{ font: "700 10.5px Montserrat", letterSpacing: ".05em", padding: "3px 8px", borderRadius: 4, color: p.published ? "#16A34A" : "#94A3B8", background: p.published ? "#F0FDF4" : "#F1F5F9" }}>
                    {p.published ? "PUBLICADO" : "RASCUNHO"}
                  </span>
                </div>
                <div style={{ font: "400 12.5px Inter", color: "#94A3B8" }}>/blog/{p.slug}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flex: "none" }}>
                <Link to={`/admin/blog/${p.id}/editar`} style={{ ...btnStyle, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Editar</Link>
                <button onClick={() => remove(p.id)} style={{ ...btnStyle, background: "#DC2626" }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
