import { useEffect, useState } from "react";
import { productSlug, lojaDe } from "../../slug.js";
export { lojaDe };
import { useInitial } from "./initialData.jsx";

export function productUrl(id, name) {
  return id ? `/produto/${productSlug(name)}-${id}` : "/produto";
}

export function useProducts() {
  const initial = useInitial("products");
  const [products, setProducts] = useState(initial || []);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useProduct(id) {
  const initial = useInitial("product");
  const usaInitial = initial && String(initial.id) === String(id);
  const [product, setProduct] = useState(usaInitial ? initial : null);
  const [loading, setLoading] = useState(!usaInitial);

  useEffect(() => {
    if (usaInitial && product?.id === initial.id) return;
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

export function linhas(text) {
  return (text || "").split("\n").map(s => s.trim()).filter(Boolean);
}

export function estrelasStr(nota) {
  const cheias = Math.round(Number(nota) || 0);
  return "★".repeat(cheias) + "☆".repeat(Math.max(0, 5 - cheias));
}

export function parseDist(text) {
  return linhas(text).map(line => {
    const [n, pct] = line.split(":");
    return { n: Number(n), p: (pct || "0").trim() + "%" };
  }).filter(d => d.n).sort((a, b) => b.n - a.n);
}

export function parseReviews(text) {
  return (text || "").split(/\n-{3,}\n/).map(block => {
    const l = block.split("\n").map(s => s.trim()).filter(Boolean);
    if (l.length < 3) return null;
    return { nome: l[0], nota: Number(l[1]) || 0, estrelas: estrelasStr(l[1]), texto: l.slice(2, -1).join(" "), meta: l[l.length - 1] };
  }).filter(Boolean);
}

export function searchProducts(products, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return products;
  return products.filter(p =>
    [p.name, p.brand, p.category, p.description].some(f => (f || "").toLowerCase().includes(q))
  );
}

export function toCardProduct(p) {
  const loja = lojaDe(p.affiliate_url);
  const semPreco = loja === "amazon";
  const hasDiscount = !semPreco && p.price_from && p.price_to && Number(p.price_from) > Number(p.price_to);
  const desconto = hasDiscount ? "-" + Math.round((1 - p.price_to / p.price_from) * 100) + "%" : "";
  return {
    id: p.id,
    marca: p.brand || "",
    nome: p.name,
    desconto,
    selo: p.badge || "",
    loja,
    de: hasDiscount ? formatBRL(p.price_from) : "",
    por: semPreco ? "" : formatBRL(p.price_to),
    parcela: semPreco ? "" : p.installment || "",
    image_url: p.image_url
  };
}
