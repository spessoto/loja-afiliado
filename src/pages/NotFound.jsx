import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FooterFull } from "../components/Footer.jsx";
import { categoriasCol, institucionalCol } from "../data/footerColumns.js";
import { useCategories } from "../lib/categories.js";

export default function NotFound() {
  const { categories } = useCategories();

  return (
    <>
      <Header
        categoriesNav={{ menu: categories.map(c => c.name), showAllCategories: false, itemTo: "/categoria", ofertaTo: "/categoria" }}
      />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 12px", font: "800 30px Montserrat", color: "#012746" }}>Página não encontrada</h1>
        <p style={{ margin: "0 0 24px", font: "400 15px/1.6 Inter", color: "#475569" }}>O endereço que você acessou não existe ou foi removido.</p>
        <Link to="/categoria" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 44, padding: "0 24px", borderRadius: 8, background: "#C84A00", color: "#fff", font: "700 13.5px Montserrat", letterSpacing: ".04em", textDecoration: "none" }}>VER ASPIRADORES</Link>
      </main>

      <FooterFull columns={[categoriasCol, institucionalCol]} />
    </>
  );
}
