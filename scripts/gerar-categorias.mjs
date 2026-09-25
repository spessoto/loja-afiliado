// Gera categorias.json (título SEO + texto-guia por categoria) a partir dos textos abaixo.
// Os marcadores {{id}} viram links internos para a página do produto (URL curta canônica).
import fs from "node:fs";
import { productSlug, shortName } from "../slug.js";

const produtos = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const link = (id) => {
  const p = produtos.find(x => x.id === Number(id));
  if (!p) throw new Error("produto " + id + " não encontrado");
  return `[${shortName(p.name, 46)}](/produto/${productSlug(p.name)}-${p.id})`;
};

const categorias = {
  "Robôs": {
    seo_title: "Robô Aspirador: Modelos, Preços e Avaliações | Promo Aspiradores",
    intro: `O robô aspirador é a escolha de quem quer manter o piso limpo sem gastar tempo. Nesta página você compara os modelos que reunimos por sucção, autonomia, tipo de navegação e se passam pano, sempre com o preço e as avaliações do marketplace onde a compra é feita.

## Como escolher um robô aspirador

- Navegação: modelos com mapeamento a laser (LiDAR) organizam a rota, respeitam zonas proibidas e voltam sozinhos à base. Os de entrada andam de forma mais aleatória e levam mais tempo para cobrir a casa.
- Sucção e escova: com tapetes ou pelos de animais, procure sucção alta e escova antiemaranhado. Em piso liso, modelos mais simples resolvem.
- Passa pano e estação: quem quer aspirar e passar pano no mesmo ciclo deve olhar o reservatório de água. Bases que esvaziam o pó e lavam o mop reduzem a manutenção, mas custam bem mais.
- Voltagem: confira se o modelo é bivolt, 127 V ou 220 V antes de comprar.

Para um orçamento enxuto, o ${"{{9}}"} é um dos mais avaliados da categoria. Para navegação a laser e controle por app, veja o ${"{{17}}"}; para a experiência completa com estação, o ${"{{68}}"}. Use o botão Comparar nos cards para colocar até quatro modelos lado a lado.`
  },
  "Vertical": {
    seo_title: "Aspirador Vertical: Com e Sem Fio, Preços | Promo Aspiradores",
    intro: `Os aspiradores verticais são a escolha de quem quer limpar rápido, guardar em pouco espaço e não carregar um aparelho pesado. A categoria reúne modelos com fio, que entregam potência constante, e sem fio, que priorizam a praticidade.

## Com fio ou sem fio?

- Com fio: não dependem de bateria, costumam custar menos e têm cabo de 4 a 6 metros, suficiente para uma sala sem trocar de tomada.
- Sem fio: mais liberdade para circular, mas a autonomia é limitada (algo entre 25 e 60 minutos, conforme o modelo e o modo de sucção). Bateria removível ajuda a estender o uso.

## O que conferir antes de comprar

- Filtro HEPA lavável, importante para quem tem alergia ou animais em casa.
- Capacidade do reservatório: quanto maior, menos vezes você esvazia.
- Função 2 em 1 ou 3 em 1, que transforma o vertical em aspirador de mão para sofá, cortina e carro.
- Peso e altura, para o conforto no uso e para guardar.

Se você quer um vertical com fio de bom custo-benefício, veja o ${"{{11}}"}. Entre os sem fio, o ${"{{26}}"} tem bateria removível e três níveis de sucção.`
  },
  "Portáteis": {
    seo_title: "Aspirador Portátil: Carro, Mão e Sem Fio | Promo Aspiradores",
    intro: `Aspiradores portáteis resolvem as limpezas que o aspirador grande não alcança: interior do carro, teclado, gavetas, estofados e cantos. Ocupam pouco espaço e funcionam como complemento do aspirador da casa, não como substituto.

## Como escolher um aspirador portátil

- Uso principal: para o carro, os de 12 V ligam no acendedor; os sem fio recarregam por USB ou tomada e servem para vários ambientes.
- Potência e capacidade: modelos pequenos de 100 a 150 W dão conta de poeira e migalhas. Para pelos e sujeira mais pesada, procure mais potência e reservatório maior.
- Filtro: o HEPA lavável retém partículas finas e reduz a poeira que volta para o ar.
- Extras: função de soprador, bicos para frestas e kits para pelos de animais ampliam o uso.

Para o carro, o ${"{{3}}"} é uma opção econômica de 12 V. Para quem tem pets, o ${"{{23}}"} traz um kit para aspirar, tosar e pentear. Para tarefas de mesa e teclado, o ${"{{24}}"} é leve e recarrega por USB.`
  },
  "Aspiradores": {
    seo_title: "Aspirador de Pó e de Pó e Água: Modelos e Preços | Promo Aspiradores",
    intro: `Nesta categoria estão os aspiradores de pó tradicionais, com reservatório ou saco, e os aspiradores de pó e água, que também aspiram líquidos. São indicados para quem quer potência para a casa toda ou precisa de um aparelho para garagem, quintal e limpezas pesadas.

## Pó e água ou tradicional?

- Pó e água: aspiram sólidos e líquidos, com tanque de 10 a 20 litros e função de sopro em vários modelos. Ideais para garagem, varanda e pós-obra doméstica. São maiores e mais barulhentos.
- Tradicional (com saco ou sem saco): mais silenciosos, com regulador de potência e filtro HEPA, indicados para tapetes, pisos de madeira e estofados.

## O que conferir

- Potência (de 1.400 W a 1.800 W nos modelos domésticos) e comprimento do cabo, que define até onde você chega sem trocar de tomada.
- Tipo de coletor: com saco descartável a higiene do descarte é simples; sem saco, você esvazia e lava o reservatório.
- Acessórios incluídos, como bocais para cantos, pisos e estofados.

O ${"{{4}}"} é um dos mais avaliados entre os de pó e água. Para quem prefere o formato tradicional, veja o ${"{{47}}"}.`
  },
  "Extratoras": {
    seo_title: "Extratora de Sujeira para Sofá e Tapete | Promo Aspiradores",
    intro: `Extratoras de sujeira limpam estofados, tapetes, colchões e bancos de carro com um processo diferente do aspirador comum: borrifam água com detergente, esfregam a superfície e extraem a sujeira e a água suja em seguida. São a opção para manchas, marcas de pet e limpeza profunda que o aspirador não resolve.

## Como escolher uma extratora

- Potência e vácuo: quanto maior a sucção, mais rápida a secagem do tecido.
- Reservatórios: o de água limpa e o de água suja definem quantas peças você limpa antes de esvaziar e reabastecer.
- Bicos e acessórios: modelos com bico de autolimpeza e escovas para estofados facilitam a manutenção.
- Tamanho: as portáteis são fáceis de guardar e transportar; as maiores atendem áreas amplas.

Hoje reunimos aqui a ${"{{1}}"}, uma extratora portátil de 1450 W que borrifa, esfrega e extrai, indicada para sofás, colchões, carpetes e o interior do carro.`
  },
  "Profissionais": {
    seo_title: "Aspirador Profissional: Pó e Água para Uso Intenso | Promo Aspiradores",
    intro: `Os aspiradores profissionais são feitos para oficinas, lava-rápidos, comércios e limpezas pesadas em casa. Têm tanques maiores, motor mais potente e filtros pensados para aspirar sólidos, líquidos e sujeira grossa sem perder desempenho.

## O que observar

- Capacidade do tanque: de 12 a 70 litros, conforme a rotina. Tanques de inox resistem melhor ao uso intenso.
- Potência e vácuo: modelos de 1.400 W a 2.800 W, com vácuo alto para sujeira pesada. Dois motores aumentam a força e o custo.
- Ciclo de trabalho: alguns equipamentos pedem descanso depois de certo tempo de uso contínuo. Confira a recomendação do fabricante.
- Ruído: aparelhos desse porte passam de 90 dB, então considere protetor auricular em ambientes fechados.
- Acessórios: mangueira longa, tubos extensores e bocal de sopro ampliam o alcance e o uso.

Entre as opções, o ${"{{44}}"} é um modelo de porte médio, o ${"{{54}}"} tem tanque de inox de 12 litros e o ${"{{43}}"} é um equipamento de 70 litros com dois motores.`
  }
};

const saida = {};
for (const [nome, c] of Object.entries(categorias)) {
  const intro = c.intro.replace(/\{\{(\d+)\}\}/g, (_, id) => link(id));
  if (c.seo_title.length > 70) throw new Error("título longo: " + nome + " " + c.seo_title.length);
  saida[nome] = { seo_title: c.seo_title, intro };
  console.log(nome.padEnd(14), "título", c.seo_title.length, "palavras", intro.split(/\s+/).length);
}
fs.writeFileSync(process.argv[3], JSON.stringify(saida, null, 2) + "\n");
