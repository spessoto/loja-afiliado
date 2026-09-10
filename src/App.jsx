import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./lib/favorites.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Produto from "./pages/Produto.jsx";

const Categoria = lazy(() => import("./pages/Categoria.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const Post = lazy(() => import("./pages/Post.jsx"));
const Contato = lazy(() => import("./pages/Contato.jsx"));
const PoliticaCookies = lazy(() => import("./pages/PoliticaCookies.jsx"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade.jsx"));
const PoliticaUso = lazy(() => import("./pages/PoliticaUso.jsx"));
const Cadastro = lazy(() => import("./pages/Cadastro.jsx"));
const Favoritos = lazy(() => import("./pages/Favoritos.jsx"));
const Comparar = lazy(() => import("./pages/Comparar.jsx"));
const Busca = lazy(() => import("./pages/Busca.jsx"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProdutos = lazy(() => import("./pages/admin/AdminProdutos.jsx"));
const AdminProdutoForm = lazy(() => import("./pages/admin/AdminProdutoForm.jsx"));
const AdminCategorias = lazy(() => import("./pages/admin/AdminCategorias.jsx"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios.jsx"));
const AdminAdministradores = lazy(() => import("./pages/admin/AdminAdministradores.jsx"));
const AdminConfiguracoes = lazy(() => import("./pages/admin/AdminConfiguracoes.jsx"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts.jsx"));
const AdminPostForm = lazy(() => import("./pages/admin/AdminPostForm.jsx"));

export default function App() {
  return (
    <FavoritesProvider>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria" element={<Categoria />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
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
          <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
          <Route path="/admin/blog" element={<AdminPosts />} />
          <Route path="/admin/blog/novo" element={<AdminPostForm />} />
          <Route path="/admin/blog/:id/editar" element={<AdminPostForm />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/comparar" element={<Comparar />} />
          <Route path="/busca" element={<Busca />} />
        </Routes>
      </Suspense>
    </FavoritesProvider>
  );
}
