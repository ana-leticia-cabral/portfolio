/* =====================================================
   LÓGICA DO PORTFÓLIO
   Os dados (projetos, certificações, currículo…) ficam em dados.js
===================================================== */

/* =====================================================
   PREPARAÇÃO
===================================================== */
const MESES_NOME = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MESES_ABR  = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
PROJETOS.forEach(p => {
  const [m, a] = p.ano.split(",");
  p.y = parseInt(a, 10);
  p.m = MESES_NOME.indexOf(m.trim());
  p.key = p.y * 12 + p.m;
});

const esc = s => String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const reduzMovimento = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const ABAS_COM_FILTRO = ["topo", "projetos", "certificacoes", "pratica"];
let abaAtual = "topo";

/* Estado global dos filtros — todo o painel reage a ele */
const filtro = { ferr: null, tipo: null, mes: null };
const ui = { tabela: { meses: false, tipos: false, traj: false }, projCat: "Todas", projBusca: "", projOrdem: "recentes", certAgrupar: "ano" };

const temFerr = it => !filtro.ferr || it.tags.some(t => filtro.ferr.alias.includes(t.toLowerCase()));
const projFerr = () => PROJETOS.filter(temFerr);
const projVisiveis = () => PROJETOS.filter(p => temFerr(p) && (filtro.mes === null || p.key === filtro.mes));
const certFerr = () => CERTIFICACAO.filter(temFerr);
const certVisiveis = () => CERTIFICACAO.filter(c => temFerr(c) && (!filtro.tipo || c.categoria === filtro.tipo));
const praticaVisiveis = () => PRATICA.filter(temFerr);
const temCertificado = c => !!(c.selo || c.imagem);
const plural = (n, s, p) => n + " " + (n === 1 ? s : p);

function ferrPorTag(tag){
  const t = tag.toLowerCase();
  const s = SKILLS.find(x => x.nome.toLowerCase() === t);
  return s ? { nome: s.nome, alias: s.alias } : { nome: tag, alias: [t] };
}
function alternarFerr(f){
  filtro.ferr = (filtro.ferr && filtro.ferr.nome === f.nome) ? null : f;
  renderTudo();
}
function limparFiltros(){ filtro.ferr = null; filtro.tipo = null; filtro.mes = null; renderTudo(); }

/* botão "Limpar filtros" exibido em qualquer lista vazia */
document.addEventListener("click", e => {
  if(!e.target.closest("[data-limpar-tudo]")) return;
  ui.projBusca = ""; ui.projCat = "Todas";
  document.getElementById("projBusca").value = "";
  limparFiltros();
});

const tagsHtml = tags => tags.map(t => `<span data-tag="${esc(t)}" title="Filtrar por ${esc(t)}">${t}</span>`).join("");

/* =====================================================
   TOOLTIP
===================================================== */
const tip = document.getElementById("tip");
function mostrarTip(el){
  const html = el.getAttribute("data-tip");
  if(!html) return;
  tip.innerHTML = html;
  tip.classList.add("on");
  const r = el.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = r.left + r.width / 2 - tw / 2;
  let y = r.top - th - 10;
  if(y < 8) y = r.bottom + 10;
  x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
  tip.style.left = x + "px";
  tip.style.top = y + "px";
}
const esconderTip = () => tip.classList.remove("on");
document.addEventListener("mouseover", e => { const el = e.target.closest("[data-tip]"); el ? mostrarTip(el) : esconderTip(); });
document.addEventListener("focusin",  e => { const el = e.target.closest("[data-tip]"); if(el) mostrarTip(el); });
document.addEventListener("focusout", esconderTip);
document.addEventListener("scroll", esconderTip, { passive: true, capture: true });

/* clique em qualquer tag = filtrar por ela */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-tag]");
  if(!t) return;
  alternarFerr(ferrPorTag(t.getAttribute("data-tag")));
});

