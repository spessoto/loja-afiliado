import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/produtos", label: "Produtos" },
  { to: "/admin/categorias", label: "Categorias" },
  { to: "/admin/usuarios", label: "Usuários" },
  { to: "/admin/administradores", label: "Administradores" }
];

export const inputStyle = { height: 44, padding: "0 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, font: "400 14px Inter, sans-serif", background: "#fff", color: "#1E293B" };
export const btnStyle = { height: 40, padding: "0 18px", border: 0, borderRadius: 8, background: "#012746", color: "#fff", font: "700 13px Montserrat, sans-serif", cursor: "pointer" };

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

export default function AdminShell({ title, children }) {
  const [authenticated, setAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch("/api/session", { credentials: "include" })
      .then(res => res.json())
      .then(data => setAuthenticated(data.authenticated));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  }

  if (authenticated === null) return null;
  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr)", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside style={{ background: "#012746", color: "#fff", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ font: "800 18px Montserrat, sans-serif", marginBottom: 24, padding: "0 8px" }}>Promo Admin</div>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: "block", padding: "10px 12px", borderRadius: 8, font: "600 14px Inter, sans-serif", textDecoration: "none",
              color: location.pathname === item.to ? "#fff" : "#B8C5D0",
              background: location.pathname === item.to ? "rgba(255,255,255,.12)" : "transparent"
            }}
          >
            {item.label}
          </Link>
        ))}
        <Link to="/" style={{ display: "block", padding: "10px 12px", borderRadius: 8, font: "600 14px Inter, sans-serif", color: "#B8C5D0", textDecoration: "none" }}>Ver site</Link>
        <button onClick={logout} style={{ marginTop: "auto", height: 40, border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 13px Montserrat, sans-serif", cursor: "pointer" }}>Sair</button>
      </aside>
      <main style={{ padding: "32px 40px", background: "#F8FAFC" }}>
        {title && <h1 style={{ margin: "0 0 24px", font: "800 26px Montserrat, sans-serif", color: "#012746" }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
