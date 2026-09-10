const SITE_URL = "https://promoaspiradores.com.br";
const SITE_NAME = "Promo Aspiradores";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION = "Compare os melhores aspiradores de pó, robôs aspiradores e verticais com curadoria de especialistas. Preço competitivo, avaliações reais e compra segura.";

export function escapeAttr(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function truncate(text, maxLen) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > maxLen * 0.6 ? cut.lastIndexOf(" ") : cut.length) + "…";
}

const STATIC_META = {
  "/": {
    title: `${SITE_NAME} — Encontre o Aspirador de Pó Ideal para Sua Casa`,
    description: DEFAULT_DESCRIPTION,
    focusKeyword: "aspirador de pó"
  },
  "/categoria": {
    title: `Todos os Aspiradores — Compare Modelos e Preços | ${SITE_NAME}`,
    description: "Veja todos os aspiradores disponíveis: verticais, robôs, portáteis, extratoras e profissionais. Compare preços e avaliações antes de comprar.",
    focusKeyword: "comprar aspirador"
  },
  "/blog": {
    title: `Guias de Compra e Dicas de Limpeza — Blog ${SITE_NAME}`,
    description: "Comparativos, guias e dicas práticas para você escolher o aspirador certo e tirar o máximo dele.",
    focusKeyword: "guia de aspirador"
  },
  "/contato": {
    title: `Fale com a Gente — ${SITE_NAME}`,
    description: "Tire dúvidas sobre qual aspirador escolher ou sobre um pedido. Atendimento especializado por e-mail e WhatsApp.",
    focusKeyword: "atendimento aspirador"
  },
  "/politica-de-cookies": {
    title: `Política de Cookies e Dados — ${SITE_NAME}`,
    description: "Saiba como a Promo Aspiradores usa cookies e trata seus dados pessoais.",
    priority: 0.2
  },
  "/politica-de-privacidade": {
    title: `Política de Privacidade — ${SITE_NAME}`,
    description: "Conheça a política de privacidade da Promo Aspiradores e como protegemos seus dados.",
    priority: 0.2
  },
  "/politica-de-uso": {
    title: `Política de Uso — ${SITE_NAME}`,
    description: "Termos de uso do site Promo Aspiradores.",
    priority: 0.2
  },
  "/cadastro": { title: `Criar Conta — ${SITE_NAME}`, description: "Crie sua conta para salvar favoritos e comparar aspiradores.", noindex: true },
  "/favoritos": { title: `Meus Favoritos — ${SITE_NAME}`, description: "Seus aspiradores favoritos salvos.", noindex: true },
  "/comparar": { title: `Comparar Produtos — ${SITE_NAME}`, description: "Compare aspiradores lado a lado.", noindex: true },
  "/busca": { title: `Busca — ${SITE_NAME}`, description: "Resultados de busca de aspiradores.", noindex: true }
};

function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_IMAGE
  };
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/busca?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item }))
  };
}

