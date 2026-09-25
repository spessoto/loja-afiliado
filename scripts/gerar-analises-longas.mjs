// Gera analises-longas.json: análise curta (analises.json) + seções aprofundadas para os produtos principais.
// {{id}} vira link interno para a página do produto (URL curta canônica).
import fs from "node:fs";
import { productSlug, shortName } from "../slug.js";

const produtos = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const curtas = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const link = (id) => {
  const p = produtos.find(x => x.id === Number(id));
  if (!p) throw new Error("produto " + id + " não encontrado");
  return `[${shortName(p.name, 46)}](/produto/${productSlug(p.name)}-${p.id})`;
};

const secoes = {
  4: `## Para quem faz sentido

Para quem quer um único aparelho para aspirar pó e líquidos em casa: garagem, varanda, carro, pós-obra doméstica e estofados. Com 10 litros no total (7 L para sólidos e 3,4 L para líquidos), tem tamanho controlado e cabe em armário.

## Pontos fortes

- Aspira sólidos e líquidos e ainda tem bocal de sopro, útil para folhas, churrasqueira e para inflar itens.
- Raio de ação de 5 m, mangueira de 1,5 m e bicos para estofados e tapetes já inclusos.
- Saco de tecido lavável e reutilizável, que evita a compra de refis.
- Mais de 74 mil avaliações no marketplace, com nota média de 4,8.

## Pontos de atenção

- É barulhento, com cerca de 92 dBA. Em ambientes fechados, vale usar protetor auricular.
- A capacidade útil para líquidos é de 3,4 litros, então volumes grandes exigem esvaziar várias vezes.
- Depende de tomada (cabo de 2 m) e não é um aspirador industrial.

## Comparação com outras opções

Se você quer mais capacidade, o ${"{{16}}"} tem 12 litros (5,7 L úteis para líquidos) e tanque de inox. Para quem precisa de mais volume e alcance, o ${"{{44}}"} tem 18 litros e raio de ação de 6,2 m. O GTW 10 é a opção mais compacta e econômica dessa família. Veja também as demais opções em [aspiradores de pó e água](/categoria/aspiradores).`,

  11: `## Para quem faz sentido

Para apartamentos e casas com pisos frios e tapetes baixos que precisam de um vertical com fio simples, leve e barato. Funciona como vertical ou como aspirador de mão, com bico múltiplo para pisos e bico de canto para áreas de difícil acesso.

## Pontos fortes

- 1350 W de potência, reservatório de 1,2 L sem saco e filtro HEPA lavável, bom para quem tem alergia ou poeira em excesso.
- Apenas 1,25 kg e 1,08 m de altura, fácil de manobrar e guardar.
- Cabo de 4 m, suficiente para uma sala sem trocar de tomada.
- Mais de 66 mil avaliações, com nota média de 4,8.

## Pontos de atenção

- É com fio e não aspira líquidos.
- A articulação do bico é de 180°, então ele não entra tão bem embaixo de móveis muito baixos quanto os modelos com sistema 360°.
- Nível de ruído de cerca de 83 dBA.

## Comparação com outras opções

O ${"{{8}}"} tem 1600 W, cabo de 5 m e sistema 360° para passar embaixo de móveis. O ${"{{20}}"} oferece cabo de 5,5 m e é ainda mais leve, com 1,43 kg. Já o ${"{{25}}"} tem 1100 W e é citado nas avaliações como mais silencioso. Todos estão em [aspiradores verticais](/categoria/vertical).`,

  9: `## Para quem faz sentido

Para apartamentos e casas pequenas com piso liso, onde o objetivo é tirar a vassoura da rotina e manter o chão sem pó, cabelo e pelos leves. Varre, aspira e passa pano ao mesmo tempo.

## Pontos fortes

- Cobre até cerca de 120 m² segundo o anúncio, com sensores anti-queda e de obstáculos.
- Três modos de limpeza (aleatório, cantos e espiral) e filtro HEPA.
- Reservatórios de 250 ml para pó e para água, com pano de microfibra incluso.
- Preço de entrada e mais de 15 mil avaliações no marketplace.

## Pontos de atenção

- Não tem Wi-Fi, app nem mapeamento: a limpeza é aleatória e pode levar mais tempo para cobrir toda a área.
- Não tem base carregadora automática; a recarga leva cerca de 4 horas.
- Não é indicado para tapetes de fio longo nem para faxina pesada. A proposta é manutenção diária de sujeira leve.

## Comparação com outras opções

O ${"{{12}}"} acrescenta base carregadora e agendamento diário. O ${"{{56}}"} tem proposta parecida, com sensores anti-queda e modos automáticos. Quem quer navegação a laser e controle por app precisa subir de faixa, como o ${"{{46}}"}. Compare todos em [robôs aspiradores](/categoria/robos).`,

  1: `## Para quem faz sentido

Para quem quer tirar manchas de sofá, colchão, tapete e banco de carro sem contratar higienização. A extratora borrifa a solução de limpeza, esfrega e extrai a sujeira e a água suja em uma só passada, e por isso resolve o que o aspirador comum não resolve, como urina de pet e gordura acumulada.

## Pontos fortes

- 1450 W de potência e 110 mbar de vácuo, que ajudam a secar o tecido mais rápido.
- Reservatórios de 1,1 L (água limpa) e 850 ml (água suja), com bico de autolimpeza.
- Portátil, com porta-acessórios e enrolador de cabo, fácil de guardar.
- Mais de 18 mil avaliações no marketplace, com nota média de 4,8.

## Pontos de atenção

- Reservatórios pequenos: em áreas grandes você vai esvaziar e reabastecer algumas vezes.
- Não foi feita para pisos duros em grandes áreas nem para uso industrial contínuo.
- A tensão (127 V ou 220 V) é escolhida na hora da compra, então confirme a da sua casa.

## Como combinar com outros aparelhos

Para a limpeza diária do piso, o ideal é ter um aspirador de uso geral, como um vertical em [aspiradores verticais](/categoria/vertical), e deixar a extratora para as limpezas profundas. Veja mais opções em [extratoras](/categoria/extratoras).`,

  3: `## Para quem faz sentido

Para motoristas que querem manter o carro limpo sem ir ao lava-rápido: bancos, tapetes e porta-malas. Também atende motoristas de aplicativo que precisam higienizar o veículo entre corridas.

## Pontos fortes

- Liga na tomada de 12 V do carro e tem cabo de 3,7 m, que alcança o porta-malas.
- 180 W, filtro HEPA lavável e reservatório de 420 ml sem saco.
- Compacto e leve, com cerca de 520 g, cabe no porta-luvas.
- Mais de 16 mil avaliações no marketplace, com nota média de 4,7.

## Pontos de atenção

- Depende da tomada 12 V do veículo, então não serve para a limpeza da casa longe do carro.
- Não aspira líquidos e o reservatório de 420 ml enche rápido com sujeira volumosa.
- Não é sem fio.

## Comparação com outras opções

Se você quer limpar também teclado, mesa e cantos da casa, um modelo sem fio recarregável por USB, como o ${"{{24}}"}, é mais versátil, embora menos potente. Veja as opções em [aspiradores portáteis](/categoria/portateis).`,

  20: `## Para quem faz sentido

Para quem procura um vertical 2 em 1 de entrada, leve e de marca conhecida, para a limpeza diária de apartamento e casa. As avaliações destacam bom desempenho em tapetes e sofás com pelos de animais.

## Pontos fortes

- 1250 W, filtro HEPA removível e lavável e reservatório de 1 L.
- Cabo de 5,5 m e apenas 1,43 kg, com rodas e formato de mão para áreas de difícil acesso.
- Nível de ruído de cerca de 89 dB, considerado baixo pelos compradores para a categoria.
- Mais de 44 mil avaliações, com nota média de 4,8.

## Pontos de atenção

- Não aspira líquidos e é 127 V.
- Segundo avaliações, não vem com bico específico para áreas bem pequenas.
- O reservatório de 1 L exige esvaziar com mais frequência em casas grandes.

## Comparação com outras opções

O ${"{{25}}"} tem 1100 W e reservatório de 1,3 L com dupla filtragem lavável. O ${"{{11}}"} é um pouco mais leve e tem 1350 W. Compare com todos os modelos em [aspiradores verticais](/categoria/vertical).`,

  25: `## Para quem faz sentido

Para quem quer um vertical 2 em 1 para o dia a dia, com opção portátil para carro e estofados, e prefere um aparelho mais silencioso que os convencionais. As avaliações relatam boa sucção de pelos em sofás.

## Pontos fortes

- 1100 W e dupla filtragem Turbo Cycle, removível e lavável, sem saco.
- Coletor translúcido de 1,3 L e cabo de 4 m, com rodas e porta-acessórios.
- Apenas 1,5 kg, fácil de manobrar, com escova para pisos e carpetes e bico de canto.
- Mais de 28 mil avaliações, com nota média de 4,9.

## Pontos de atenção

- Para sujeira mais pesada ou intensa, os compradores indicam que rende menos; é um aparelho para poeira do dia a dia.
- Não aspira líquidos e é 127 V.

## Comparação com outras opções

O ${"{{20}}"} tem 1250 W e cabo maior (5,5 m). O ${"{{11}}"} tem 1350 W e bico múltiplo articulado. Veja mais em [aspiradores verticais](/categoria/vertical).`,

  16: `## Para quem faz sentido

Para quem precisa aspirar pó e água com o mesmo aparelho em garagem, quintal, carro e áreas molhadas, e quer um tanque de inox mais resistente. O aparelho também serve como soprador.

## Pontos fortes

- Tanque de 12 L, com 9 L úteis para sólidos e 5,7 L para líquidos, e motor de 1400 W.
- Três tubos de extensão, mangueira e bico de canto com escova acompanham o aparelho.
- Recipiente em inox e filtro de espuma com pano lavável.
- Mais de 26 mil avaliações, com nota média de 4,8.

## Pontos de atenção

- O cabo de 2,5 m é curto; em áreas maiores você provavelmente vai precisar de uma extensão.
- Compradores com mais de 1,70 m relatam precisar se curvar ao usar.
- Não é indicado para uso industrial contínuo, segundo relatos de peças plásticas mais frágeis.
- Faz cerca de 93 dBA.

## Comparação com outras opções

O ${"{{4}}"} tem 10 litros e é um pouco mais compacto. O ${"{{44}}"} tem 18 litros (11 L úteis) e raio de ação de 6,2 m. O ${"{{54}}"} também tem tanque de inox de 12 litros. Veja todos em [aspiradores de pó e água](/categoria/aspiradores).`,

  8: `## Para quem faz sentido

Para quem prefere potência constante a se preocupar com bateria e quer um vertical com fio com bom alcance para uma sala inteira. Funciona como vertical, portátil ou com bico escova.

## Pontos fortes

- 1600 W, tecnologia ciclone, reservatório de 1,3 L e filtro HEPA reutilizável.
- Cabo de 5 m e sistema 360°, que facilita passar embaixo de móveis baixos.
- Indicado para famílias com pets, que precisam remover pelos e alérgenos.
- Nota média de 4,9 em cerca de 3,9 mil avaliações.

## Pontos de atenção

- É com fio, pesa 1,8 kg e tem 1,12 m de altura.
- O ruído é perceptível, segundo as avaliações, e a ficha não lista posição de estacionamento nem proteção contra superaquecimento.
- Não aspira líquidos.

## Comparação com outras opções

O ${"{{18}}"} tem a mesma potência de 1600 W, com cabo de 6 m e peso de 1,7 kg. O ${"{{11}}"} é uma alternativa mais leve e barata com 1350 W. Compare em [aspiradores verticais](/categoria/vertical).`,

  46: `## Para quem faz sentido

Para casas maiores que precisam de um robô com sucção alta e boa autonomia, e para quem valoriza controle por app, mapas 3D e integração com assistentes de voz. Aspira e passa pano, com navegação a laser (LiDAR) que planeja a rota.

## Pontos fortes

- Sucção de 10.000 Pa e tecnologia anti-emaranhamento de cabelos.
- Bateria de 5200 mAh, com até 180 minutos de autonomia, e retorno automático à base.
- App Xiaomi Home com mapas 3D, zona proibida e agendamento, além de Alexa e Google Assistant.
- Mais de 440 avaliações, com nota média de 4,7.

## Pontos de atenção

- Está na faixa de preço mais alta da marca; para um orçamento mais limitado, o S40C oferece bom custo-benefício com sucção menor.
- A recomendação de superfície é madeira de engenharia, ou seja, pisos duros.
- Confira a voltagem no anúncio antes de comprar.

## Comparação com outras opções

O ${"{{45}}"} (S40C) tem sucção de 5000 Pa e custa menos. Se você quer estação de esvaziamento e lavagem do mop, veja o ${"{{68}}"} ou o ${"{{62}}"}. Compare todos em [robôs aspiradores](/categoria/robos).`,

  68: `## Para quem faz sentido

Para quem quer o mínimo de manutenção: a estação Omni esvazia o pó, lava e seca o mop e reabastece a água sozinha. As escovas cortam fios e pelos, o que ajuda em casas com pets.

## Pontos fortes

- Sucção de 8.000 Pa, mop com elevação de 12 mm e mopas pentagonais de 180 RPM.
- Navegação a laser com luz estruturada, que funciona no escuro, e mapeamento AI.Map 3.0 para até 5 andares.
- Estação que lava e seca o mop a 45 °C e esvazia o pó em um saco de 2,5 L.
- Opera entre 55 e 60 dB e tem certificação Anatel.

## Pontos de atenção

- A versão é 220 V; em rede 110 V é preciso transformador de 1000 VA ou mais.
- A estação é mais barulhenta que o próprio robô durante o esvaziamento e a lavagem.
- Recolha panos e cabos soltos antes de rodar. É um investimento alto e ainda tem poucas avaliações.

## Comparação com outras opções

O ${"{{62}}"} também tem base autolimpante e mop duplo giratório, com sucção de até 10.000 Pa. O ${"{{37}}"} traz 15.000 Pa e estação que lava e seca o mop a 50 °C. Veja todos em [robôs aspiradores](/categoria/robos).`,

  26: `## Para quem faz sentido

Para quem quer o conforto do aspirador sem fio e limpa embaixo de sofás e camas baixas: o tubo flexível articulado facilita o acesso, e a escova turbo animal ajuda com pelos de pets.

## Pontos fortes

- 250 W, tecnologia ciclone e escova motorizada, com filtragem de 99,9% e filtro lavável.
- Bateria removível de 18,5 V, com até 45 minutos e recarga em cerca de 3 horas.
- Três níveis de sucção (eco, padrão e turbo).
- Leve: 1,1 kg como aspirador de mão e 2,2 kg no total, com base de carga e porta-acessórios.

## Pontos de atenção

- É um aspirador premium, longe do modelo mais barato da categoria.
- Para usos contínuos acima de 45 minutos, é preciso trocar ou recarregar a bateria.
- O reservatório é de 450 ml.

## Comparação com outras opções

O ${"{{65}}"} é uma versão mais simples da mesma família, com 140 W. O ${"{{64}}"} acrescenta o acessório Aqua e dois mopes para passar pano. Entre as marcas concorrentes, veja o ${"{{49}}"}. Compare em [aspiradores verticais](/categoria/vertical).`,

  34: `## Para quem faz sentido

Para famílias com pets ou alergias que preferem potência constante à autonomia de bateria. As avaliações destacam a boa remoção de pelos.

## Pontos fortes

- 1450 W, filtro HEPA Allergy Protect e reservatório de 1,6 L, 70% maior que os modelos anteriores da marca.
- Cabo de 6 m, bocal de 180° para pisos e bocal 2 em 1 para móveis e superfícies delicadas.
- Estacionamento vertical e proteção térmica ThermoControl.
- Peças de reposição mais baratas no longo prazo, segundo compradores.

## Pontos de atenção

- A versão é 220 V, então confirme a tensão da sua casa.
- É com fio e não aspira líquidos.

## Comparação com outras opções

O ${"{{38}}"} é a versão mais compacta da marca, com reservatório de 0,83 L. O ${"{{20}}"} e o ${"{{8}}"} também são verticais com fio, com cabos de 5,5 m e 5 m. Compare em [aspiradores verticais](/categoria/vertical).`,

  44: `## Para quem faz sentido

Para quem precisa de um aspirador de pó e água versátil para limpeza profunda em casa, área externa e garagem, incluindo a função de sopro para inflar itens ou soprar folhas.

## Pontos fortes

- 1400 W e reservatório de 18 L, com 11 L de capacidade útil.
- Raio de ação total de 6,2 m e filtragem tripla, com filtro de espuma.
- Interrupção inteligente de sucção, tubos prolongadores e bocais para cantos, frestas e pisos.
- Mais de 4,7 mil avaliações, com nota média de 4,7.

## Pontos de atenção

- Para uso leve e ocasional, um aspirador compacto seria suficiente.
- A versão é 127 V e o aparelho é volumoso para guardar.

## Comparação com outras opções

O ${"{{32}}"} tem 12 litros e função sopro, também em 127 V. O ${"{{54}}"} tem tanque de inox de 12 litros e alcance de até 7,5 m. Mais opções em [aspiradores profissionais](/categoria/profissionais).`,

  23: `## Para quem faz sentido

Para quem tem cães ou gatos e quer reduzir os pelos soltos pela casa e cuidar do animal em casa. O kit 5 em 1 aspira, tosa, penteia e desembaraça, e o tosador é recarregável e sem fio.

## Pontos fortes

- 300 W e reservatório de 1,4 L, com captura de até 99% dos pelos soltos.
- Operação silenciosa, com 66 dB(A), que ajuda a não assustar o animal.
- Tosador sem fio com até 3 horas de autonomia.
- Alcance de 4,4 m (cabo mais mangueira) e acessórios para tecidos e escovas.

## Pontos de atenção

- Não é um aspirador de piso geral: o foco é o cuidado com o pet, não superfícies amplas.
- O reservatório de 1,4 L pode ser pequeno para sessões longas. Ainda há poucas avaliações.

## Comparação com outras opções

Para um aspirador sem fio geral, com escova turbo animal, veja o ${"{{26}}"}. Para um aspirador tradicional com bocal pet, o ${"{{50}}"}. Mais opções em [aspiradores portáteis](/categoria/portateis).`
};

