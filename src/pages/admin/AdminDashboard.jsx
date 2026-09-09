import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../../components/AdminShell.jsx";

const cardStyle = { padding: 20, border: "1px solid #E2E8F0", borderRadius: 12, background: "#fff" };

function StatCard({ label, value }) {
  return (
    <div style={cardStyle}>
      <div style={{ font: "500 13px Inter", color: "#475569", marginBottom: 8 }}>{label}</div>
      <div style={{ font: "800 30px Montserrat", color: "#012746" }}>{value}</div>
    </div>
  );
}

function Ranking({ title, items, valueKey, valueLabel, emptyText }) {
  const max = Math.max(1, ...items.map(i => Number(i[valueKey]) || 0));
  return (
    <div style={cardStyle}>
      <div style={{ font: "700 15px Montserrat", color: "#012746", marginBottom: 16 }}>{title}</div>
      {items.length === 0 ? (
        <p style={{ margin: 0, font: "400 13.5px Inter", color: "#94A3B8" }}>{emptyText}</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item, i) => {
            const value = Number(item[valueKey]) || 0;
            return (
              <div key={item.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                  <Link to={`/produto/${item.id}`} target="_blank" style={{ font: "500 13.5px Inter", color: "#1E293B", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</Link>
                  <span style={{ font: "700 13px Inter", color: "#F05A00", flex: "none" }}>{value} {valueLabel}</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: "#F05A00", borderRadius: 4 }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.title = "Dashboard — Admin Promo Aspiradores";
    fetch("/api/dashboard", { credentials: "include" })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <AdminShell title="Dashboard">
        <p style={{ font: "400 14px Inter", color: "#94A3B8" }}>Carregando métricas...</p>
      </AdminShell>
    );
  }

  const { totais, maisVistos, maisClicados, maisDesejados } = data;

  return (
    <AdminShell title="Dashboard">
      <p style={{ margin: "-8px 0 24px", font: "400 14px Inter", color: "#475569" }}>
        A Promo Aspiradores não vende diretamente — essas métricas mostram o que gera mais interesse antes de encaminhar o visitante ao marketplace parceiro.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Produtos cadastrados" value={totais.totalProdutos} />
        <StatCard label="Categorias" value={totais.totalCategorias} />
        <StatCard label="Clientes cadastrados" value={totais.totalClientes} />
        <StatCard label="Favoritos (wishlist)" value={totais.totalFavoritos} />
        <StatCard label="Avaliação média do catálogo" value={totais.mediaGeral ? totais.mediaGeral.toFixed(1).replace(".", ",") : "-"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
        <Ranking title="Produtos mais acessados" items={maisVistos} valueKey="view_count" valueLabel="views" emptyText="Nenhuma visita registrada ainda." />
        <Ranking title='Mais clique em "comprar"' items={maisClicados} valueKey="click_count" valueLabel="cliques" emptyText="Nenhum clique registrado ainda." />
        <Ranking title="Mais desejados (wishlist)" items={maisDesejados} valueKey="favoritos" valueLabel="favoritos" emptyText="Nenhum produto favoritado ainda." />
      </div>
    </AdminShell>
  );
}