/* =====================================================
   FILTROS ATIVOS
===================================================== */
function renderFiltrosAtivos(){
  const bar = document.getElementById("filtrosAtivos");
  const itens = [];
  if(filtro.ferr) itens.push({ k: "ferr", r: "Ferramenta", v: filtro.ferr.nome });
  if(filtro.tipo) itens.push({ k: "tipo", r: "Tipo", v: filtro.tipo });
  if(filtro.mes !== null) itens.push({ k: "mes", r: "Mês", v: MESES_ABR[filtro.mes % 12] + "/" + Math.floor(filtro.mes / 12) });
  bar.hidden = !itens.length || !ABAS_COM_FILTRO.includes(abaAtual);
  if(bar.hidden) return;
  bar.innerHTML = `<span class="filtros-rotulo">Filtrando</span>` +
    itens.map(i => `<button type="button" class="filtro-chip" data-limpar="${i.k}" aria-label="Remover filtro ${i.r}: ${esc(i.v)}">${i.r}: <b>${esc(i.v)}</b><span class="x">✕</span></button>`).join("") +
    (itens.length > 1 ? `<button type="button" class="filtros-limpar" data-limpar="tudo">Limpar tudo</button>` : "");
}
document.getElementById("filtrosAtivos").addEventListener("click", e => {
  const b = e.target.closest("[data-limpar]");
  if(!b) return;
  const k = b.getAttribute("data-limpar");
  if(k === "tudo") return limparFiltros();
  filtro[k] = null;
  renderTudo();
});

