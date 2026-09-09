import { useEffect, useState } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
}

export function productImages(p) {
  const extra = (p?.images || "").split("\n").map(s => s.trim()).filter(Boolean);
  return p?.image_url ? [p.image_url, ...extra.filter(u => u !== p.image_url)] : extra;
}

export function formatBRL(value) {
  const n = Number(value);
  if (!value || Number.isNaN(n)) return "";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseSpecs(text) {
  return (text || "").split("\n").map(l => l.trim()).filter(Boolean).reduce((acc, line) => {
    const i = line.indexOf(":");
    if (i === -1) return acc;
    acc[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    return acc;
  }, {});
}

export function searchProducts(products, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return products;
  return products.filter(p =>
    [p.name, p.brand, p.category, p.description].some(f => (f || "").toLowerCase().includes(q))
  );
}

export function toCardProduct(p) {
  const hasDiscount = p.price_from && p.price_to && Number(p.price_from) > Number(p.price_to);
  const desconto = hasDiscount ? "-" + Math.round((1 - p.price_to / p.price_from) * 100) + "%" : "";
  return {
    id: p.id,
    marca: p.brand || "",
    nome: p.name,
    desconto,
    selo: p.badge || "",
    estrelas: "★★★★★",
    avaliacoes: "",
    de: hasDiscount ? formatBRL(p.price_from) : "",
    por: formatBRL(p.price_to),
    parcela: p.installment || "",
    image_url: p.image_url
  };
}
