import { Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./lib/favorites.jsx";
import Home from "./pages/Home.jsx";
import Categoria from "./pages/Categoria.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import Produto from "./pages/Produto.jsx";
import Contato from "./pages/Contato.jsx";
import PoliticaCookies from "./pages/PoliticaCookies.jsx";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade.jsx";
import PoliticaUso from "./pages/PoliticaUso.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProdutos from "./pages/admin/AdminProdutos.jsx";
import AdminProdutoForm from "./pages/admin/AdminProdutoForm.jsx";
import AdminCategorias from "./pages/admin/AdminCategorias.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import AdminAdministradores from "./pages/admin/AdminAdministradores.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import Comparar from "./pages/Comparar.jsx";
import Busca from "./pages/Busca.jsx";

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post" element={<Post />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/politica-de-uso" element={<PoliticaUso />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/produtos/novo" element={<AdminProdutoForm />} />
        <Route path="/admin/produtos/:id/editar" element={<AdminProdutoForm />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/administradores" element={<AdminAdministradores />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/comparar" element={<Comparar />} />
        <Route path="/busca" element={<Busca />} />
      </Routes>
    </FavoritesProvider>
  );
}
