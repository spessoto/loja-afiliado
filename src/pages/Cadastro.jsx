import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";

const inputStyle = { height: 50, padding: "0 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, background: "#fff", font: "400 15px Inter", color: "#1E293B", outline: "none" };
const labelStyle = { display: "grid", gap: 7 };
const captionStyle = { font: "600 13px Inter", color: "#012746", letterSpacing: ".02em" };

export default function Cadastro() {
  const [mode, setMode] = useState("cadastro");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { categories } = useCategories();

  useEffect(() => {
    document.title = mode === "cadastro" ? "Criar conta — Promo Aspiradores" : "Entrar — Promo Aspiradores";
  }, [mode]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = mode === "cadastro" ? "/api/register" : "/api/customer-login";
    const body = mode === "cadastro" ? form : { email: form.email, password: form.password };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error === "email already registered" ? "Este e-mail já está cadastrado." : data.error === "invalid credentials" ? "E-mail ou senha incorretos." : "Não foi possível concluir. Tente novamente.");
        return;
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        marquee={["FRETE GRÁTIS ACIMA DE R$ 299", "ATÉ 10X SEM JUROS", "COMPRA SEGURA E NOTA FISCAL"]}
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 460, margin: "0 auto", padding: "56px 24px 80px" }}>
        <h1 style={{ margin: "0 0 8px", font: "800 30px Montserrat", color: "#012746", letterSpacing: "-.01em" }}>{mode === "cadastro" ? "Criar minha conta" : "Entrar na minha conta"}</h1>
        <p style={{ margin: "0 0 28px", font: "400 15px/1.6 Inter", color: "#475569" }}>
          {mode === "cadastro" ? "Salve seus favoritos e compare produtos com mais facilidade." : "Acesse para ver sua lista de favoritos."}
        </p>

        {error && <p style={{ margin: "0 0 18px", padding: "12px 16px", border: "1px solid #FCA5A5", background: "#FEF2F2", borderRadius: 8, font: "400 13.5px Inter", color: "#B91C1C" }}>{error}</p>}

        <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
          {mode === "cadastro" && (
            <label style={labelStyle}>
              <span style={captionStyle}>Nome completo *</span>
              <input required value={form.name} onChange={set("name")} placeholder="Seu nome" style={inputStyle} />
            </label>
          )}
          <label style={labelStyle}>
            <span style={captionStyle}>E-mail *</span>
            <input required type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com.br" style={inputStyle} />
          </label>
          {mode === "cadastro" && (
            <label style={labelStyle}>
              <span style={captionStyle}>Telefone</span>
              <input value={form.phone} onChange={set("phone")} placeholder="(00) 00000-0000" style={inputStyle} />
            </label>
          )}
          <label style={labelStyle}>
            <span style={captionStyle}>Senha *</span>
            <input required type="password" minLength={4} value={form.password} onChange={set("password")} placeholder="Mínimo 4 caracteres" style={inputStyle} />
          </label>
          <button disabled={loading} className="btn-primary" style={{ height: 52, border: 0, borderRadius: 8, background: "#F05A00", color: "#fff", font: "700 15px Montserrat", letterSpacing: ".04em", cursor: loading ? "default" : "pointer", opacity: loading ? .7 : 1 }}>
            {loading ? "Enviando..." : mode === "cadastro" ? "CRIAR CONTA" : "ENTRAR"}
          </button>
        </form>

        <p style={{ marginTop: 20, font: "400 14px Inter", color: "#475569" }}>
          {mode === "cadastro" ? "Já tem conta? " : "Ainda não tem conta? "}
          <button type="button" onClick={() => { setError(""); setMode(mode === "cadastro" ? "login" : "cadastro"); }} style={{ border: 0, background: "transparent", padding: 0, font: "600 14px Inter", color: "#F05A00", cursor: "pointer", textDecoration: "underline" }}>
            {mode === "cadastro" ? "Entrar" : "Criar conta"}
          </button>
        </p>

        <p style={{ marginTop: 40 }}><Link to="/" style={{ font: "400 13.5px Inter", color: "#94A3B8" }}>← Voltar para a loja</Link></p>
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
