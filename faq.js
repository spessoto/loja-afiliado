export function generateFaq(p) {
  const name = p.name || "o produto";
  const candidates = [];
  if (p.potencia) candidates.push({ q: `Qual a potência do ${name}?`, a: `${p.potencia}.` });
  if (p.voltagem) candidates.push({ q: `Qual a voltagem do ${name}?`, a: `${p.voltagem}.` });
  if (p.garantia) candidates.push({ q: "Qual o prazo de garantia?", a: `${p.garantia} de garantia do fabricante.` });
  if (p.frete) candidates.push({ q: "Como funciona o frete?", a: `${p.frete}.` });
  const indicadoLines = (p.indicado || "").split("\n").map(s => s.trim()).filter(Boolean);
  if (indicadoLines.length) candidates.push({ q: `Para quem o ${name} é indicado?`, a: indicadoLines.join("; ") + "." });
  const naoIndicadoLines = (p.nao_indicado || "").split("\n").map(s => s.trim()).filter(Boolean);
  if (naoIndicadoLines.length) candidates.push({ q: `Para quais situações o ${name} não é indicado?`, a: naoIndicadoLines.join("; ") + "." });
  const specsLines = (p.specs || "").split("\n").map(s => s.trim()).filter(Boolean);
  const bateria = specsLines.find(l => /bateria/i.test(l));
  if (bateria) candidates.push({ q: `Qual a autonomia de bateria do ${name}?`, a: bateria.split(":").slice(1).join(":").trim() + "." });
  const reservatorio = specsLines.find(l => /reservat|capacidade/i.test(l));
  if (reservatorio) candidates.push({ q: `Qual a capacidade do ${name}?`, a: reservatorio.split(":").slice(1).join(":").trim() + "." });
  if (p.category) candidates.push({ q: `Em qual categoria o ${name} se encaixa?`, a: `Ele está na categoria ${p.category} do nosso catálogo.` });
  if (p.brand) candidates.push({ q: `Qual a marca do ${name}?`, a: `${p.brand}.` });

  const filler = [
    { q: "Como faço para comprar?", a: "Clique em \"Comprar\" nesta página para ir até a loja parceira e finalizar a compra com segurança." },
    { q: "A compra é segura e com nota fiscal?", a: "Sim, a compra é processada diretamente na loja parceira, com nota fiscal e formas de pagamento seguras." },
    { q: "Posso comparar com outros modelos antes de decidir?", a: "Sim, use o botão \"Comparar\" na página do produto para colocá-lo lado a lado com outros aspiradores do catálogo." },
    { q: "Onde posso tirar dúvidas sobre este produto?", a: "Fale com a nossa equipe pela página de Contato." },
    { q: "Como vocês escolhem os produtos do catálogo?", a: "Comparamos preço, avaliações e especificações antes de incluir cada produto — confira os detalhes acima para decidir com segurança." }
  ];

  const chosen = candidates.slice(0, 5);
  for (const f of filler) {
    if (chosen.length >= 5) break;
    chosen.push(f);
  }
  return chosen;
}