function itemListJsonLd(products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/produto/${p.id}`,
      name: p.name
    }))
  };
}

/**
 * data: { product, productNotFound, post, postNotFound, categoryProducts }
 */
export function getPageMeta(pathname, query, data = {}) {
  const { product, productNotFound, post, postNotFound, categoryProducts } = data;

  if (pathname.startsWith("/admin")) {
    return { title: `Admin — ${SITE_NAME}`, description: "Painel administrativo.", noindex: true, canonical: `${SITE_URL}${pathname}`, jsonLd: [] };
  }

  if (pathname.startsWith("/produto/")) {
    if (productNotFound) {
      return { title: `Produto não encontrado — ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, noindex: true, notFound: true, canonical: `${SITE_URL}${pathname}`, jsonLd: [] };
    }
    if (product) {
      const canonical = `${SITE_URL}/produto/${product.id}`;
      const desc = truncate(product.description || `${product.name} — confira preço, especificações e avaliações reais.`, 155);
      const jsonLd = [orgJsonLd(), websiteJsonLd()];
      jsonLd.push(breadcrumbJsonLd([
        { name: "Home", item: SITE_URL },
        { name: product.category || "Aspiradores", item: `${SITE_URL}/categoria?cat=${encodeURIComponent(product.category || "")}` },
        { name: product.name, item: canonical }
      ]));
      const productLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [product.image_url].filter(Boolean),
        description: desc,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        category: product.category || undefined,
        offers: product.price_to ? {
          "@type": "Offer",
          url: canonical,
          priceCurrency: "BRL",
          price: Number(product.price_to).toFixed(2)
        } : undefined
      };
      if (product.rating_count > 0 && product.rating_avg) {
        productLd.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: Number(product.rating_avg),
          reviewCount: Number(product.rating_count)
        };
      }
      jsonLd.push(productLd);
      let faq = [];
      try { faq = product.faq ? JSON.parse(product.faq) : []; } catch { faq = []; }
      if (faq.length > 0) {
        jsonLd.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        });
      }
      return {
        title: `${product.name} — ${SITE_NAME}`,
        description: desc,
        image: product.image_url || DEFAULT_IMAGE,
        canonical,
        focusKeyword: product.name,
        jsonLd
      };
    }
  }

  if (pathname === "/produto") {
    return { title: `Produto — ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, noindex: true, canonical: `${SITE_URL}/produto`, jsonLd: [orgJsonLd()] };
  }

  if (pathname.startsWith("/blog/")) {
    if (postNotFound) {
      return { title: `Publicação não encontrada — ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, noindex: true, notFound: true, canonical: `${SITE_URL}${pathname}`, jsonLd: [] };
    }
    if (post) {
      const canonical = `${SITE_URL}/blog/${post.slug}`;
      const desc = truncate(post.meta_description || post.excerpt || post.title, 155);
      return {
        title: `${post.title} — ${SITE_NAME}`,
        description: desc,
        image: post.cover_image_url || DEFAULT_IMAGE,
        canonical,
        focusKeyword: post.title,
        jsonLd: [orgJsonLd(), websiteJsonLd(), breadcrumbJsonLd([
          { name: "Home", item: SITE_URL },
          { name: "Blog", item: `${SITE_URL}/blog` },
          { name: post.title, item: canonical }
        ]), {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: desc,
          image: post.cover_image_url ? [post.cover_image_url] : undefined,
          author: post.author ? { "@type": "Person", name: post.author } : undefined,
          datePublished: post.published_at ? new Date(post.published_at).toISOString() : undefined,
          dateModified: post.updated_at ? new Date(post.updated_at).toISOString() : undefined,
          mainEntityOfPage: canonical
        }]
      };
    }
  }

  if (pathname === "/categoria") {
    const cat = query.cat ? String(query.cat) : null;
    const canonical = cat ? `${SITE_URL}/categoria?cat=${encodeURIComponent(cat)}` : `${SITE_URL}/categoria`;
    const jsonLd = [orgJsonLd(), websiteJsonLd()];
    if (cat) {
      jsonLd.push(breadcrumbJsonLd([{ name: "Home", item: SITE_URL }, { name: cat, item: canonical }]));
    }
    if (categoryProducts && categoryProducts.length > 0) {
      jsonLd.push(itemListJsonLd(categoryProducts));
    }
    return cat ? {
      title: `Aspirador ${cat} — Compare os Melhores Modelos | ${SITE_NAME}`,
      description: `Confira os melhores aspiradores da categoria ${cat}: preços, avaliações reais e comparação lado a lado para você escolher com segurança.`,
      canonical,
      focusKeyword: `aspirador ${cat}`.toLowerCase(),
      jsonLd
    } : {
      title: STATIC_META["/categoria"].title,
      description: STATIC_META["/categoria"].description,
      canonical,
      focusKeyword: STATIC_META["/categoria"].focusKeyword,
      jsonLd
    };
  }

  const found = STATIC_META[pathname];
  if (found) {
    return {
      title: found.title,
      description: found.description,
      canonical: `${SITE_URL}${pathname}`,
      noindex: !!found.noindex,
      focusKeyword: found.focusKeyword,
      jsonLd: found.noindex ? [] : [orgJsonLd(), websiteJsonLd()]
    };
  }

  return {
    title: STATIC_META["/"].title,
    description: DEFAULT_DESCRIPTION,
    canonical: SITE_URL,
    jsonLd: [orgJsonLd(), websiteJsonLd()]
  };
}

export function injectMeta(html, meta) {
  let out = html;
  const title = escapeAttr(meta.title || SITE_NAME);
  const description = escapeAttr(meta.description || DEFAULT_DESCRIPTION);
  const image = escapeAttr(meta.image || DEFAULT_IMAGE);
  const canonical = escapeAttr(meta.canonical || SITE_URL);

  out = out.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  out = out.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${description}" />`);

  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    meta.noindex ? `<meta name="robots" content="noindex,nofollow" />` : `<meta name="robots" content="index,follow" />`,
    `<meta property="og:type" content="${meta.canonical?.includes('/produto/') ? "product" : meta.canonical?.includes('/blog/') ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(meta.jsonLd || []).map(obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
  ];

  out = out.replace("</head>", `  ${tags.join("\n  ")}\n</head>`);
  return out;
}

export function buildSitemapXml(urls) {
  const hasImages = urls.some(u => u.image);
  const items = urls.map(u => {
    const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : "";
    const image = u.image ? `\n    <image:image>\n      <image:loc>${escapeAttr(u.image)}</image:loc>\n    </image:image>` : "";
    return `  <url>\n    <loc>${escapeAttr(u.loc)}</loc>${lastmod}\n    <changefreq>${u.changefreq || "weekly"}</changefreq>\n    <priority>${u.priority ?? 0.5}</priority>${image}\n  </url>`;
  }).join("\n");
  const imageNs = hasImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : "";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNs}>\n${items}\n</urlset>\n`;
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE, DEFAULT_DESCRIPTION };