/* =====================================================
   KPIs (com contagem animada)
===================================================== */
const kpiAtual = {};
const fmtInt = n => String(n);
function setKpi(id, valor, sub, fmt){
  const el = document.getElementById("kpi-" + id);
  const v = el.querySelector(".kpi-valor");
  el.querySelector(".kpi-sub").textContent = sub;
  const de = kpiAtual[id] || 0;
  kpiAtual[id] = valor;
  cancelAnimationFrame(el._raf);
  if(reduzMovimento || de === valor){ v.textContent = fmt(valor); return; }
  const t0 = performance.now(), dur = 650;
  const passo = agora => {
    const k = Math.min(1, (agora - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    v.textContent = fmt(Math.round(de + (valor - de) * e));
    if(k < 1) el._raf = requestAnimationFrame(passo);
  };
  el._raf = requestAnimationFrame(passo);
}

function renderKpis(){
  const ps = projVisiveis();
  const cs = certVisiveis();
  const certificados = cs.filter(temCertificado).length;
  const emAndamento = cs.length - certificados;
  const meses = ps.length ? (Math.max(...ps.map(p => p.key)) - Math.min(...ps.map(p => p.key)) + 1) : 0;

  /* tecnologias distintas (case-insensitive), ordenadas por uso */
  const tec = new Map();
  ps.forEach(p => p.tags.forEach(t => {
    const k = t.toLowerCase();
    if(NAO_FERRAMENTA.includes(k)) return;
    if(!tec.has(k)) tec.set(k, { nome: t, n: 0 });
    tec.get(k).n++;
  }));
  const lista = [...tec.values()].sort((x, y) => (y.n - x.n) || x.nome.localeCompare(y.nome, "pt-BR"));

  setKpi("proj", ps.length, ps.length ? (ps.length === 1 ? "no recorte atual" : "em " + plural(meses, "mês", "meses") + " de atividade") : "nenhum no recorte", fmtInt);
  setKpi("cert", certificados, emAndamento ? "+ " + plural(emAndamento, "formação em andamento", "formações em andamento") : "cursos, eventos e certificações", fmtInt);
  setKpi("tec", lista.length, "usadas nos projetos · clique para filtrar", fmtInt);

  document.getElementById("kpiTools").innerHTML = lista.length
    ? lista.map(x => {
        const ativo = filtro.ferr && filtro.ferr.alias.includes(x.nome.toLowerCase());
        return `<span data-tag="${esc(x.nome)}" class="${ativo ? "ativo" : ""}" title="${plural(x.n, "projeto", "projetos")} · clique para filtrar">${x.nome}</span>`;
      }).join("")
    : `<span class="vazio-tec">nenhuma no recorte</span>`;
}

/* =====================================================
   CARTÃO: projetos por mês
===================================================== */
function cabecalhoCard(id, titulo, sub){
  return `<div class="chart-head">
    <div><h4>${titulo}</h4><div class="chart-sub">${sub}</div></div>
    <button type="button" class="btn-tabela" data-tabela="${id}" aria-pressed="${ui.tabela[id]}">${ui.tabela[id] ? "Ver gráfico" : "Ver tabela"}</button>
  </div>`;
}

function renderMeses(){
  const card = document.getElementById("card-meses");
  const min = Math.min(...PROJETOS.map(p => p.key)), max = Math.max(...PROJETOS.map(p => p.key));
  const meses = [];
  for(let k = min; k <= max; k++) meses.push(k);
  const total = k => PROJETOS.filter(p => p.key === k);
  const filt  = k => projFerr().filter(p => p.key === k);
  const topo = Math.max(2, ...meses.map(k => total(k).length));
  const sub = filtro.ferr ? `Barra escura: projetos com ${esc(filtro.ferr.nome)} · clara: todos` : "Clique em uma barra para filtrar por mês";
  let corpo;

  if(ui.tabela.meses){
    corpo = `<table class="tbl"><thead><tr><th>Mês</th><th>Projetos</th><th>Títulos</th></tr></thead><tbody>` +
      meses.map(k => { const l = filt(k);
        return `<tr><td>${MESES_ABR[k % 12]}/${Math.floor(k / 12)}</td><td class="num">${l.length}</td><td>${l.map(p => esc(p.titulo)).join("; ") || "—"}</td></tr>`; }).join("") +
      `</tbody></table>`;
  } else {
    const gl = []; for(let i = 0; i <= topo; i++) gl.push(i);
    corpo = `<div class="bars ${filtro.mes !== null ? "tem-sel" : ""}"><div class="plot">` +
      gl.map(i => `<div class="gl" style="bottom:${i / topo * 100}%"><span class="gl-n">${i}</span></div>`).join("") +
      `<div class="cols">` +
      meses.map(k => {
        const t = total(k), f = filt(k);
        const sel = filtro.mes === k;
        const nomes = f.map(p => "• " + esc(p.titulo)).join("<br>");
        const tp = `<b>${MESES_NOME[k % 12]} de ${Math.floor(k / 12)}</b><br>${plural(f.length, "projeto", "projetos")}${filtro.ferr ? " <span>de " + t.length + "</span>" : ""}${nomes ? "<br>" + nomes : ""}`;
        return `<button type="button" class="bcol" data-mes="${k}" aria-pressed="${sel}" data-tip="${esc(tp)}" aria-label="${MESES_ABR[k % 12]} ${Math.floor(k / 12)}: ${plural(f.length, "projeto", "projetos")}">
          ${filtro.ferr && t.length ? `<div class="b-total" style="height:${t.length / topo * 100}%"></div>` : ""}
          ${f.length ? `<div class="b-val" style="height:${f.length / topo * 100}%"><span class="b-n">${f.length}</span></div>` : ""}
          <span class="lbl">${MESES_ABR[k % 12]}<small>${Math.floor(k / 12)}</small></span>
        </button>`;
      }).join("") + `</div></div></div>`;
  }
  card.innerHTML = cabecalhoCard("meses", "Projetos por mês", sub) + corpo;
}

/* =====================================================
   CARTÃO: certificações por tipo (barras)
===================================================== */
function renderTipos(){
  const card = document.getElementById("card-tipos");
  const base = certFerr();
  const dados = TIPOS_CERT.map(t => ({ t, n: base.filter(c => c.categoria === t).length }));
  const soma = dados.reduce((s, d) => s + d.n, 0);
  const topo = Math.max(1, ...dados.map(d => d.n));
  const sub = filtro.ferr ? `Itens com ${esc(filtro.ferr.nome)} · clique para filtrar` : "Clique em uma barra para filtrar";
  let corpo;

  if(ui.tabela.tipos){
    corpo = `<table class="tbl"><thead><tr><th>Tipo</th><th>Itens</th><th>%</th></tr></thead><tbody>` +
      dados.map(d => `<tr><td>${d.t}</td><td class="num">${d.n}</td><td class="num">${soma ? Math.round(d.n / soma * 100) : 0}%</td></tr>`).join("") +
      `</tbody></table>`;
  } else if(!soma){
    corpo = `<p class="vazio">Nenhuma certificação com esta ferramenta.</p>`;
  } else {
    corpo = `<div class="hbars ${filtro.tipo ? "tem-sel" : ""}">` + dados.map(d => {
      const sel = filtro.tipo === d.t;
      const pct = soma ? Math.round(d.n / soma * 100) : 0;
      const tp = `<b>${d.t}</b><br>${plural(d.n, "item", "itens")} · ${pct}% do total`;
      return `<button type="button" class="hrow" data-tipo="${esc(d.t)}" aria-pressed="${sel}" ${d.n ? "" : "disabled"} data-tip="${esc(tp)}">
        <span class="h-top"><span class="h-nome">${d.t}</span><span class="h-val">${d.n}<small>${pct}%</small></span></span>
        <span class="h-track"><span class="h-fill" style="width:${d.n / topo * 100}%"></span></span>
      </button>`;
    }).join("") + `</div>
    <p class="hbars-total">${plural(soma, "item", "itens")} no total</p>`;
  }
  card.innerHTML = cabecalhoCard("tipos", "Certificações por tipo", sub) + corpo;
}

/* =====================================================
   CARTÃO: trajetória (linha do tempo)
===================================================== */
function renderTraj(){
  const card = document.getElementById("card-traj");
  const anoAtual = Math.max(new Date().getFullYear(), ...TRAJETORIA.map(t => t.fim || 0));
  const ini = Math.min(...TRAJETORIA.map(t => t.ini));
  const n = anoAtual - ini + 1;
  const anos = []; for(let a = ini; a <= anoAtual; a++) anos.push(a);
  const periodo = t => t.ini + " – " + (t.fim ? t.fim : "atual");
  let corpo;
  if(ui.tabela.traj){
    corpo = `<table class="tbl"><thead><tr><th>Atividade</th><th>Instituição</th><th>Período</th></tr></thead><tbody>` +
      TRAJETORIA.map(t => `<tr><td>${t.nome}</td><td>${t.org}</td><td class="num">${periodo(t)}</td></tr>`).join("") + `</tbody></table>`;
  } else {
    corpo = `<div class="gantt" style="--n:${n}">
      <div class="g-row"><span></span><div class="g-anos">${anos.map(a => `<span>${a}</span>`).join("")}</div></div>` +
      TRAJETORIA.map(t => {
        const fim = t.fim || anoAtual;
        const tp = `<b>${t.nome}</b><br>${t.org}<br>${periodo(t)}${t.fim ? "" : " (em andamento)"}`;
        return `<div class="g-row">
          <div class="g-nome">${t.nome}<small>${t.org} · ${periodo(t)}</small></div>
          <div class="g-track">${anos.map(() => "<i></i>").join("")}
            <div class="g-bar ${t.fim ? "" : "atual"}" style="--s:${t.ini - ini};--w:${fim - t.ini + 1};--c:${t.cor}" data-tip="${esc(tp)}" tabindex="0" role="img" aria-label="${esc(t.nome + ", " + periodo(t))}"></div>
          </div></div>`;
      }).join("") + `</div>`;
  }
  card.innerHTML = cabecalhoCard("traj", "Trajetória", "Formação e experiência ao longo dos anos") + corpo;
}

/* interações dos gráficos (delegação) */
document.querySelector(".dash-grid").addEventListener("click", e => {
  const tb = e.target.closest("[data-tabela]");
  if(tb){ const id = tb.getAttribute("data-tabela"); ui.tabela[id] = !ui.tabela[id]; renderGraficos(); return; }
  const m = e.target.closest("[data-mes]");
  if(m){ const k = parseInt(m.getAttribute("data-mes"), 10); filtro.mes = filtro.mes === k ? null : k; renderTudo(); return; }
  const t = e.target.closest("[data-tipo]");
  if(t && !t.disabled){ const v = t.getAttribute("data-tipo"); filtro.tipo = filtro.tipo === v ? null : v; renderTudo(); }
});
function renderGraficos(){ esconderTip(); renderMeses(); renderTipos(); renderTraj(); }

/* =====================================================
   LISTA DE PROJETOS (painel)
===================================================== */
function renderDestaques(){
  const ps = projVisiveis().sort((a, b) => b.key - a.key);
  const box = document.getElementById("destaques");
  document.getElementById("destaquesTitulo").textContent = (filtro.ferr || filtro.mes !== null) ? plural(ps.length, "projeto no recorte", "projetos no recorte") : "Projetos recentes";
  if(!ps.length){
    box.innerHTML = `<p class="vazio">Nenhum projeto neste recorte. <button type="button" data-limpar-tudo>Limpar filtros</button></p>`;
    return;
  }
  box.innerHTML = ps.map(p => `
    <article class="dest">
      <div class="dest-thumb" style="background-image:url('${p.imagem}')"></div>
      <div>
        <div class="dest-meta">${p.categoria} · ${p.ano}</div>
        <h4><a href="${p.link}" target="_blank" rel="noopener">${p.titulo} ↗</a></h4>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </div>
    </article>`).join("");
}
document.getElementById("verTodosProjetos").addEventListener("click", () => mostrarAba("projetos"));

/* =====================================================
   ABA PROJETOS
===================================================== */
function renderProjetos(){
  const base = PROJETOS.filter(p => temFerr(p) && (filtro.mes === null || p.key === filtro.mes));
  const cats = ["Todas", ...new Set(PROJETOS.map(p => p.categoria))];
  const chips = document.getElementById("projCats");
  chips.innerHTML = cats.map(c => {
    const n = c === "Todas" ? base.length : base.filter(p => p.categoria === c).length;
    return `<button type="button" class="chip-tipo caps" data-cat="${esc(c)}" aria-pressed="${ui.projCat === c}">${c}<span class="n">${n}</span></button>`;
  }).join("");

  const q = ui.projBusca.trim().toLowerCase();
  let ps = base.filter(p => (ui.projCat === "Todas" || p.categoria === ui.projCat) &&
    (!q || (p.titulo + " " + p.descricao + " " + p.tags.join(" ") + " " + p.categoria).toLowerCase().includes(q)));
  ps.sort((a, b) => ui.projOrdem === "recentes" ? b.key - a.key : a.key - b.key);

  document.getElementById("contagem-projetos").textContent = ps.length === PROJETOS.length ? PROJETOS.length + " projetos" : ps.length + " de " + PROJETOS.length + " projetos";
  const grid = document.getElementById("projetos-grid");
  if(!ps.length){ grid.innerHTML = `<p class="vazio ocupa-linha">Nenhum projeto encontrado. <button type="button" data-limpar-tudo>Limpar filtros</button></p>`; return; }
  grid.innerHTML = ps.map(p => `
    <article class="card">
      <div class="card-imagem" style="background-image:url('${p.imagem}')">
        <div class="topo"><span class="tag-categoria">${p.categoria}</span><span class="tag-ano">${p.ano}</span></div>
        <div class="titulo-overlay"><a href="${p.link}" target="_blank" rel="noopener">${p.titulo} ↗</a></div>
      </div>
      <div class="card-corpo">
        <p>${p.descricao}</p>
        <div class="card-tags">${tagsHtml(p.tags)}</div>
      </div>
    </article>`).join("");
}
document.getElementById("projCats").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if(b){ ui.projCat = b.getAttribute("data-cat"); renderProjetos(); } });
document.getElementById("projBusca").addEventListener("input", e => { ui.projBusca = e.target.value; renderProjetos(); });
document.querySelectorAll("#projOrdem button").forEach(b => b.addEventListener("click", () => {
  ui.projOrdem = b.dataset.ordem;
  document.querySelectorAll("#projOrdem button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderProjetos();
}));

/* =====================================================
   ABA PRÁTICA TÉCNICA
===================================================== */
const ICONES_PRATICA = {
  sql: img("icone-sql.webp"), python: img("icone-python.webp"),
  estatistica: img("icone-estatistica.webp"), certificacao: img("icone-certificacao.webp")
};
function iconePratica(cat){
  const c = cat.toLowerCase();
  const k = (c.includes("sql") || c.includes("banco")) ? "sql" : c.includes("python") ? "python" : c.includes("certif") ? "certificacao" : "estatistica";
  return `<img src="${ICONES_PRATICA[k]}" alt="${esc(cat)}" loading="lazy" decoding="async">`;
}
function renderPratica(){
  const ps = praticaVisiveis();
  document.getElementById("contagem-pratica").textContent = ps.length === PRATICA.length ? PRATICA.length + " atividades" : ps.length + " de " + PRATICA.length + " atividades";
  const box = document.getElementById("pratica-lista");
  if(!ps.length){ box.innerHTML = `<p class="vazio ocupa-linha">Nenhuma atividade com este filtro. <button type="button" data-limpar-tudo>Limpar filtros</button></p>`; return; }
  box.innerHTML = ps.map(a => `
    <div class="pratica-item">
      <div class="pratica-imagem">${iconePratica(a.categoria)}</div>
      <div class="pratica-corpo">
        <div class="categoria">${a.categoria}</div>
        <div class="corpo"><h4>${a.titulo}</h4><p>${a.descricao}</p></div>
        <div class="pratica-tags">${tagsHtml(a.tags)}</div>
        ${a.link ? `<a class="link" href="${a.link}" target="_blank" rel="noopener">Ver mais →</a>` : ""}
      </div>
    </div>`).join("");
}

/* =====================================================
   ABA CERTIFICAÇÕES
===================================================== */
const ordemTipo = c => { const i = TIPOS_CERT.indexOf(c.categoria); return i === -1 ? 99 : i; };
const ordemAno = a => a === "Em andamento" ? 9999 : (parseInt(a, 10) || 0);

function cardCertificacao(c){
  const idx = CERTIFICACAO.indexOf(c);
  const imgSelo = c.selo || c.imagem;
  const bloco = imgSelo
    ? `<a class="certificacao-selo" href="#" data-cert="${idx}" title="Ver certificado ampliado"><img src="${imgSelo}" alt="Certificado: ${esc(c.titulo)}" loading="lazy" decoding="async"></a>`
    : `<div class="certificacao-selo placeholder"><span class="icone">🎓</span></div>`;
  return `<article class="certificacao-item">
    ${bloco}
    <div class="categoria">${c.categoria}</div>
    <div class="corpo-selo"><h4>${c.titulo}</h4><p>${c.descricao}</p></div>
    ${c.ano ? `<span class="tag-ano">${c.ano}</span>` : ""}
    ${!imgSelo ? `<span class="rotulo-em-breve">Certificado em breve</span>` : ""}
    <div class="certificacao-tags">${tagsHtml(c.tags)}</div>
    ${c.link ? `<a class="link" href="${c.link}" target="_blank" rel="noopener">${c.linkTexto || "Ver certificado →"}</a>` : ""}
  </article>`;
}

function renderCertificacoes(){
  /* chips de tipo (compartilhados com o gráfico) */
  const base = certFerr();
  const opcoes = ["Todos", ...TIPOS_CERT.filter(t => CERTIFICACAO.some(c => c.categoria === t))];
  const chips = document.getElementById("cert-filtros");
  chips.innerHTML = opcoes.map(t => {
    const n = t === "Todos" ? base.length : base.filter(c => c.categoria === t).length;
    const ativo = t === "Todos" ? !filtro.tipo : filtro.tipo === t;
    return `<button type="button" class="chip-tipo" data-tipo-cert="${esc(t)}" aria-pressed="${ativo}">${t}<span class="n">${n}</span></button>`;
  }).join("");

  const visiveis = certVisiveis().map(c => ({ c, i: CERTIFICACAO.indexOf(c) }));
  document.getElementById("contagem-certificacao").textContent =
    visiveis.length === CERTIFICACAO.length ? plural(CERTIFICACAO.length, "certificação", "certificações") : visiveis.length + " de " + CERTIFICACAO.length + " certificações";

  const lista = document.getElementById("certificacao-lista");
  if(!visiveis.length){ lista.innerHTML = `<p class="certificacao-vazio">Nenhuma certificação neste filtro. <button type="button" class="link-texto" data-limpar-tudo>Limpar filtros</button></p>`; return; }

  const porAno = ui.certAgrupar === "ano";
  const grupos = new Map();
  visiveis.forEach(({ c, i }) => { const k = porAno ? (c.ano || "Sem data") : c.categoria; if(!grupos.has(k)) grupos.set(k, []); grupos.get(k).push({ c, i }); });
  const chaves = [...grupos.keys()].sort((a, b) => porAno ? ordemAno(b) - ordemAno(a) : TIPOS_CERT.indexOf(a) - TIPOS_CERT.indexOf(b));

  lista.innerHTML = chaves.map(k => {
    const itens = grupos.get(k).sort((x, y) => porAno ? (ordemTipo(x.c) - ordemTipo(y.c)) || (x.i - y.i) : (ordemAno(y.c.ano) - ordemAno(x.c.ano)) || (x.i - y.i));
    return `<div class="certificacao-grupo">
      <div class="certificacao-grupo-titulo"><h4>${k}</h4><span class="qtd">${itens.length} ${itens.length === 1 ? "item" : "itens"}</span></div>
      <div class="certificacao-grid">${itens.map(({ c }) => cardCertificacao(c)).join("")}</div>
    </div>`;
  }).join("");
}
document.getElementById("cert-filtros").addEventListener("click", e => {
  const b = e.target.closest("[data-tipo-cert]");
  if(!b) return;
  const v = b.getAttribute("data-tipo-cert");
  filtro.tipo = v === "Todos" ? null : v;
  renderTudo();
});
document.querySelectorAll("#cert-agrupar button").forEach(btn => btn.addEventListener("click", () => {
  ui.certAgrupar = btn.dataset.modo;
  document.querySelectorAll("#cert-agrupar button").forEach(b => b.setAttribute("aria-pressed", b === btn));
  renderCertificacoes();
}));
document.getElementById("certificacao-lista").addEventListener("click", e => {
  const a = e.target.closest("[data-cert]");
  if(!a) return;
  e.preventDefault();
  const c = CERTIFICACAO[parseInt(a.getAttribute("data-cert"), 10)];
  const lb = document.getElementById("lightboxCertificado");
  const img = document.getElementById("lightboxCertificadoImg");
  img.src = c.imagem || c.selo;
  img.alt = "Certificado: " + c.titulo;
  lb.classList.add("aberto");
});

function fecharCertificado(){
  document.getElementById("lightboxCertificado").classList.remove("aberto");
  document.getElementById("lightboxCertificadoImg").src = "";
}
document.getElementById("lightboxCertificado").addEventListener("click", e => { if(!e.target.closest("img")) fecharCertificado(); });
document.addEventListener("keydown", e => { if(e.key === "Escape"){ fecharCertificado(); fecharMenu(); } });

/* =====================================================
   ABA CURRÍCULO
   Se o PDF existir no endereço de CURRICULO.arquivo, mostra a
   visualização e o botão de download; se não existir (erro 404),
   mostra o aviso "em breve". Ao abrir o arquivo direto do computador
   (file://) não dá para verificar, então a página assume que existe.
===================================================== */
function iniciarCurriculo(){
  const { arquivo, nomeDownload } = CURRICULO;
  const raiz = document.getElementById("curriculo");
  raiz.querySelectorAll("[data-cv-baixar]").forEach(a => { a.href = arquivo; a.download = nomeDownload; });
  raiz.querySelector("[data-cv-abrir]").href = arquivo;

  const mostrar = disponivel => {
    raiz.querySelector("#cvDisponivel").hidden = !disponivel;
    raiz.querySelector("#cvEmBreve").hidden = disponivel;
    if(disponivel) raiz.querySelector("#cvViewer").data = arquivo + "#view=FitH";
  };
  fetch(arquivo, { method: "HEAD" })
    .then(r => mostrar(r.status !== 404))
    .catch(() => mostrar(true));
}

/* =====================================================
   RENDER GERAL
===================================================== */
const RENDER_ABA = {
  topo:          () => { renderKpis(); renderGraficos(); renderDestaques(); },
  projetos:      renderProjetos,
  pratica:       renderPratica,
  certificacoes: renderCertificacoes
};
/* só a aba aberta é redesenhada; as outras são montadas quando o usuário navega até elas */
function renderTudo(){
  renderFiltrosAtivos();
  if(RENDER_ABA[abaAtual]) RENDER_ABA[abaAtual]();
}

/* =====================================================
   NAVEGAÇÃO EM ABAS (botão "Navegar")
===================================================== */
const linksNav = document.querySelectorAll(".nav-pills a");
const paineis = document.querySelectorAll(".tab-panel");
const navToggle = document.getElementById("navToggle");
const navPills = document.getElementById("navPills");
const navToggleAtual = document.getElementById("navToggleAtual");

function fecharMenu(){ navPills.classList.remove("aberto"); navToggle.setAttribute("aria-expanded", "false"); }
navToggle.addEventListener("click", () => {
  const aberto = navPills.classList.toggle("aberto");
  navToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
});
document.addEventListener("click", e => { if(!e.target.closest(".sidebar-nav")) fecharMenu(); });

function mostrarAba(id, atualizarHash){
  let existe = false;
  paineis.forEach(p => { const ativo = p.id === id; p.classList.toggle("active", ativo); if(ativo) existe = true; });
  if(!existe){ id = "topo"; document.getElementById("topo").classList.add("active"); }
  abaAtual = id;
  linksNav.forEach(a => {
    const ativa = a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", ativa);
    if(ativa) navToggleAtual.textContent = a.textContent.trim();
  });
  if(atualizarHash !== false && history.replaceState) history.replaceState(null, "", "#" + id);
  fecharMenu();
  esconderTip();
  renderTudo();
  const painelAtivo = document.getElementById(id);
  if(painelAtivo) painelAtivo.scrollTop = 0;
}
linksNav.forEach(a => a.addEventListener("click", e => { e.preventDefault(); mostrarAba(a.getAttribute("href").slice(1)); }));

iniciarCurriculo();
mostrarAba((location.hash || "#topo").slice(1), false);
