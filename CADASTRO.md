# Prompt padrão — cadastro de produto

Cole isto (junto com o PDF/link do Mercado Livre e o link de afiliado) sempre
que for cadastrar um produto novo em promoaspiradores.com.br.

```
Cadastre este produto no site (D:\Promoaspiradores / promoaspiradores.com.br).

Link de afiliado: [COLE O LINK AQUI]
Fonte do produto: [anexe o PDF da página do Mercado Livre OU cole o link do anúncio]

Extraia TUDO da fonte, sem deixar nada de fora, e preencha:

- name, brand, category (escolha uma das categorias já existentes no menu:
  Aspiradores, Robôs, Vertical, Portáteis, Extratoras, Profissionais, Acessórios),
  badge (ex: MAIS VENDIDO, se aplicável)
- price_from (preço "de"), price_to (preço "por" à vista, sem Pix), installment
- image_url (foto principal) + images (TODAS as fotos da galeria, uma URL por linha)
- description (texto corrido, verbatim da descrição do anúncio)
- tags: os bullets/destaques do anúncio (highlighted_features), um por linha
- specs: TODAS as especificações técnicas de TODAS as seções (características
  gerais, potência, bateria, dimensões, tecnologia, acessórios, materiais, dados
  técnicos da descrição), sem duplicar, formato "Chave: Valor" uma por linha
- indicado / nao_indicado: derive do uso real do produto (não do texto genérico)
- rating_avg, rating_count, rating_dist (formato "estrela:percentual", uma
  linha por nota de 5 a 1) e reviews (5 depoimentos reais do anúncio, formato
  "Nome\nNota\nTexto\nMeta" separados por linha "---")

Regras de execução:
1. Busque o ADMIN_TOKEN nas env vars do app Node.js no Hostinger
   (hosting_listNode_jsEnvironmentVariablesV1) — não peça pra mim.
2. Monte o JSON com node -e (nunca heredoc/curl -d direto) para evitar
   mojibake no Windows, salve em D:\Promoaspiradores\.tmp_*.json.
3. Envie com curl --ssl-no-revoke --data-binary @arquivo,
   Content-Type: application/json; charset=utf-8.
4. Se for produto novo: POST em /api/products. Se for editar: GET primeiro,
   faça merge com os campos novos, depois PUT em /api/products/:id.
5. Apague os .tmp_*.json ao final.
6. Se algum código tiver mudado (server.js/db.js/páginas), dê git push e
   aguarde o deploy no Hostinger (hosting_listJsDeployments = completed)
   antes de gravar dados que dependam de colunas novas.
7. Confirme com GET que nada ficou null/vazio e que não há caracteres
   corrompidos (�) na resposta.
8. Me avise com um resumo do que foi cadastrado e o link de /produto/:id.
```

## Campos do produto (referência rápida)

| Campo | Formato |
|---|---|
| `name`, `brand`, `category`, `badge` | texto simples |
| `price_from`, `price_to` | número decimal, ex: `899.86` |
| `installment` | texto livre, ex: `12x de R$ 52,99 sem juros` |
| `image_url` | 1 URL |
| `images` | URLs separadas por `\n` |
| `description` | texto corrido |
| `tags` | 1 frase por linha |
| `specs` | `Chave: Valor` por linha |
| `indicado`, `nao_indicado` | 1 frase por linha |
| `rating_avg` | ex: `4.8` |
| `rating_count` | ex: `18429` |
| `rating_dist` | `estrela:percentual` por linha, ex: `5:90.39` |
| `reviews` | blocos `Nome\nNota\nTexto\nMeta` separados por linha `---` |
