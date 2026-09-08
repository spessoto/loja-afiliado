import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Categoria from "./pages/Categoria.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import Produto from "./pages/Produto.jsx";
import Contato from "./pages/Contato.jsx";
import PoliticaCookies from "./pages/PoliticaCookies.jsx";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade.jsx";
import PoliticaUso from "./pages/PoliticaUso.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categoria" element={<Categoria />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/post" element={<Post />} />
      <Route path="/produto" element={<Produto />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
      <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/politica-de-uso" element={<PoliticaUso />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