const fechamentos = {
  3: "Se o seu objetivo é manter o carro limpo com o menor gasto, é uma compra direta: potência suficiente para poeira, areia e pelos, cabo que alcança o carro inteiro e filtro lavável que evita custos com refil. Se você também quer limpar a casa, prefira um modelo sem fio ou um vertical.",
  8: "É um vertical com fio para quem quer potência e alcance sem pagar caro: bom para pisos frios, tapetes baixos e casas com pets. Se você mora em um imóvel com muitos móveis baixos ou quer silêncio, confira antes as alternativas comparadas acima.",
  20: "É uma escolha segura para quem quer o básico bem feito: aspirador leve, filtro HEPA lavável, cabo longo e preço acessível. Se você precisa de mais capacidade no reservatório ou de mais alcance, vale comparar com os outros verticais da lista.",
  23: "Faz sentido como complemento para quem tem pets e quer resolver o pelo na fonte, sem escovações que espalham sujeira. Ele não substitui o aspirador da casa, então pense nele como um item de cuidado com o animal que também aspira.",
  25: "É um vertical simples e bem avaliado para o dia a dia, com boa relação entre preço, peso e filtragem lavável. Para sujeira pesada ou áreas muito grandes, considere um modelo com mais potência ou com cabo mais longo.",
  26: "É uma opção para quem quer sem fio de verdade e valoriza o tubo flexível e a bateria removível. Compense o preço mais alto pensando no uso diário e na possibilidade de trocar a bateria no futuro em vez de trocar o aparelho.",
  34: "É um vertical com fio de marca conhecida, com filtro HEPA e cabo longo, ideal para quem quer limpar a casa toda sem depender de bateria. Só não esqueça de conferir que a versão anunciada é 220 V.",
  44: "É um equipamento de porte médio para quem faz limpezas pesadas com frequência e precisa aspirar líquidos e sólidos com o mesmo aparelho. Se o uso for eventual, um aspirador de pó e água compacto sai mais barato e ocupa menos espaço.",
  46: "É um robô potente e conectado para casas maiores, com boa autonomia e controle completo pelo app. Se o orçamento é limitado, compare com o modelo de sucção menor da mesma marca antes de decidir."
};

const saida = {};
for (const [id, texto] of Object.entries(secoes)) {
  const corpo = texto.replace(/\{\{(\d+)\}\}/g, (_, n) => link(n));
  if (!curtas[id]) throw new Error("sem análise curta para " + id);
  const fecho = fechamentos[id] ? `\n\n## Em resumo\n\n${fechamentos[id]}` : "";
  const cheio = `${curtas[id]}\n\n${corpo}${fecho}`;
  saida[id] = cheio;
  console.log(String(id).padStart(3), "palavras", cheio.split(/\s+/).length);
}
fs.writeFileSync(process.argv[4], JSON.stringify(saida, null, 2) + "\n");
