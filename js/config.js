/* =====================================================================
   CONFIGURAÇÃO DO SITE — ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
   ---------------------------------------------------------------------
   Regra do projeto: nada que não esteja confirmado aparece como fato.
   Campos com `null` ou `isPlaceholder: true` são exibidos em AMARELO no
   site (ou escondidos), para não passarem despercebidos.
   Abra o site com ?dev=1 para ver no console tudo que ainda falta.
   ===================================================================== */

window.SITE = {

  /* ---------- Marca e autor(a) ---------- */
  brand: {
    name: 'Mais de 250 Receitas para Combater a Diabetes',
    tagline: 'receitas para quem convive com diabetes',
    isPlaceholder: false,
    siteUrl: 'https://SEU-DOMINIO.com.br/', // PROVISÓRIO — usado em canonical/OG
    email: 'sac.250receitas@gmail.com',
    cnpj: null,                         // ex.: '00.000.000/0001-00' (aparece no rodapé)
  },

  author: {
    name: 'Nome de quem assina',        // PROVISÓRIO
    credential: null,                   // ex.: 'Nutricionista — CRN 0/00000'. Só preencha se for verdade.
    bio: null,                          // 3–4 frases em primeira pessoa
    photo: null,                        // ex.: 'img/autora.webp'
    isPlaceholder: true,
  },

  /* ---------- Suporte ao comprador ---------- */
  whatsapp: {
    number: null,                       // formato 55 + DDD + número, ex.: '5531999999999'
    message: 'Olá! Vim pelo site e tenho uma dúvida sobre o guia digital de receitas.',
  },
  instagram: null,                      // ex.: 'https://www.instagram.com/suamarca/'

  /* ---------- Plataforma de pagamento ---------- */
  // Nome exibido nos textos ("pagamento processado pela Hotmart").
  // Troque para 'Kiwify', 'Eduzz' etc. conforme a plataforma escolhida.
  checkout: {
    platform: 'Void Payments',
    isPlaceholder: false,
  },

  /* ---------- Amostra grátis (opcional) ---------- */
  // Se `url` for null a seção inteira fica oculta.
  sample: {
    url: null,                          // ex.: 'downloads/amostra-3-receitas.pdf'
    title: '3 receitas grátis para experimentar',
  },

  /* ---------- Oferta (área de compra única) ---------- */
  // `checkoutUrl` é o link de pagamento da plataforma. Enquanto for null o
  // botão fica desativado e marcado em amarelo (ou cai no WhatsApp, se houver).
  offer: {
    id: 'guia',
    title: 'Guia Digital — Mais de 250 Receitas para Combater a Diabetes',
    price: 29.90,
    oldPrice: 97.00,
    priceIsPlaceholder: false,
    checkoutUrl: 'https://checkout.voidpayments.com/checkout/cmtxwi7nb07h901oppy5phlgo?offer=96BS7RF',
    buttonText: 'QUERO MEU GUIA',
    securityNote: 'Pagamento seguro SSL de 256 bits',
    socialProof: 'Entregue a mais de 140 leitores',
    includes: [
      'Mais de 250 receitas: café da manhã, almoço, jantar, lanches e sobremesas',
      'Carboidratos, fibras e calorias indicados em cada receita',
      'Acesso imediato no celular, tablet ou computador',
      'Atualizações gratuitas para sempre',
    ],
  },

  /* ---------- Prévia interativa (receitas de exemplo) ---------- */
  // Cada item usa 3 imagens em img/receitas/: <id>-thumb.webp (miniatura),
  // <id>-foto.webp (foto grande) e <id>.webp / <id>-700.webp (página inteira).
  // Os números precisam bater com o que está no e-book vendido.
  recipes: [
    { id: 'cafe',      cat: 'Café da manhã', name: 'Panquecas de Aveia e Canela',           time: '15 min',            kcal: 195, carbs: '22 g', fiber: '4,5 g', benefit: 'Rica em fibras, ajuda a controlar a glicose e dá mais saciedade.' },
    { id: 'almoco',    cat: 'Almoço',        name: 'Bowl de Frango, Quinoa e Abacate',      time: '25 min',            kcal: 380, carbs: '28 g', fiber: '6,2 g', benefit: 'Refeição completa, rica em fibras e gorduras boas.' },
    { id: 'jantar',    cat: 'Jantar',        name: 'Salmão Assado com Aspargos',            time: '20 min',            kcal: 320, carbs: '4 g',  fiber: '2,1 g', benefit: 'Rico em ômega-3, ajuda a cuidar da saúde do coração.' },
    { id: 'lanche',    cat: 'Lanche',        name: 'Palitos de Legumes com Homus',          time: '10 min',            kcal: 160, carbs: '15 g', fiber: '5 g',   benefit: 'Rico em fibras, ajuda a controlar a fome entre as refeições.' },
    { id: 'sobremesa', cat: 'Sobremesa',     name: 'Pudim de Chia com Baunilha e Framboesas', time: '5 min + descanso', kcal: 110, carbs: '9 g',  fiber: '7,5 g', benefit: 'Doce leve, rico em fibras e sem açúcar adicionado.' },
  ],

  /* ---------- Depoimentos ---------- */
  // Só depoimentos reais e autorizados. Foto em img/clientes/<arquivo>.webp
  // (quadrada). `city` é opcional. Estrelas: 1 a 5 (opcional, padrão 5).
  testimonials: [
    { name: 'Beatriz',   photo: 'img/clientes/beatriz.webp',   stars: 5, text: 'Estava cansada de comer sempre frango cozido e alface. Este guia digital me mostrou que uma alimentação saudável também pode ser gostosa! As receitas são fáceis e usam ingredientes que já tenho na geladeira. O pudim de chia virou meu café da manhã favorito.' },
    { name: 'Francisco', photo: 'img/clientes/francisco.webp', stars: 5, text: 'Precisava mudar minha alimentação e comprei o guia por indicação. Foi uma ótima escolha! As receitas são saborosas e dão bastante saciedade. Ficou muito mais fácil variar as refeições.' },
    { name: 'Sofia',     photo: 'img/clientes/sofia.webp',     stars: 5, text: 'Comprei para meu pai, que não gosta de dietas sem graça, e toda a família acabou aproveitando! As receitas são deliciosas e práticas. Os almoços com quinoa e peixe fizeram sucesso aqui em casa. Recomendo!' },
    { name: 'Carlos',    photo: 'img/clientes/carlos.webp',    stars: 5, text: 'Achava que comer de forma saudável significava abrir mão do sabor. As receitas deste guia me mostraram o contrário! Gostei muito das combinações e dos temperos. Agora tenho mais opções para variar o cardápio.' },
    { name: 'Maria',     photo: 'img/clientes/maria.webp',     stars: 5, text: 'Um guia direto ao ponto, sem explicações complicadas. Mostra o que comprar e como preparar, de um jeito fácil de entender. Voltei a gostar de cozinhar e experimentar receitas novas. Ótimo custo-benefício!' },
  ],

  /* ---------- Analytics (opcional) ---------- */
  analytics: {
    gaMeasurementId: null,              // ex.: 'G-XXXXXXXXXX'
    metaPixelId: null,                  // ex.: '123456789012345'
  },
};
