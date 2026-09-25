import { useEffect, useState } from "react";
import { useInitial } from "./initialData.jsx";

export function useCategories() {
  const initial = useInitial("categories");
  const [categories, setCategories] = useState(initial || []);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
