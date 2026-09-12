# Site — Mais de 250 Receitas para Combater a Diabetes

Página de vendas de um guia digital de receitas para quem convive com diabetes.
HTML, CSS e JavaScript puros — sem framework, sem build, sem Node.

---

## 1. Como abrir

```bash
python -m http.server 5190 --directory site-receitas-diabetes
```

Depois acesse `http://localhost:5190`.
**Modo desenvolvimento:** `http://localhost:5190/?dev=1` lista no console (F12)
tudo que ainda falta preencher.

---

## 2. Estrutura

```
site-receitas-diabetes/
├── index.html                    → página de vendas (textos e seções)
├── politica-de-privacidade.html  → obrigatória para venda online
├── css/style.css                 → cores, fontes e layout (variáveis no topo)
├── js/config.js                  → ★ ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
├── js/main.js                    → monta oferta, prévia, depoimentos, carrossel
└── img/
    ├── logo*.webp                → logo do cabeçalho e rodapé
    ├── mockup*.webp              → imagem do produto no topo
    ├── receitas/                 → 5 receitas de exemplo (página, foto e miniatura)
    ├── clientes/                 → fotos dos depoimentos
    ├── bonus-*.webp              → fotos dos 3 bônus
    └── selo-garantia*.webp       → selo de 7 dias
```

---

## 3. O que sai do `js/config.js`

| Campo | Onde aparece |
|---|---|
| `brand.name` / `tagline` | rodapé, título de compartilhamento, política |
| `brand.siteUrl` | canonical / Open Graph — **troque pelo domínio real antes de publicar** |
| `brand.cnpj` | rodapé (venda online exige identificação do vendedor) |
| `brand.email` / `whatsapp.number` | suporte no rodapé, botão flutuante do WhatsApp, "Falar pelo WhatsApp" no FAQ |
| `checkout.platform` | "Pagamento processado pela …" (hoje: Void Payments) |
| `offer` | **área de compra**: preço, preço antigo, link do checkout, texto do botão, itens inclusos, SSL e prova social. O preço também aparece no topo, junto do mockup |
| `recipes` | lista da seção "Que tipo de pratos você vai aproveitar?" |
| `testimonials` | carrossel automático de depoimentos |
| `sample.url` | se preencher, aparece a seção "Experimente antes" (PDF de amostra) |
| `analytics` | Google Analytics / Pixel só carregam se houver ID |

Campos vazios ficam **em amarelo no site** ou escondidos, para não passar despercebido.

---

## 4. Antes de publicar — checklist

- [ ] `brand.siteUrl` com o domínio real
- [ ] `brand.cnpj` (ou CPF) preenchido
- [ ] `whatsapp.number` **ou** `brand.email` preenchido — hoje o rodapé mostra aviso amarelo
- [ ] FAQ "Que adoçante as receitas usam?" respondida (bloco amarelo no `index.html`)
- [ ] Confirmar que o checkout aceita **Pix, cartão parcelado e boleto** — é o que a página promete
- [ ] Preço do site igual ao do checkout (R$ 29,90)
- [ ] Os bônus (sucos, shakes, petiscos) realmente entregues junto com o guia
- [ ] Números das receitas de exemplo (kcal, carboidratos, fibras) iguais aos do guia
- [ ] Depoimentos reais e autorizados pelas pessoas
- [ ] `?dev=1` no console com 0 pendências
- [ ] Testado no próprio celular

---

## 5. Como publicar

**Netlify Drop** (mais rápido): `app.netlify.com/drop` → arraste a pasta inteira.
Também funciona em Vercel, Cloudflare Pages, GitHub Pages ou qualquer hospedagem
estática. Não há build. Domínio próprio: `registro.br` + apontar para a hospedagem.

---

## 6. Detalhes técnicos

- Responsivo (375 px → desktop), sem rolagem horizontal.
- Todas as imagens em WebP, com tamanhos para celular e desktop.
- Carrossel de depoimentos e prévia de receitas em JavaScript puro, sem biblioteca.
- O botão de compra é o único que sai da página (abre o checkout em nova aba).
- Fontes: Poppins (títulos) e Nunito Sans (texto), via Google Fonts.
- O site não coleta dados: nenhum formulário, nenhum cookie próprio.
