import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetch("/api/favorites", { credentials: "include" })
      .then(res => (res.ok ? res.json() : []))
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, loading, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  const { favorites, setFavorites, loading, refresh } = ctx;
  const navigate = useNavigate();

  const ids = new Set(favorites.map(p => p.id));
  const isFavorite = (id) => ids.has(id);

  async function toggle(id) {
    if (isFavorite(id)) {
      setFavorites(favorites.filter(p => p.id !== id));
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) refresh();
      return;
    }
    const res = await fetch(`/api/favorites/${id}`, { method: "POST", credentials: "include" });
    if (res.status === 401) { navigate("/cadastro"); return; }
    refresh();
  }

  return { favorites, loading, isFavorite, toggle, refresh };
}
