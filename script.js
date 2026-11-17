(() => {
const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ====== Corações e detalhes flutuando ====== */
const fl = $('#floaters');
if (!reduce) ['💗','🌸','✦','🎀','💕','✿','♡','🌷'].concat(['💗','✦','🌸']).forEach((e, i) => {
  const s = document.createElement('span'); s.className = 'fl'; s.textContent = e;
  s.style.cssText = `left:${(i*9+Math.random()*6)%96}%;font-size:${14+Math.random()*16}px;animation-duration:${14+Math.random()*14}s;animation-delay:${-Math.random()*20}s`;
  fl.appendChild(s);
});

/* ====== Menu ativo ====== */
const links = [...document.querySelectorAll('#nav a')];
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('header,section').forEach(s => io.observe(s));

/* ====== 10 motivos (textos exatos) ====== */
const motivos = [
['Sua beleza','porque você é linda, e não falo apenas da sua aparência. Existe algo em você que encanta até nos pequenos detalhes.'],
['Sua doçura','pelo seu jeito carinhoso, pela sua delicadeza e pela forma como consegue tornar os momentos mais simples especiais.'],
['Sua inteligência','porque admiro sua maneira de pensar, sua capacidade de aprender e a mulher inteligente que você é.'],
['Seu sorriso','porque existe algo nele que consegue melhorar meu dia, mesmo quando tudo parece estar dando errado.'],
['Seu carinho','porque amo a forma como você demonstra amor, nos pequenos gestos e nas pequenas atitudes.'],
['Sua delicadeza','porque existe uma beleza especial no seu jeito de agir, falar e enxergar o mundo.'],
['Seu jeito de ser','porque não preciso que você seja outra pessoa. Amo quem você é, inclusive nos detalhes que talvez você nem perceba.'],
['Sua companhia','porque até os momentos mais comuns ficam melhores quando tenho você ao meu lado.'],
['A paz que você me transmite','porque estar com você faz com que eu encontre felicidade nas pequenas coisas.'],
['Por ser você','porque, entre tantas pessoas no mundo, foi em você que encontrei alguém com quem quero compartilhar minha vida.']];
const envs = $('#envs'), count = $('#count');
motivos.forEach(([t, p], i) => {
  const b = document.createElement('button');
  b.className = 'env'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', `Motivo ${i+1}: ${t}`);
  b.innerHTML = `<div class="e-back"></div><div class="e-flap"></div>
    <div class="e-letter"><h3>${t}</h3><p>${p[0].toUpperCase() + p.slice(1)}</p></div>
    <div class="e-front"></div><div class="e-seal">💗</div><div class="e-title">${t}</div>`;
  b.addEventListener('click', () => {
    const o = b.classList.toggle('open'); b.setAttribute('aria-expanded', o);
    count.textContent = envs.querySelectorAll('.open').length;
    if (o) burst(b);
  });
  envs.appendChild(b);
});
function burst(el) {
  if (reduce) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('span'); h.textContent = ['💗','✦','🌸'][i % 3];
    h.style.cssText = `position:fixed;z-index:30;pointer-events:none;left:${r.left + r.width/2}px;top:${r.top + 40}px;font-size:16px;transition:all 1.2s ease-out;opacity:1`;
    document.body.appendChild(h);
    requestAnimationFrame(() => { h.style.transform = `translate(${(Math.random()-.5)*160}px,${-60-Math.random()*90}px)`; h.style.opacity = 0; });
    setTimeout(() => h.remove(), 1300);
  }
}

/* ====== Polaroids: 5 espaços ====== */
// Coloque suas fotos em /fotos como foto1.jpg ... foto5.jpg e edite as legendas aqui:
const fotos = [
  { src:'fotos/foto1.jpg', cap:'Meu lugar favorito é perto de você' },
  { src:'fotos/foto2.jpg', cap:'Esse sorriso, meu favorito' },
  { src:'fotos/foto3.jpg', cap:'Nós dois, do nosso jeitinho' },
  { src:'fotos/foto4.jpg', cap:'Minha garotinha' },
  { src:'fotos/foto5.jpg', cap:'Linda de todos os jeitos' }];
const polas = $('#polas');
const saved = JSON.parse(localStorage.getItem('caps') || '{}');
const rots = ['-3deg','2deg','-1.5deg','3deg','-2deg'];
let editing = false;
fotos.forEach((f, i) => {
  const d = document.createElement('figure'); d.className = 'pola'; d.style.setProperty('--r', rots[i]);
  d.innerHTML = `<button class="ph none" aria-label="Ampliar foto ${i+1}"><img alt="" hidden><span class="empty"><b>🌸</b>Foto ${i+1}<br><small>fotos/foto${i+1}.jpg</small></span></button>
    <figcaption class="cap">${saved[i] ?? f.cap}</figcaption>`;
  const ph = d.querySelector('.ph'), img = d.querySelector('img'), cap = d.querySelector('.cap');
  const show = src => { img.src = src; };
  img.onload = () => { img.hidden = false; ph.classList.remove('none'); };
  img.onerror = () => { img.hidden = true; ph.classList.add('none'); };
  show(f.src);
  ph.addEventListener('click', () => {
    if (editing) { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = () => inp.files[0] && show(URL.createObjectURL(inp.files[0])); inp.click(); }
    else if (!img.hidden) openLb(img.src, cap.textContent);
  });
  cap.addEventListener('input', () => { saved[i] = cap.textContent; localStorage.setItem('caps', JSON.stringify(saved)); });
  polas.appendChild(d);
});
if (location.search.includes('editar')) {
  $('#editbar').hidden = false;
  $('#toggle-edit').onclick = () => {
    editing = !editing; polas.classList.toggle('editing', editing);
    polas.querySelectorAll('.cap').forEach(c => c.contentEditable = editing);
    $('#toggle-edit').textContent = editing ? '✓ Concluir edição' : '✎ Editar legendas e fotos';
  };
}
const lb = $('#lb');
function openLb(src, cap) { $('img', lb).src = src; $('figcaption', lb).textContent = cap; lb.hidden = false; $('#lb-close').focus(); }
const closeLb = () => lb.hidden = true;
$('#lb-close').onclick = closeLb; lb.onclick = e => { if (e.target === lb) closeLb(); };

/* ====== Seção final: revelação suave ====== */
const fx = document.querySelectorAll('.fx');
const fio = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('show'); fio.unobserve(en.target); }
}), { threshold: .4 });
fx.forEach((el, i) => { el.style.transitionDelay = '.15s'; fio.observe(el); });
const st = $('.stars');
for (let i = 0; i < 26; i++) { const s = document.createElement('span'); s.textContent = i % 3 ? '✦' : '♡';
  s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${8+Math.random()*14}px;animation-delay:${Math.random()*3}s;opacity:.7`; st.appendChild(s); }

/* ====== Easter egg: calendário secreto (Dezembro/2026, dia 1 marcado) ====== */
const egg = $('#egg'), cal = $('#cal'), msg = $('#egg-msg'), q = $('#egg-q');
const Q0 = q.textContent;
function drawCal() {
  cal.hidden = false; msg.textContent = ''; q.textContent = Q0;
  cal.innerHTML = '<h3>Dezembro 2026</h3>' + ['D','S','T','Q','Q','S','S'].map(d => `<i>${d}</i>`).join('') + '<span></span>'.repeat(2) +
    Array.from({ length: 31 }, (_, i) => i + 1).map(d => d === 1 ? '<button class="day mark" data-d="1" aria-label="Dia 1">1<em>♡</em></button>' : `<button class="day" data-d="${d}" tabindex="-1">${d}</button>`).join('');
}
const openEgg = () => { drawCal(); egg.hidden = false; };
$('#secret-star').onclick = openEgg;
$('#secret-star').onkeydown = e => (e.key === 'Enter' || e.key === ' ') && openEgg();
$('#egg-x').onclick = () => egg.hidden = true;
cal.addEventListener('click', e => {
  const b = e.target.closest('.day'); if (!b) return;
  if (b.dataset.d !== '1') { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); return; }
  msg.textContent = 'Esse dia é só nosso 💗'; burst(egg.firstElementChild);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLb(); egg.hidden = true; } });
})();
