/* =====================================================================
   Mais de 250 Receitas — comportamento da página
   Lê tudo de window.SITE (js/config.js). Nenhum dado fica aqui.
   ===================================================================== */
(function () {
  'use strict';

  const S = window.SITE || {};
  const DEV = new URLSearchParams(location.search).has('dev');
  const pendencias = [];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const zapLink = (msg) => {
    if (!S.whatsapp || !S.whatsapp.number) return null;
    return `https://wa.me/${S.whatsapp.number}?text=${encodeURIComponent(msg || S.whatsapp.message || '')}`;
  };

  // Repassa utm_*, src, sck, fbclid, gclid, ttclid da URL da página para o link do checkout,
  // para a plataforma atribuir a venda ao anúncio certo.
  const comRastreio = (url) => {
    if (!url) return url;
    const atual = new URLSearchParams(location.search);
    const passar = [...atual.entries()].filter(([k]) => /^(utm_|src$|sck$|fbclid$|gclid$|ttclid$|ref$)/i.test(k));
    if (!passar.length) return url;
    const alvo = new URL(url);
    passar.forEach(([k, v]) => alvo.searchParams.set(k, v));
    return alvo.toString();
  };

  const marcaProvisorio = (el, texto) => {
    if (!el) return;
    const tag = document.createElement('span');
    tag.className = 'aviso-provisorio aviso-provisorio--inline';
    tag.textContent = texto;
    el.insertAdjacentElement('afterend', tag);
  };

  /* ---------- Marca ---------- */
  function aplicarMarca() {
    const b = S.brand || {};
    $$('[data-brand="name"]').forEach((el) => { el.textContent = b.name || el.textContent; });
    $$('[data-brand="tagline"]').forEach((el) => { el.textContent = b.tagline || el.textContent; });
    $$('[data-checkout="platform"]').forEach((el) => { el.textContent = (S.checkout && S.checkout.platform) || el.textContent; });

    if (b.isPlaceholder) {
      pendencias.push('brand.name — nome da marca é provisório');
    }
    if (S.checkout && S.checkout.isPlaceholder) {
      pendencias.push('checkout.platform — confirmar plataforma de pagamento (Hotmart, Kiwify…)');
    }

    // Canonical / OG
    if (b.siteUrl && !/SEU-DOMINIO/.test(b.siteUrl)) {
      const canon = $('link[rel="canonical"]');
      if (canon) canon.href = b.siteUrl;
    } else {
      pendencias.push('brand.siteUrl — domínio real ainda não definido (canonical/OG)');
    }

    $('#ano').textContent = new Date().getFullYear();

    const cnpj = $('#rodapeCnpj');
    if (b.cnpj) { cnpj.textContent = `CNPJ ${b.cnpj}`; cnpj.hidden = false; }
    else pendencias.push('brand.cnpj — CNPJ/CPF do vendedor para o rodapé (exigido pelo CDC para venda online)');
  }

  /* ---------- Oferta (área de compra) ---------- */
  function renderOferta() {
    const o = S.offer;
    const caixa = $('#oferta');
    if (!caixa || !o) return;

    const de = o.oldPrice ? `de <s>${brl(o.oldPrice)}</s> por` : '';
    const [reais, centavos] = brl(o.price).replace('R$', '').trim().split(',');
    const valor = `<small>R$</small>${reais},${centavos}`;
    $('#ofertaDe').innerHTML = de;
    $('#ofertaValor').innerHTML = valor;
    // mesmo preço também no topo, ao lado do mockup (sem link — só informação)
    if ($('#heroDe')) { $('#heroDe').innerHTML = de; $('#heroValor').innerHTML = valor; }
    if (o.priceIsPlaceholder) { $('#ofertaPrecoAviso').hidden = false; pendencias.push(`offer.price — preço provisório (${brl(o.price)})`); }

    $('#ofertaInclui').innerHTML = (o.includes || []).map((i) => `<li>${esc(i)}</li>`).join('');
    $('#ofertaSeguro').textContent = o.securityNote || '';
    $('#ofertaProva').textContent = o.socialProof || '';

    const zap = zapLink(`Olá! Quero comprar o guia "${o.title}".`);
    let botao;
    if (o.checkoutUrl) {
      botao = `<a class="btn btn--principal btn--pulsar" href="${esc(comRastreio(o.checkoutUrl))}" target="_blank" rel="noopener" data-produto="${esc(o.id)}">${esc(o.buttonText)}</a>`;
    } else if (zap) {
      botao = `<a class="btn btn--principal btn--pulsar" href="${zap}" target="_blank" rel="noopener" data-produto="${esc(o.id)}">${esc(o.buttonText)}</a>
               <p class="aviso-provisorio aviso-provisorio--inline">sem link de checkout — caindo no WhatsApp</p>`;
      pendencias.push('offer.checkoutUrl — link de pagamento ausente (usando WhatsApp)');
    } else {
      botao = `<span class="btn btn--pulsar" aria-disabled="true">${esc(o.buttonText)}</span>
               <p class="aviso-provisorio aviso-provisorio--inline">link de pagamento ainda não configurado</p>`;
      pendencias.push('offer.checkoutUrl — link de pagamento ausente (botão desativado)');
    }
    $('#ofertaAcao').innerHTML = botao;

    // Chamada final (fim da página) — mesmo botão, direto para o checkout
    if ($('#finalAcao')) {
      $('#finalDe').innerHTML = o.oldPrice ? `de <s>${brl(o.oldPrice)}</s> por` : '';
      $('#finalValor').innerHTML = valor;
      $('#finalAcao').innerHTML = botao;
    }

    // Barra fixa de compra no celular — só com link de checkout de verdade
    const barra = $('#barraCompra');
    if (barra && o.checkoutUrl) {
      $('#barraDe').innerHTML = o.oldPrice ? `de <s>${brl(o.oldPrice)}</s>` : '';
      $('#barraValor').innerHTML = brl(o.price);
      $('#barraBtn').href = comRastreio(o.checkoutUrl);
      barra.hidden = false;
      document.body.classList.add('tem-barra');
      const hero = $('#inicio'), oferta = $('#comprar');
      const atualizar = () => {
        const passouHero = window.scrollY > (hero ? hero.offsetTop + hero.offsetHeight - 80 : 400);
        // some enquanto a área de compra está na tela (para não duplicar botão)
        const r = oferta ? oferta.getBoundingClientRect() : null;
        const ofertaVisivel = r && r.top < window.innerHeight - 120 && r.bottom > 120;
        barra.classList.toggle('barra-compra--visivel', passouHero && !ofertaVisivel);
      };
      atualizar();
      window.addEventListener('scroll', atualizar, { passive: true });
      window.addEventListener('resize', atualizar);
    }
  }

  /* ---------- Amostra grátis ---------- */
  function amostra() {
    const sec = $('#amostra');
    if (!sec) return;
    if (S.sample && S.sample.url) {
      $('#amostraBtn').href = S.sample.url;
      if (S.sample.title) $('#amostraTitulo').textContent = S.sample.title;
      sec.hidden = false;
    } else {
      pendencias.push('sample.url — sem PDF de amostra; seção "Experimente antes" oculta (opcional)');
    }
  }

  /* ---------- Depoimentos (carrossel automático) ---------- */
  function depoimentos() {
    const sec = $('#depoimentos');
    const trilho = $('#depoTrilho');
    const itens = (S.testimonials || []).filter((t) => t && t.text && t.name);
    if (!sec || !itens.length) { pendencias.push('testimonials — vazio; seção oculta (só ative com depoimentos reais e autorizados)'); return; }

    const cartao = (t) => `
      <figure class="depoimento">
        <div class="depoimento__topo">
          ${t.photo ? `<img class="depoimento__foto" src="${esc(t.photo)}" width="56" height="56" loading="lazy" alt="">` : ''}
          <div>
            <span class="depoimento__nome">${esc(t.name)}</span>
            ${t.city ? `<span class="depoimento__cidade">${esc(t.city)}</span>` : ''}
            <span class="depoimento__estrelas" aria-label="${t.stars || 5} de 5 estrelas">${'★'.repeat(t.stars || 5)}${'☆'.repeat(5 - (t.stars || 5))}</span>
          </div>
        </div>
        <blockquote class="depoimento__texto">${esc(t.text)}</blockquote>
        <figcaption class="depoimento__selo">✓ Comprador(a) do guia</figcaption>
      </figure>`;

    // duplica a sequência para o loop ficar contínuo
    const html = itens.map(cartao).join('');
    trilho.innerHTML = html + html;
    $$('.depoimento', trilho).slice(itens.length).forEach((el) => el.setAttribute('aria-hidden', 'true'));

    // Movimento automático via JS (funciona mesmo com "reduzir animações" ligado no sistema)
    const janela = $('#depoJanela');
    const VELOCIDADE = 28; // pixels por segundo
    let pausado = false, ultimo = null, retomar, pos = 0;
    const metade = () => trilho.scrollWidth / 2;

    // `pos` acumula frações de pixel — scrollLeft sozinho arredonda e travaria em 0
    const passo = (agora) => {
      if (ultimo === null) ultimo = agora;
      const dt = Math.min(agora - ultimo, 100) / 1000;
      ultimo = agora;
      if (!pausado) {
        pos += VELOCIDADE * dt;
        if (pos >= metade()) pos -= metade();
        janela.scrollLeft = pos;
      } else {
        pos = janela.scrollLeft; // acompanha o arrasto da pessoa
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);

    // pausa enquanto a pessoa interage; retoma 3 s depois
    const pausar = () => { pausado = true; clearTimeout(retomar); };
    const liberar = () => { clearTimeout(retomar); retomar = setTimeout(() => { pausado = false; }, 3000); };
    janela.addEventListener('mouseenter', pausar);
    janela.addEventListener('mouseleave', () => { pausado = false; });
    janela.addEventListener('touchstart', pausar, { passive: true });
    janela.addEventListener('touchend', liberar, { passive: true });

    // arrastar com o mouse no desktop
    let arrastando = false, x0 = 0, s0 = 0;
    janela.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; arrastando = true; x0 = e.clientX; s0 = janela.scrollLeft; janela.classList.add('depo__janela--arrastando'); });
    window.addEventListener('pointermove', (e) => { if (arrastando) janela.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', () => { arrastando = false; janela.classList.remove('depo__janela--arrastando'); });

    sec.hidden = false;
  }

  /* ---------- Contato / WhatsApp ---------- */
  function contato() {
    const lista = $('#rodapeContatoLista');
    const itens = [];
    const zap = zapLink();
    if (zap) {
      const n = S.whatsapp.number.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
      itens.push(`<li><a href="${zap}" target="_blank" rel="noopener">WhatsApp ${esc(n)}</a></li>`);
      const flut = $('#zapFlutuante'); flut.href = zap; flut.hidden = false;
      const ajuda = $('#faqAjuda'); $('#faqZap').href = zap; ajuda.hidden = false;
    } else {
      pendencias.push('whatsapp.number — sem número de suporte (botão flutuante e "Falar pelo WhatsApp" ocultos)');
    }
    if (S.brand && S.brand.email) itens.push(`<li><a href="mailto:${esc(S.brand.email)}">${esc(S.brand.email)}</a></li>`);
    else pendencias.push('brand.email — e-mail de suporte ausente');
    if (S.instagram) itens.push(`<li><a href="${esc(S.instagram)}" target="_blank" rel="noopener">Instagram</a></li>`);

    lista.innerHTML = itens.length
      ? itens.join('')
      : '<li class="aviso-provisorio">⚠️ Sem canal de suporte configurado. Preencha whatsapp.number ou brand.email em js/config.js — venda online exige um canal de atendimento.</li>';
  }

  /* ---------- JSON-LD (Product + Offer) ---------- */
  function jsonld() {
    const el = $('#jsonld');
    if (!el) return;
    const b = S.brand || {}, o = S.offer;
    const grafo = [{ '@type': 'WebSite', name: b.name, url: (!/SEU-DOMINIO/.test(b.siteUrl || '') ? b.siteUrl : undefined), inLanguage: 'pt-BR' }];
    if (o && o.checkoutUrl && !o.priceIsPlaceholder) {
      grafo.push({
        '@type': 'Product', name: o.title, brand: { '@type': 'Brand', name: b.name },
        offers: { '@type': 'Offer', price: o.price.toFixed(2), priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: o.checkoutUrl },
      });
    }
    el.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }, null, 2);
  }

  /* ---------- Menu mobile e cabeçalho ---------- */
  function navegacao() {
    const cab = $('#cabecalho');
    const rolou = () => cab.classList.toggle('cabecalho--rolado', window.scrollY > 8);
    rolou();
    window.addEventListener('scroll', rolou, { passive: true });
  }

  /* ---------- Prévia interativa ---------- */
  function previa() {
    const raiz = $('#previa');
    const receitas = S.recipes || [];
    if (!raiz || !receitas.length) { if (raiz) raiz.closest('section').hidden = true; return; }

    const lista = $('#previaLista'), detalhe = $('#previaDetalhe');
    let selecionada = null;

    lista.innerHTML = receitas.map((r) => `
      <li><button class="previa__item" data-id="${esc(r.id)}" aria-selected="false">
        <img class="previa__thumb" src="img/receitas/${esc(r.id)}-thumb.webp" width="64" height="64" loading="lazy" alt="">
        <span>
          <span class="previa__item-cat">${esc(r.cat)}</span>
          <span class="previa__item-nome">${esc(r.name)}</span>
          <span class="previa__item-tempo">⏱ ${esc(r.time)}</span>
        </span>
        <span class="previa__item-seta" aria-hidden="true">›</span>
      </button></li>`).join('');

    const itens = $$('.previa__item', lista);

    const mostrar = (id, rolar) => {
      const r = receitas.find((x) => x.id === id) || receitas[0];
      selecionada = r.id;
      itens.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === r.id)));
      $('#previaFoto').src = `img/receitas/${r.id}-foto.webp`;
      $('#previaFoto').alt = r.name;
      $('#previaCat').textContent = r.cat;
      $('#previaNome').textContent = r.name;
      $('#previaTempo').textContent = r.time;
      $('#previaKcal').textContent = r.kcal;
      $('#previaCarb').textContent = r.carbs;
      $('#previaFibra').textContent = r.fiber;
      $('#previaBeneficio').textContent = r.benefit;
      const pag = $('#previaPagina');
      pag.src = `img/receitas/${r.id}-700.webp`;
      pag.srcset = `img/receitas/${r.id}-700.webp 700w, img/receitas/${r.id}.webp 1200w`;
      pag.alt = `Página completa da receita ${r.name}`;
      // move o painel de detalhe para logo abaixo da linha selecionada (acordeão)
      const botao = itens.find((b) => b.dataset.id === r.id);
      botao.parentElement.appendChild(detalhe);
      detalhe.hidden = false;
      detalhe.style.animation = 'none'; void detalhe.offsetWidth; detalhe.style.animation = '';
      if (rolar) {
        const alvo = botao.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: alvo, behavior: 'smooth' });
      }
    };

    const fechar = () => {
      selecionada = null;
      itens.forEach((b) => b.setAttribute('aria-selected', 'false'));
      detalhe.hidden = true;
    };

    lista.addEventListener('click', (e) => {
      const b = e.target.closest('.previa__item');
      if (!b) return;
      // clicar de novo na receita aberta fecha o detalhe
      if (b.dataset.id === selecionada) fechar();
      else mostrar(b.dataset.id, true);
    });

    mostrar(receitas[0].id, false);
  }

  /* ---------- Analytics (só carrega se houver ID) ---------- */
  function analytics() {
    const a = S.analytics || {};
    if (a.gaMeasurementId) {
      const s = document.createElement('script');
      s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(a.gaMeasurementId)}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', a.gaMeasurementId);
    }
    // Rastreia cliques em "Comprar" (GA4), se ativo
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-produto]');
      if (link && window.gtag) window.gtag('event', 'begin_checkout', { item_id: link.dataset.produto });
    });
  }

  /* ---------- Modo dev ---------- */
  function relatorio() {
    if (!DEV) return;
    document.body.classList.add('dev');
    console.group(`%c[dev] ${pendencias.length} pendência(s) em js/config.js`, 'font-weight:bold;color:#C9602F');
    pendencias.forEach((p) => console.log('•', p));
    console.groupEnd();
    const marcados = $$('[data-editar]').length;
    if (marcados) console.log(`%c[dev] ${marcados} bloco(s) amarelo(s) [data-editar] ainda no index.html`, 'color:#C9602F');
  }

  /* ---------- Início ---------- */
  aplicarMarca();
  renderOferta();
  amostra();
  depoimentos();
  contato();
  jsonld();
  navegacao();
  previa();
  analytics();
  relatorio();
})();
