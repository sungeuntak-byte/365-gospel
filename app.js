'use strict';
/* 365 복음 묵상 — 2차 앱 (개인용·배포용 공통 코드, 데이터만 다름) */
const VERSION = '0.9.2';
const APPNAME = '365 복음 묵상';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (id, cls = 'i') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
const WD = ['일', '월', '화', '수', '목', '금', '토'];
const HL = ['#fbeaa5', '#dcedc8', '#f8d7dc', '#e4dcf3', '#fbe0c8', '#d6e6f5'];
const HL_NAME = ['노랑', '연두', '분홍', '연보라', '연주황', '연파랑'];
const UL = ['#c0504d', '#3f6fb0', '#4f8a4a', '#7d5ba6'];
const AI = {
  claude: { name: 'Claude', url: 'https://claude.ai/new?q=' },
  chatgpt: { name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  gemini: { name: 'Gemini', url: 'https://gemini.google.com/app' },
};
const TRIG_TC = '위 구절을 번역 비교 작업 지침대로 검토한 결과를 알려줘';
const TRIG_TC_PART = q => `위 구절에서 “${q}” 부분을 번역 비교 작업 지침대로 검토한 결과를 알려줘`;
const TRIG_BCS = '위 본문의 배경과 문맥을 배경·문맥 파악 작업 지침대로 알아본 결과를 알려줘';
const NEWYEAR = '새해에도 말씀 안에서 믿음과 소망과 사랑으로 살아내기를!';
const TRIG_QA = '아래 질문에 말씀 Q&A 작업 지침대로 답해줘.';
const TRIG_QA_PART = q => `위 구절 중 “${q}”에 대한 아래 질문에 말씀 Q&A 작업 지침대로 답해줘.`;
const CATS0 = ['신학·교리', '영적 성장', '성도의 교제', '양육·교육', '전도·선교'];
const NOTIFY_TITLE = '오늘의 복음 묵상';
// 바깥 성경 사이트 (영어 책 이름은 USFM 코드 기준)
const EN = { GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy', JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs', ECC: 'Ecclesiastes', SNG: 'Song of Songs', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', JUD: 'Jude', REV: 'Revelation' };
const enRef = p => `${EN[p.code] || p.code} ${p.ch}:${p.vs}-${p.ve}`;
const yv = (id, ab) => (p, v1, v2) => { const a = v1 || p.vs, b = v2 || (v1 ? v1 : p.ve); return `https://www.bible.com/bible/${id}/${p.code}.${p.ch}${p.whole && !v1 ? '' : '.' + a + (b !== a ? '-' + b : '')}.${ab}`; };
const EXT = { krv: { name: '개역한글', url: yv(88, 'KRV') }, esv: { name: 'ESV', url: yv(59, 'ESV') }, saenew: { name: '새번역', url: yv(142, 'RNKSV') }, niv: { name: 'NIV', url: yv(111, 'NIV') } };
const BOOKS = Object.keys(EN);
const RNG = s => String(s).replace(/[–-](?=\d)/g, '~');
const INTRO = ['나의 복음과 예수 그리스도를 전파함은', '영세 전부터 감추어졌다가 이제는 나타내신 바 되었으며', '영원하신 하나님의 명을 따라 선지자들의 글로 말미암아', '모든 민족이 믿어 순종하게 하시려고 알게 하신 바', '그 신비의 계시를 따라 된 것이니', '이 복음으로', '너희를 능히 견고하게 하실 지혜로우신 하나님께', '예수 그리스도로 말미암아', '영광이 세세무궁하도록 있을지어다', '아멘'];
const FONTS = [['serif', '명조'], ['serif-light', '가는 명조'], ['sans-kr', '고딕'], ['sans-light', '가는 고딕'], ['sys', '기본 글꼴']];
const THEMES = [['calm', '차분하게'], ['clear', '맑게'], ['bright', '밝게']];
const THEME_COLOR = { calm: '#192c46', clear: '#2c6f6b', bright: '#f3ece1' };
const UI_STEPS = [['xs', '아주 작게', .86], ['small', '작게', .93], ['normal', '보통', 1], ['large', '크게', 1.14], ['xlarge', '아주 크게', 1.3]];
const FS_STEPS = [16, 18, 20, 22, 25];
const LH_STEPS = [['좁게', 1.7], ['보통', 1.9], ['넓게', 2.15]];
const PADS = [['narrow', '좁게', 12], ['normal', '보통', 18], ['wide', '넓게', 26]];

let D = { st: null, days: {}, order: {}, topics: {}, subs: {}, text: {}, memos: [], memoAt: {}, guides: {}, edition: 'public', books: {}, krv: null, krvOK: false };
let ST;            // 저장되는 상태 (진도·표시·설정)
let UM = [];       // 사용자가 쓴 메모
let MO = {};       // 기본 메모에 사용자가 입힌 서식 (id → html)
let KEY;           // 저장소 키 (판별)

/* ---------- 저장 (IndexedDB, 안 되면 localStorage) ---------- */
let DB = null;
function idbOpen() {
  return new Promise(res => {
    if (!window.indexedDB) return res(null);
    const r = indexedDB.open(KEY, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result); r.onerror = () => res(null);
  });
}
function idbGet(k) { return new Promise(res => { if (!DB) return res(undefined); const t = DB.transaction('kv').objectStore('kv').get(k); t.onsuccess = () => res(t.result); t.onerror = () => res(undefined); }); }
function idbSet(k, v) { return new Promise(res => { if (!DB) return res(false); const tx = DB.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = () => res(true); tx.onerror = () => res(false); }); }
function defaults() {
  return {
    v: 1,
    set: { vol: 1, ai: 'claude', fs: 18, lh: 1.9, mode: 'page', font: 'serif', newYear: true, setupDone: false, year: new Date().getFullYear(), home: 'date', notifyTime: '06:00', intro: true, theme: 'calm', ui: 2, uiv: 2, pad: 1 },
    prog: { 1: { read: {}, hist: [] }, 2: { read: {}, hist: [] }, 3: { read: {}, hist: [] } },
    cnt: {}, recent: null, marks: [], bm: [], leap: null, lastBackup: null, tips: {},
    dy: {}, dyv: 2, cats: [], mcat: {}, guideSaved: {}, seenVer: '', fread: {}, mind: {}, foldPick: 'det', pm: null,
  };
}
function normalize(s) {
  ST = s && s.v === 1 ? Object.assign(defaults(), s) : defaults(); ST.set = Object.assign(defaults().set, ST.set); if (ST.set.font === 'sans') ST.set.font = 'sys'; delete ST.set.esvKey;
  if (ST.set.uiv !== 2) { ST.set.ui = Math.min(4, (ST.set.ui || 0) + 1); ST.set.uiv = 2; } // 화면 글자 5단계로 바뀜
  if (ST.dyv !== 2) { ST.dy = {}; ST.dyv = 2; } // 대역: 날짜별 → 단락별
  if (!ST.recentD && ST.recent) ST.recentD = ST.recent; // 최근 읽은 곳: 일자별·주제별 따로
  if (!ST.firstUse) ST.firstUse = Date.now();
  ST.set.home = 'today'; // 들어올 때는 늘 오늘의 말씀
}
async function load() {
  DB = await idbOpen();
  let s = await idbGet('st'), um = await idbGet('um');
  if (!s) { try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { s = null; } if (s && DB) idbSet('st', s); }
  normalize(s); UM = Array.isArray(um) ? um : []; MO = (await idbGet('mo')) || {};
}
let saveT;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(async () => {
    const ok = DB ? await idbSet('st', ST) : false;
    if (!ok) { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) { toast('기록을 저장하지 못했습니다. 저장 공간을 확인해 주세요.'); } }
  }, 120);
}
async function saveUM() { const ok = DB ? await idbSet('um', UM) : false; if (!ok) toast('메모를 저장하지 못했습니다. 저장 공간을 확인해 주세요.', 4000); indexMemos(); }

/* ---------- 데이터 ---------- */
async function getJSON(u) { const r = await fetch(u); if (!r.ok) throw new Error(u); return r.json(); }
async function loadVol(n) {
  if (!D.text[n]) { D.text[n] = await getJSON(`data/text-v${n}.json`); for (const id in D.extra || {}) { const d = D.days[id]; if (d && d.vol === n) d.x.forEach((x, k) => { D.text[n][`${id}-p${d.p.length + k + 1}`] = x.text; }); } }
  return D.text[n];
}
async function loadAll() { await Promise.all([1, 2, 3].map(loadVol)); }
function vtext(pid, v) { const n = +pid[1]; const arr = D.text[n] && D.text[n][pid]; if (!arr) return ''; const x = arr.find(a => a[0] === v); return x ? x[1] : ''; }

async function boot() {
  try {
    D.edition = 'app'; KEY = 'm365-app';
    await load();
    applyView();
    const [st, guides] = await Promise.all([getJSON('data/structure.json'), getJSON('data/guides.json')]);
    D.st = st; D.guides = guides;
    let g = 0;
    for (const vol of st.volumes) vol.days.forEach((d, i) => { d.vol = vol.id; d.i = i; D.days[d.id] = d; D.order[d.id] = g++; d.p.forEach(p => { D.books[p.book] = p.abbr; p.ref = RNG(p.ref); }); d.x = []; d.pp = d.p; });
    D.extra = await getJSON('data/extra.json').catch(() => ({}));
    for (const id in D.extra) { const d = D.days[id]; if (!d) continue; d.x = D.extra[id]; d.pp = d.p.concat(d.x); }
    st.topics.forEach((t, k) => { t.n = k + 1; D.topics[t.id] = t; t.subs.forEach((s, j) => { D.subs[s.id] = s; s.tp = t.id; s.j = j; }); });
    for (const vol of st.volumes) vol.days.forEach(d => { const s = D.subs[d.s]; (s.days = s.days || []).push(d.id); d.p.forEach(p => { ABBR_CODE[p.abbr] = p.code; }); });
    for (const id in D.extra) D.extra[id].forEach(x => { ABBR_CODE[x.abbr] = x.code; });
    D.memos = (await idbGet('pm')) || [];
    D.memos.forEach((m, k) => { m.no = k + 1; m.builtin = true; });
    indexMemos();
    await loadVol(ST.set.vol);
    D.tseq = []; D.tidx = {}; D.st.topics.forEach(tp => tp.subs.forEach(sb => sb.days.forEach(id => { D.tidx[id] = D.tseq.length; D.tseq.push(id); }))); // 주제별 읽기 순서
    D.krvOK = await fetch('data/krv-v1.json', { method: 'HEAD' }).then(r => r.ok).catch(() => false);
    window.addEventListener('hashchange', route);
    document.addEventListener('selectionchange', onSelChange);
    document.addEventListener('pointerdown', onDocDown, true);
    backGuard();
    let hiddenAt = 0; // 홈 화면 앱은 닫아도 뒤에 살아 있다가 다시 열리므로, 5분 넘게 떠나 있었으면 시작 화면을 다시 보여 줌
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { hiddenAt = Date.now(); return; }
      if (hiddenAt && Date.now() - hiddenAt > 5 * 60e3 && ST.set.setupDone && ST.set.intro && $('#introbox').hidden && !/[?&]n=1/.test(location.hash)) showIntro();
    });
    const fromNotify = /[?&]n=1/.test(location.hash);
    route();
    if ((!ST.set.setupDone || ST.set.intro) && !fromNotify && !introRecent()) showIntro(); // 처음 열 때도 로마서 화면부터
    packCheck(); setTimeout(backupNag, 2500);
    newYearCheck();
    if (ST.set.setupDone && ST.seenVer !== VERSION) { const n = Object.values(D.extra).reduce((a, x) => a + x.length, 0); if (ST.seenVer && n) setTimeout(() => toast(`새로 더해진 말씀이 있습니다 · 더 깊고 넓게 읽기 ${n}곳`, 4200), 1500); ST.seenVer = VERSION; save(); }
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  } catch (e) {
    $('#app').innerHTML = `<div class="body"><div class="empty">앱 자료를 불러오지 못했습니다.<br>인터넷에 연결된 상태에서 한 번 다시 열어 주세요.<br><small>${esc(e.message)}</small></div></div>`;
  }
}

function applyView() {
  const r = document.documentElement.style;
  r.setProperty('--fs', ST.set.fs + 'px'); r.setProperty('--lh', ST.set.lh);
  r.setProperty('--ui', (UI_STEPS[ST.set.ui] || UI_STEPS[1])[2]); r.setProperty('--padx', (PADS[ST.set.pad] || PADS[1])[2] + 'px');
  document.body.dataset.font = ST.set.font; document.body.dataset.theme = ST.set.theme;
  const mt = $('meta[name=theme-color]'); if (mt) mt.content = THEME_COLOR[ST.set.theme] || THEME_COLOR.calm;
}

/* ---------- 날짜 ---------- */
const pad = n => String(n).padStart(2, '0');
function todayInfo() {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate(), w: now.getDay(), key: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` };
}
function todayDayId(vol = ST.set.vol) {
  const t = todayInfo();
  if (t.m === 2 && t.d === 29) {
    if (!ST.leap || ST.leap.date !== t.key || ST.leap.vol !== vol) {
      const days = D.st.volumes[vol - 1].days;
      const c = id => ST.cnt[id] || 0;
      const min = Math.min(...days.map(d => c(d.id)));
      const pool = days.filter(d => c(d.id) === min);
      ST.leap = { date: t.key, vol, day: pool[Math.floor(Math.random() * pool.length)].id }; save();
    }
    return ST.leap.day;
  }
  return `v${vol}-${pad(t.m)}${pad(t.d)}`;
}
const dlabel = d => `${d.m}월 ${d.d}일`;
const vlabel = n => `제${n}권`;

/* ---------- 진도 ---------- */
function isRead(id) { const d = D.days[id]; return !!ST.prog[d.vol].read[id]; }
function setRead(id, on) {
  const d = D.days[id], P = ST.prog[d.vol];
  if (on && !P.read[id]) { P.read[id] = Date.now(); ST.cnt[id] = (ST.cnt[id] || 0) + 1; }
  if (!on && P.read[id]) { delete P.read[id]; ST.cnt[id] = Math.max(0, (ST.cnt[id] || 1) - 1); }
  if (Object.keys(P.read).length >= 365) {
    P.hist.push({ done: Date.now() }); P.read = {};
    toast(`${vlabel(d.vol)} ${P.hist.length}독을 마쳤습니다. 감사합니다.`);
  }
  save();
}
function roundLabel(n) {
  const P = ST.prog[n], c = Object.keys(P.read).length, h = P.hist.length;
  if (!h && !c) return '0독째 · 0%';
  return `${h + 1}독째 · ${Math.round(c / 365 * 100)}%`;
}

/* ---------- 공통 화면 조각 ---------- */
const LOGO = `<svg class="logo" viewBox="0 0 200 172" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M100 64 Q92 48 72 48 H50 Q38 48 38 60 V128 Q38 140 50 140 H78 Q92 140 100 150"/><path d="M100 64 Q108 48 128 48 H150 Q162 48 162 60 V128 Q162 140 150 140 H122 Q108 140 100 150"/><path d="M100 64 V160"/><path d="M100 30 V14M83 34 L75 22M117 34 L125 22"/></g></svg>`;
// 위 막대: 왼쪽 ←(뒤로), 가운데 제목. 아래 메뉴가 없는 화면만 오른쪽에 가가·돋보기
function bar(title, left = 'back', opts = {}) {
  const l = left === 'back' ? `<button data-act="back" aria-label="뒤로">${icon('back')}</button>` : `<span class="sp"></span>`;
  const r = opts.findOnly ? `<span class="tools"><button data-go="#/find" aria-label="찾기">${icon('search')}</button></span>` : !opts.tools ? '<span class="sp"></span>' : `<span class="tools"><button data-act="ui" class="uib" aria-label="화면 글자 크기"><span class="a">가</span><span class="b">가</span></button>${opts.find === false ? '' : `<button data-go="#/find" aria-label="찾기">${icon('search')}</button>`}</span>`;
  const t = opts.logo ? `<b class="ttl">${LOGO}<span>${esc(title)}</span></b>` : `<b class="ttl gt">${opts.ic ? icon(opts.ic) : ''}<span>${esc(title)}</span></b>`;
  return `<div class="bar">${l}${t}${r}</div>`;
}
// 아래 메뉴: 화면마다 알맞게 (아이콘만)
//  홈(서랍): 메모 · 모아 보기 · 찾기 · 가가 · 설정 / 메모: 홈 · 모아 보기 · 정렬 · 가가 · 설정 / 모아 보기: 홈 · 메모 · 정렬 · 가가 · 설정 / 그 밖: 홈 · 메모 · 모아 보기 · 가가 · 설정
function nav(on, opts = {}) {
  const ctx = opts.ctx || (on === 'home' ? 'home' : 'other');
  const B = (k, ic, t, h) => `<button class="${k === on ? 'on' : ''}" data-nav="${h}" aria-label="${t}">${ic}</button>`;
  const home = B('home', icon('home'), '홈', '#/'), memo = B('memo', `<span class="mgo">›</span>${icon('memos')}`, '메모로', '#/memos'), col = B('col', icon('col'), '모아 보기', '#/col/hl'), find = B('find', icon('search'), '찾기', '#/find');
  const sort = `<button data-act="sort" aria-label="정렬">${icon('sort')}</button>`;
  const ui = `<button data-act="ui" class="navui" aria-label="화면 글자 크기"><span class="gg"><span class="a">가</span><span class="b">가</span></span></button>`;
  const set = `<button class="${on === 'set' ? 'on' : ''} ${backupDue() ? 'dot' : ''}" data-nav="#/set" aria-label="설정">${icon('gear')}</button>`;
  const it = (ctx === 'home' ? [memo, col, ui, set] : ctx === 'memo' ? [home, opts.sort ? sort : '', col, ui, set] : ctx === 'col' ? [home, memo, sort, ui, set] : [home, memo, col, ui, set]).filter(Boolean);
  return `<nav class="nav ic n${it.length}">${it.join('')}</nav>`;
}
function sortPicker(btn) { // 정렬 고르기 (메모: 구절·날짜 / 모아 보기: 본문·최근)
  const p = $('#uipop'), memo = /^#\/memos/.test(location.hash);
  if (!p.hidden) { closeOverlay(); return; }
  const cur = memo ? (ST.set.msort || 'verse') : colSort;
  const opts = memo ? [['verse', '구절 순서'], ['date', '최신 순']] : [['text', '본문 순서'], ['recent', '최근 순']];
  p.classList.add('fromnav');
  p.innerHTML = `<div class="lab">정렬</div>${opts.map(([v, t]) => `<button class="srow ${v === cur ? 'on' : ''}" data-sv="${v}">${t}</button>`).join('')}`;
  openOverlay(p);
  $$('[data-sv]', p).forEach(b => b.onclick = () => { if (memo) { ST.set.msort = b.dataset.sv; save(); } else colSort = b.dataset.sv; closeOverlay(); setTimeout(route, 30); });
}
function backupDue() {
  const has = ST.marks.length || ST.bm.length || UM.length || Object.values(ST.prog).some(p => Object.keys(p.read).length);
  return !!has && Date.now() - (ST.lastBackup || ST.firstUse || Date.now()) > 30 * 864e5;
}
function setVolClass(n) { document.body.classList.remove('v1', 'v2', 'v3'); document.body.classList.add('v' + n); }
let toastT, RETURN_AT = null, SLIDE = '';
function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.hidden = false; t.onclick = null; t.classList.remove('go'); clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms); }
function toastGo(msg, href, ms = 4200) { toast(msg, ms); const t = $('#toast'); t.classList.add('go'); t.onclick = () => { t.hidden = true; go(href); }; }
function go(h, replace) {
  if (OV) { const o = OV; OV = null; o.el.hidden = true; if (o.onClose) o.onClose(); if (history.state && history.state.ov) { location.replace(h); return; } } // 판을 닫으며 이동: 뒤로 가기와 엉키지 않게
  if (replace) location.replace(h); else location.hash = h;
}
// 바깥 링크는 a 태그로 열어야 휴대폰에서 잘 열림
function openExt(url) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
const NAV_VIEWS = /^#\/(memos|col|set|find)(\/|\?|$)/;

document.addEventListener('click', e => {
  const b = e.target.closest('[data-go],[data-act],[data-nav]');
  if (!b) return;
  if (b.dataset.nav) { if (location.hash === b.dataset.nav) return; go(b.dataset.nav, NAV_VIEWS.test(location.hash)); return; } // 아래 메뉴끼리는 바꿔 끼우기 → ←는 원래 자리로
  if (b.dataset.go) { go(b.dataset.go); return; }
  const a = b.dataset.act;
  if (a === 'back') goBack();
  if (a === 'ui') uiPicker(b);
  if (a === 'sort') sortPicker(b);
});
function goBack() { if (history.state && history.state.base) go('#/'); else history.back(); }
function uiPicker(btn) {
  const p = $('#uipop');
  if (!p.hidden) { closeOverlay(); return; }
  p.classList.toggle('fromnav', btn.classList.contains('navui'));
  p.innerHTML = `<div class="lab">화면 글자 (날짜·메뉴·안내)</div><div class="row">${UI_STEPS.map((x, i) => `<button class="${i === ST.set.ui ? 'on' : ''}" data-ui="${i}" style="font-size:${12 + i * 2.5}px" aria-label="${x[1]}">가</button>`).join('')}</div><div class="lab">본문 글자는 책 속에서 화면 가운데를 눌러 바꿉니다.</div>`;
  openOverlay(p);
  $$('[data-ui]', p).forEach(x => x.onclick = () => { ST.set.ui = +x.dataset.ui; save(); applyView(); $$('[data-ui]', p).forEach(y => y.classList.toggle('on', y === x)); });
}

/* ---------- 뒤로 가기: 한 단계씩, 판은 먼저 닫고, 홈에서는 두 번 눌러야 닫힘 ---------- */
let lastBack = 0, OV = null, OV_SKIP = 0, LEAVE_GUARD = null;
function openOverlay(el, onClose) { // 판(메뉴·선택 판)을 열 때 뒤로 가기 한 칸을 끼워 둠
  if (OV && OV.el !== el) closeOverlay(true);
  el.hidden = false; OV = { el, onClose };
  if (!(history.state && history.state.ov)) history.pushState({ ov: 1 }, '', location.href);
}
function closeOverlay(silent) {
  if (!OV) return; const o = OV; OV = null;
  o.el.hidden = true; if (o.onClose) o.onClose();
  if (history.state && history.state.ov) { OV_SKIP++; history.back(); }
}
function backGuard() {
  history.replaceState({ base: 1 }, '', location.href);
  history.pushState({ top: 1 }, '', location.href);
  window.addEventListener('popstate', e => {
    if (OV_SKIP) { OV_SKIP--; return; }
    if (OV) { const o = OV; OV = null; o.el.hidden = true; if (o.onClose) o.onClose(); return; }
    if (!$('#introbox').hidden) { hideIntro(); history.pushState({ top: 1 }, '', location.href); return; }
    if (!$('#modal').hidden) { $('#modal').hidden = true; history.pushState({ top: 1 }, '', location.href); return; }
    if (!e.state || !e.state.base) return;
    if (location.hash && !/^#\/?$/.test(location.hash) && !/^#\/\?/.test(location.hash)) { history.pushState({ top: 1 }, '', '#/'); route(); return; }
    if (Date.now() - lastBack < 2000) { history.back(); return; }
    lastBack = Date.now(); toast('뒤로 가기를 한 번 더 누르면 앱이 닫힙니다.', 1900);
    history.pushState({ top: 1 }, '', location.href);
  });
}

/* ---------- 시작 화면 (인트로) ---------- */
function introRecent() { try { return Date.now() - (+sessionStorage.getItem('m365-intro') || 0) < 5 * 60e3; } catch (e) { return false; } }
function showIntro() {
  const b = $('#introbox');
  b.innerHTML = `<div class="in-wrap"><div class="in-logo" id="inlogo"><svg id="inbook"></svg><div class="in-365" id="in365">365</div><div class="in-name" id="inname">${'복음 묵상'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div></div>
    <div class="in-verse" id="inv">${INTRO.map(l => `<span class="ln">${esc(l)}</span>`).join('<br>')}</div><div class="in-ref">로마서 16:25~27</div>
    <div class="in-act"><button class="in-go" id="ingo">들어가기</button><label class="in-chk"><input type="checkbox" id="inchk" ${ST.set.intro ? 'checked' : ''}> 시작 화면 항상 보기</label></div></div>`;
  b.insertAdjacentHTML('afterbegin', '<div class="in-splash"><img src="icons/icon-192.png" alt=""></div>');
  b.classList.remove('go'); b.hidden = false; setTimeout(() => b.classList.add('go'), 380); // 휴대폰 첫 화면(아이콘)과 똑같이 시작 → 아이콘이 스러지며 글이 떠오름
  const fit = () => {
    const v = $('#inv'); if (!v) return; const w = Math.min(b.clientWidth - 28, 560); let f = 18; v.style.fontSize = f + 'px'; while (f > 9 && v.scrollWidth > w) { f -= .5; v.style.fontSize = f + 'px'; }
    // 책 폭 = “예수 그리스도로 말미암아” 줄 폭, 365 폭 = “복”과 “상”의 가운데 사이
    const lw = $$('.ln', v)[7].getBoundingClientRect().width, cs = $$('#inname span'), c0 = cs[0].getBoundingClientRect(), c1 = cs[cs.length - 1].getBoundingClientRect();
    const span = (c1.left + c1.width / 2) - (c0.left + c0.width / 2), n = $('#in365');
    n.style.fontSize = '100px'; const r = span / n.getBoundingClientRect().width; n.style.fontSize = Math.max(24, 100 * r) + 'px';
    const W = Math.round(lw), lg = $('#inlogo'); lg.style.width = W + 'px';
    const H = lg.clientHeight - 30, m = W / 2, sv = $('#inbook');
    sv.setAttribute('viewBox', `0 0 ${W} ${H + 46}`); sv.setAttribute('width', W); sv.setAttribute('height', H + 46);
    const y0 = 28, y1 = 28 + H - 14;
    sv.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M${m} ${y0 + 12} Q${m - 9} ${y0} ${m - 34} ${y0} H10 Q2 ${y0} 2 ${y0 + 8} V${y1 - 8} Q2 ${y1} 10 ${y1} H${m - 30} Q${m - 10} ${y1} ${m} ${y1 + 12} Q${m + 10} ${y1} ${m + 30} ${y1} H${W - 10} Q${W - 2} ${y1} ${W - 2} ${y1 - 8} V${y0 + 8} Q${W - 2} ${y0} ${W - 10} ${y0} H${m + 34} Q${m + 9} ${y0} ${m} ${y0 + 12}"/><path d="M${m} ${y0 - 8} V${y0 - 22}M${m - 14} ${y0 - 6} L${m - 22} ${y0 - 18}M${m + 14} ${y0 - 6} L${m + 22} ${y0 - 18}"/></g>`;
  };
  document.fonts.ready.then(fit); fit();
  $('#ingo').onclick = hideIntro;
  $('#inchk').onchange = e => { ST.set.intro = e.target.checked; save(); };
}
function hideIntro() { const b = $('#introbox'); b.hidden = true; b.innerHTML = ''; setTimeout(backupNag, 800); try { sessionStorage.setItem('m365-intro', Date.now()); } catch (e) {} }

/* ---------- 라우터 ---------- */
let pager = null;
function route() {
  if (LEAVE_GUARD && LEAVE_GUARD()) return; // 저장 안 한 메모가 있으면 묻기
  LEAVE_GUARD = null;
  if (OV) { const o = OV; OV = null; o.el.hidden = true; if (o.onClose) o.onClose(); }
  hideSheet();
  if (pager) { pager.destroy(); pager = null; }
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const seg = path.split('/'), q0 = new URLSearchParams(qs || '');
  if (seg[0] !== 'read' && !(seg[0] === 'edit' && seg[1] === 'new' && q0.get('at'))) clearDual(); // 홈·목차·메모로 나가면 대역 해제 (읽다가 메모 쓰러 갈 때는 유지)
  const q = new URLSearchParams(qs || '');
  window.scrollTo(0, 0);
  if (!ST.set.setupDone && seg[0] !== 'setup' && seg[0] !== 'help' && seg[0] !== 'tour') return go('#/setup', true);
  switch (seg[0]) {
    case 'setup': return vSetup();
    case 'today': return go(`#/read/${todayDayId()}`, true);
    case 'read': return vRead(seg[1], q.get('at'), q.get('m'), q.get('x'), q.get('t') === '1');
    case 'vol': return vVol(+seg[1] || ST.set.vol);
    case 'toc': return vToc(seg[1] === 'topic' ? 'topic' : 'date', +q.get('v') || 0, true);
    case 'col': return seg[1] === 'memo' ? go('#/memos', true) : vCol(seg[1] || 'hl');
    case 'memos': return vMemoList();
    case 'memo': return vMemo(seg[1]);
    case 'edit': return vEdit(seg[1], q.get('at'));
    case 'find': return vFind(q.get('q') || '');
    case 'set': return vSet();
    case 'help': return vHelp();
    case 'tour': return vTour();
    default: return vHome();
  }
}

/* ---------- 홈: [일자별][주제별] / [오늘의 말씀] ---------- */
function versesOf(day) { // [pid, v, text] 목록 (그날 본문 전체)
  const vv = [];
  day.p.forEach((p, j) => { const pid = `${day.id}-p${j + 1}`; (D.text[day.vol][pid] || []).forEach(x => vv.push([pid, x[0], x[1]])); });
  return vv;
}
function snipHTML(vv) { return vv.map(x => `<span class="n">${x[1]}</span>${esc(x[2])}`).join(' '); }
function fullRef(vv, day) { // 줄임 없이: “마태복음 2:16~18” (본문이 두 곳 이상이면 “외 n”)
  if (!vv.length) return '';
  const pidOf = x => +x[0].split('-p')[1] - 1, a = vv[0], b = vv[vv.length - 1], pa = day.pp[pidOf(a)], pb = day.pp[pidOf(b)];
  if (pa === pb) return `${pa.book} ${pa.ch}:${a[1]}${b[1] !== a[1] ? '~' + b[1] : ''}`;
  return `${pa.book} ${pa.ch}:${a[1]}~${pa.ve} 외 ${pidOf(b) - pidOf(a)}`;
}
// 카드: 주제 — 선 — 단원 (고정) / 본문은 칸에 들어가는 만큼 / 오른쪽 아래 구절 표시 · 책 속으로
function cardHTML(day, vv, href, legend) {
  const tp = D.topics[day.t], sb = D.subs[day.s];
  return `<div class="hcard ${legend ? 'lg' : ''}">${legend ? `<span class="legend">${legend}</span>` : ''}
    <button class="hcbody" data-go="${href}"><div class="ctp">${esc(tp.title)}</div><div class="cln"></div><div class="csb">${esc(sb.title)}</div>
    <p class="snip big">${snipHTML(vv)}</p><div class="cfoot"><div class="refr">${esc(fullRef(vv, day))}</div><span class="more">펼쳐 읽기 ›</span></div></button></div>`;
}
async function vHome() {
  const t = todayInfo(), id = todayDayId(), day = D.days[id];
  await loadVol(day.vol);
  setVolClass(day.vol);
  const tab = ['date', 'topic'].includes(ST.set.home) ? ST.set.home : 'today';
  let main = '';
  if (tab === 'today') {
    main = `<div class="daterow"><span class="s">${t.y}년</span><span class="d">${t.m}월 ${t.d}일</span><span class="s">${WD[t.w]}요일</span></div>
      ${cardHTML(day, versesOf(day), `#/read/${id}`)}`;
  } else {
    const T = tab === 'topic', r = T ? ST.recentT : ST.recentD, ok = r && D.days[r.day];
    const d2 = ok ? D.days[r.day] : day; await loadVol(d2.vol);
    const all = versesOf(d2), k = ok ? Math.max(0, all.findIndex(x => x[0] === r.pid && x[1] === r.v)) : 0, vv = all.slice(k);
    main = cardHTML(d2, vv, `#/read/${d2.id}?at=${vv[0][0]}:${vv[0][1]}${T ? '&t=1' : ''}`, '최근 읽은 곳');
  }
  const vols = `<div class="vols">${[1, 2, 3].map(n => `<button class="volc" style="--c:var(--v${n})" data-go="#/vol/${n}"><b>${vlabel(n)}</b><div class="lab">${roundLabel(n)}</div></button>`).join('')}</div>`;
  $('#app').innerHTML = `<div class="screen homes">${bar(APPNAME, '', { logo: true, findOnly: true })}
    <div class="body home">
      <div class="htabs" id="ht">${[['date', '일자별'], ['topic', '주제별']].map(([v, t]) => `<button data-v="${v}" class="${tab === v ? 'on' : ''}">${tab === v ? `<span class="tgrp"><span>${t}</span><i class="tsep"></i><span class="ttoc" data-toc="${v}">${icon('toc')}<span class="tt">목차</span></span></span>` : t}</button>`).join('')}<button data-v="today" class="wide ${tab === 'today' ? 'on' : ''}">오늘의 말씀</button></div>
      ${main}
    </div>
    <div class="hdrawer" id="hd"><button class="handle" id="hh" aria-label="진도와 메뉴 펼치기"><svg class="chev" viewBox="0 0 24 12"><path d="M5 9l7-6 7 6"/></svg><i></i></button><div class="hdin">${vols}${nav('home', { ctx: 'home' })}</div></div></div>`;
  $('#ht').onclick = e => { const tc = e.target.closest('[data-toc]'); if (tc) { go(`#/toc/${tc.dataset.toc}`); return; } const b = e.target.closest('button'); if (!b || b.dataset.v === tab) return; ST.set.home = b.dataset.v; save(); vHome(); };
  const hd = $('#hd'), tog = open => { hd.classList.toggle('open', open); $('#hh').setAttribute('aria-label', open ? '접기' : '진도와 메뉴 펼치기'); };
  $('#hh').onclick = () => tog(!hd.classList.contains('open'));
  let sy = null; $('#hh').addEventListener('touchstart', e => { sy = e.touches[0].clientY; }, { passive: true });
  $('#hh').addEventListener('touchend', e => { if (sy == null) return; const dy = e.changedTouches[0].clientY - sy; sy = null; if (Math.abs(dy) > 25) { e.preventDefault(); tog(dy < 0); } });
}
function backupNag() { // 30일마다 한 번: 백업해 둘까요?
  if (!$('#introbox').hidden || !$('#modal').hidden) return;
  if (!ST.set.setupDone || !backupDue() || (ST.bkAsk && Date.now() - ST.bkAsk < 30 * 864e5)) return;
  ST.bkAsk = Date.now(); save();
  const m = $('#modal');
  m.innerHTML = `<div class="card"><b>기록을 백업해 둘까요?</b><div class="small">하이라이트·메모·진도는 이 휴대폰 안에만 있습니다. 마지막 백업 뒤 한 달이 지났습니다.</div><div class="row" style="justify-content:center"><button class="btn" id="bkl">나중에</button><button class="btn dark" id="bkn">지금 백업</button></div></div>`;
  m.hidden = false;
  $('#bkl').onclick = () => { m.hidden = true; };
  $('#bkn').onclick = () => { m.hidden = true; go('#/set?bk=1'); };
}

/* ---------- 목차: 권 탭 + 접힌 목록 (들어올 때마다 모두 접힘) ---------- */
let treeOpen = {}, monOpen = {};
const fx = open => `<span class="fx">${icon(open ? 'collapse' : 'expand')}</span>`;
function topicTreeHTML(vol) {
  const tps = D.st.topics.filter(t => t.vol === vol), allOpen = tps.every(t => treeOpen[t.id]);
  let h = `<div class="treehead"><span class="lab">${vlabel(vol)} · 주제 ${tps.length}</span><button class="xall" id="xall" aria-label="${allOpen ? '모두 접기' : '모두 펼치기'}">${icon(allOpen ? 'collapse' : 'expand')}</button></div><div class="card tree">`;
  for (const tp of tps) {
    h += `<button class="tnode tp ${treeOpen[tp.id] ? 'open' : ''}" data-tg="${tp.id}" style="--c:var(--v${tp.vol})"><span class="tx"><small>주제 ${tp.n}</small>${esc(tp.title)}</span><span class="cnt">${tp.subs.length}${fx(treeOpen[tp.id])}</span></button>`;
    if (!treeOpen[tp.id]) continue;
    for (const s of tp.subs) {
      h += `<button class="tnode sb ${treeOpen[s.id] ? 'open' : ''}" data-tg="${s.id}"><span class="tx">${esc(s.title)}</span><span class="cnt">${s.days.length}${fx(treeOpen[s.id])}</span></button>`;
      if (!treeOpen[s.id]) continue;
      h += `<div class="tdays">${s.days.map(id => { const d = D.days[id]; return `<button data-go="#/read/${id}?t=1"><span>${esc(d.p[0].ref)}${d.p.length > 1 ? ` 외 ${d.p.length - 1}` : ''}</span><small>${dlabel(d)}</small></button>`; }).join('')}</div>`;
    }
  }
  return h + '</div>';
}
function dateTocHTML(vol) {
  const days = D.st.volumes[vol - 1].days, tid = todayDayId(vol);
  const ms = []; days.forEach(d => { (ms[d.m] = ms[d.m] || []).push(d); });
  const allOpen = ms.every((a, m) => !a || monOpen[vol + ':' + m]);
  let h = `<div class="treehead"><span class="lab">${vlabel(vol)} · 365일</span><button class="xall" id="xall" aria-label="${allOpen ? '모두 접기' : '모두 펼치기'}">${icon(allOpen ? 'collapse' : 'expand')}</button></div><div class="card tree">`;
  ms.forEach((arr, m) => {
    if (!arr) return; const k = vol + ':' + m, open = monOpen[k];
    h += `<button class="tnode tp ${open ? 'open' : ''}" data-mo="${k}" style="--c:var(--v${vol})"><span class="tx">${m}월</span><span class="cnt">${arr.length}${fx(open)}</span></button>`;
    if (open) h += `<div class="tdays dd">${arr.map(d => `<button class="${d.id === tid ? 'today' : ''}" data-go="#/read/${d.id}"><b>${dlabel(d)}</b><span>${esc(d.p[0].ref)}${d.p.length > 1 ? ` 외 ${d.p.length - 1}` : ''}</span></button>`).join('')}</div>`;
  });
  return h + '</div>';
}
async function vToc(kind, vol, fresh) {
  if (fresh) { treeOpen = {}; monOpen = {}; }
  vol = vol || ST.set.vol;
  await loadVol(vol);
  const y = fresh ? 0 : window.scrollY;
  $('#app').innerHTML = `<div class="screen">${bar(kind === 'date' ? '일자별 목차' : '주제별 목차', 'back', { findOnly: true, ic: 'toc' })}<div class="body">
    <div class="seg" id="tv">${[1, 2, 3].map(n => `<button data-v="${n}" class="${n === vol ? 'on' : ''}">${vlabel(n)}</button>`).join('')}</div>
    ${kind === 'date' ? dateTocHTML(vol) : topicTreeHTML(vol)}</div>${nav('')}</div>`;
  window.scrollTo(0, y);
  const redraw = () => vToc(kind, vol, false);
  $('#tv').onclick = e => { const b = e.target.closest('button'); if (b && +b.dataset.v !== vol) { treeOpen = {}; monOpen = {}; vToc(kind, +b.dataset.v, false).then(() => window.scrollTo(0, 0)); } };
  if (kind === 'topic') {
    $('#xall').onclick = () => { const tps = D.st.topics.filter(t => t.vol === vol), all = tps.every(t => treeOpen[t.id]); tps.forEach(t => { treeOpen[t.id] = !all; if (all) t.subs.forEach(s => { treeOpen[s.id] = false; }); }); redraw(); };
    $$('[data-tg]').forEach(b => b.onclick = () => { treeOpen[b.dataset.tg] = !treeOpen[b.dataset.tg]; redraw(); });
  } else {
    $('#xall').onclick = () => { const ms = [...new Set(D.st.volumes[vol - 1].days.map(d => d.m))], all = ms.every(m => monOpen[vol + ':' + m]); ms.forEach(m => { monOpen[vol + ':' + m] = !all; }); redraw(); };
    $$('[data-mo]').forEach(b => b.onclick = () => { monOpen[b.dataset.mo] = !monOpen[b.dataset.mo]; redraw(); });
  }
}

/* ---------- 처음 설정 · 지침 카드 ---------- */
const AI_CHOICES = [['claude', 'Claude'], ['chatgpt', 'ChatGPT'], ['gemini', 'Gemini'], ['none', '활용 안 함']];
const AI_HOME = { claude: 'https://claude.ai/new', chatgpt: 'https://chatgpt.com/', gemini: 'https://gemini.google.com/app' };
const GUIDE_ORDER = [['bcs', 'AI로 배경·문맥 살피기 지침'], ['qa', 'AI와 간단 Q&A 지침'], ['tc', 'AI로 번역 비교 지침']];
const GUIDE_PRE = '아래는 내가 성경 묵상을 위해 직접 정한 작업 지침이야. 기억해 두고, 내가 요청할 때 이대로 답해 줘.\n\n';
const PASTE_TIP = '복사했습니다. 열린 AI 창의 입력칸을 길게 눌러 붙여넣기 한 뒤 보내세요.';
function guideText(k) { return String((ST.guideEdit || {})[k] || D.guides[k] || '').replace(/\*\*/g, ''); }
function guideCards() {
  const ge = ST.guideEdit || {}, an = AI[ST.set.ai] ? AI[ST.set.ai].name : '';
  return GUIDE_ORDER.filter(([k]) => D.guides[k]).map(([k, t]) => {
    const prev = guideText(k).split('\n').map(x => x.replace(/^#+\s*/, '').trim()).filter(Boolean).slice(1, 4).join(' ');
    const sv = ST.guideSaved[k];
    return `<div class="gcard"><div class="gh"><b>${t}</b>${ge[k] ? '<span class="gbadge">수정본</span>' : ''}</div>
      <div class="gprev">${esc(prev)}</div>
      <div class="gbtns"><button class="gb" data-gv="${k}">전문 보기</button><button class="gb" data-ge="${k}">고치기</button><button class="gb dark" data-gs="${k}">AI에 저장</button></div>
      <div class="gfoot"><span>${sv ? `마지막 저장 ${fmtDate(typeof sv === 'number' ? sv : sv.t)}${sv.ai && AI[sv.ai] ? ' · ' + AI[sv.ai].name : ''}` : '아직 저장하지 않음'}</span>${ge[k] ? `<button data-gr="${k}">원래대로</button>` : ''}</div></div>`;
  }).join('');
}
function bindGuideCards(redraw) {
  $$('[data-gs]').forEach(b => b.onclick = () => { saveGuide(b.dataset.gs); redraw && setTimeout(redraw, 300); });
  $$('[data-gv]').forEach(b => b.onclick = () => {
    const k = b.dataset.gv, m = $('#modal');
    m.innerHTML = `<div class="card gview"><b>${GUIDE_ORDER.find(x => x[0] === k)[1]}</b><div class="gfull">${esc(guideText(k))}</div><button class="btn dark" id="gvc">닫기</button></div>`;
    m.hidden = false; $('#gvc').onclick = () => { m.hidden = true; };
  });
  $$('[data-ge]').forEach(b => b.onclick = () => {
    const k = b.dataset.ge, m = $('#modal');
    m.innerHTML = `<div class="card gview"><b>${GUIDE_ORDER.find(x => x[0] === k)[1]} 고치기</b><textarea class="field gedit" id="get">${esc(guideText(k))}</textarea><div class="row" style="justify-content:center"><button class="btn" id="gec">취소</button><button class="btn dark" id="ges">저장</button></div><div class="lab">고친 뒤에는 “AI에 저장”을 다시 눌러야 AI에 반영됩니다.</div></div>`;
    m.hidden = false;
    $('#gec').onclick = () => { m.hidden = true; };
    $('#ges').onclick = () => { const v = $('#get').value.trim(); ST.guideEdit = ST.guideEdit || {}; if (v && v !== String(D.guides[k]).replace(/\*\*/g, '').trim()) ST.guideEdit[k] = v; else delete ST.guideEdit[k]; save(); m.hidden = true; toast('지침을 고쳤습니다.'); redraw && redraw(); };
  });
  $$('[data-gr]').forEach(b => b.onclick = () => { if (!confirm('고친 지침을 지우고 원래 지침으로 되돌릴까요?')) return; delete ST.guideEdit[b.dataset.gr]; save(); redraw && redraw(); });
}
function saveGuide(k) {
  copy(GUIDE_PRE + guideText(k));
  ST.guideSaved[k] = { t: Date.now(), ai: ST.set.ai }; save();
  aiGo(AI[ST.set.ai] ? AI[ST.set.ai].name : 'AI', AI_HOME[ST.set.ai] || AI_HOME.claude, PASTE_TIP + ' 지침을 기억해 두라는 말이 함께 들어 있습니다.');
}
function aiGo(name, url, tip) { // 앱 화면을 살짝 흐리며 안내 → AI 창으로
  let f = $('#aifade'); if (!f) { f = document.createElement('div'); f.id = 'aifade'; f.className = 'aifade'; document.body.appendChild(f); }
  const paste = tip !== '보내기만 누르면 됩니다.';
  f.innerHTML = `<div><b>${paste ? '붙여넣으세요' : '보내기만 누르세요'}</b><small>${esc(name)}(으)로 넘어갑니다</small></div>`; f.classList.remove('out'); f.hidden = false;
  setTimeout(() => openExt(url), 800);
  setTimeout(() => { f.classList.add('out'); setTimeout(() => { f.hidden = true; }, 400); }, 3200);
}
function vSetup() {
  const s = ST.set;
  const step = +(new URLSearchParams(location.hash.split('?')[1] || '').get('s') || 1);
  const segs = (k, arr) => `<div class="seg" data-k="${k}">${arr.map(([v, t]) => `<button data-v="${v}" class="${String(s[k]) === String(v) ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  const dots = `<div class="stepdots">${[1, 2, 3].map(n => `<i class="${n <= step ? 'on' : ''}"></i>`).join('')}</div>`;
  let body = '';
  if (step === 1) body = `
    <p class="sdesc">처음 한 번만 정합니다. 나중에 설정에서 언제든 바꿀 수 있습니다.</p>
    <h3>올해 읽을 권</h3>${segs('vol', [[1, '제1권'], [2, '제2권'], [3, '제3권']])}
    <h3>연결할 AI</h3>${segs('ai', AI_CHOICES)}<p class="sdesc">본문의 배경·문맥 살피기, 간단한 질문과 답, 번역 비교를 AI에게 요청할 때 연결할 AI를 골라 주세요. “활용 안 함”을 고르면 AI 활용 아이콘이 모두 숨겨집니다. 연결할 AI는 나중에 <span class="pathband">설정 › AI 활용</span>에서 언제든 바꿀 수 있습니다.</p>
    <h3>읽는 방식</h3>${segs('mode', [['page', '쪽 넘기기'], ['scroll', '스크롤']])}
    <h3>본문 글자 크기</h3><input type="range" min="15" max="28" step="1" value="${s.fs}" id="fs">
    <div class="preview">태초에 하나님이 천지를 창조하시니라 땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라</div>
    <p class="sdesc">글꼴, 여백, 배경색은 책 속에서 화면 가운데를 눌러 바꿀 수 있습니다.</p>`;
  if (step === 2) body = `
    <p class="sdesc">이 앱에는 AI를 다음 세 가지 용도로 활용할 수 있는 아이콘이 있습니다.</p>
    <div class="card intro"><div class="ih">${compassSVG()}<b>AI로 배경·문맥 살피기</b></div><p class="sdesc">본문을 관련 배경과 문맥을 고려해 읽고 싶을 때 눌러 보세요.</p></div>
    <div class="card intro"><div class="ih">${icon('ask')}<b>AI와 간단 Q&amp;A</b></div><p class="sdesc">본문 구절 전체나 일부에 대한 궁금증을 간단한 답으로 풀고 싶을 때 눌러 보세요.</p></div>
    <div class="card intro"><div class="ih">${icon('gem')}<b>AI로 번역 비교</b></div><p class="sdesc">본문 구절 전체나 특정 낱말의 뜻을 여러 번역본과 견주어 깊고 넓게 알고 싶을 때 눌러 보세요.</p></div>
    <p class="sdesc">최종 판단은 스스로 내리며 묵상하세요.</p>`;
  if (step === 3) body = `
    <p class="sdesc">앞서 소개한 세 가지 기능이 간편하면서도 목적에 맞게 수행되도록, 연결할 AI(${AI[s.ai] ? AI[s.ai].name : 'AI'})에 보낼 지침이 들어 있습니다. “AI에 저장”을 누르면 지침이 복사되고 AI 창이 열립니다. 입력칸을 길게 눌러 붙여넣기 한 뒤 보내세요.</p>
    <p class="sdesc sub">붙여 넣을 때 AI가 “외부에서 가져온 지시문일 수 있다”는 안내를 띄울 수 있습니다. 지침 앞에 직접 정한 지침이라는 문장을 붙여 두어 이런 안내가 줄어들 수 있습니다. 안내가 떠도 이 앱의 성경 읽기 지침이니 읽어 보고 보내시면 됩니다.</p>
    <div id="gcs">${guideCards()}</div>
    <p class="sdesc sub">AI의 기억 기능(메모리)이 켜져 있어야 다음 대화에서도 지침을 기억합니다. 나중에 <span class="pathband">설정 › AI 활용</span>에서 다시 저장하거나 고칠 수 있습니다.</p>`;
  const last = step >= 3 || (step === 1 && s.ai === 'none');
  $('#app').innerHTML = `<div class="screen">${bar('처음 설정', step > 1 ? 'back' : '', { tools: false })}
   <div class="body set setup">${dots}${body}
    <div class="row" style="justify-content:center;gap:12px;margin-top:10px">${step > 1 ? '<button class="btn" id="prev">이전</button>' : ''}<button class="btn dark" id="start">${last ? '시작하기' : '다음'}</button></div>
   </div></div>`;
  $$('.seg').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; s[g.dataset.k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; save(); if (g.dataset.k === 'ai') return vSetup(); $$('button', g).forEach(x => x.classList.toggle('on', x === b)); }));
  if ($('#fs')) $('#fs').oninput = e => { s.fs = +e.target.value; applyView(); };
  const rg = () => { $('#gcs').innerHTML = guideCards(); bindGuideCards(rg); }; if ($('#gcs')) bindGuideCards(rg);
  if ($('#prev')) $('#prev').onclick = () => goBack();
  $('#start').onclick = async () => {
    if (!last) return go(`#/setup?s=${step + 1}`);
    s.setupDone = true; s.year = todayInfo().y; save(); await loadVol(s.vol); go('#/tour');
  };
}

/* ---------- 새해 안내 ---------- */
function newYearCheck() {
  const y = todayInfo().y;
  if (!ST.set.setupDone) return;
  if (y <= ST.set.year) return;
  ST.set.year = y; save();
  if (!ST.set.newYear) return;
  const next = ST.set.vol % 3 + 1, prev = ST.set.vol;
  const m = $('#modal');
  m.innerHTML = `<div class="card"><div class="serif" style="font-size:18px;font-weight:600;color:var(--navy);line-height:1.6">${NEWYEAR}</div>
    <div style="font-size:14px">올해 읽을 권을 골라 주세요</div>
    <div class="seg">${[1, 2, 3].map(n => `<button data-v="${n}" class="${n === next ? 'on' : ''}">${vlabel(n)}</button>`).join('')}</div>
    <div class="lab">지난해에는 ${vlabel(prev)}을 읽었습니다</div>
    <div><button class="btn dark" id="ny">확인</button></div></div>`;
  m.hidden = false;
  let pick = next;
  $('.seg', m).onclick = e => { const b = e.target.closest('button'); if (!b) return; pick = +b.dataset.v; $$('.seg button', m).forEach(x => x.classList.toggle('on', x === b)); };
  $('#ny').onclick = async () => { ST.set.vol = pick; save(); m.hidden = true; await loadVol(pick); route(); };
}

/* ---------- 본문 그리기 ---------- */
function marksOf(pid, v) { return ST.marks.filter(m => m.pid === pid && m.v === v); }
function verseInner(pid, v, text) {
  const ms = marksOf(pid, v);
  if (!ms.length) return esc(text);
  const cut = new Set([0, text.length]);
  ms.forEach(m => { cut.add(Math.max(0, Math.min(text.length, m.s))); cut.add(Math.max(0, Math.min(text.length, m.e))); });
  const pts = [...cut].sort((a, b) => a - b);
  let out = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], seg = esc(text.slice(a, b));
    const on = ms.filter(m => m.s <= a && m.e >= b);
    if (!on.length) { out += seg; continue; }
    const hl = on.filter(m => m.k === 'hl').map(m => m.c), ul = on.find(m => m.k === 'ul'), bd = on.some(m => m.k === 'b');
    let st = '';
    if (hl.length === 1) st += `background:${hl[0]};`;
    else if (hl.length > 1) st += `background:linear-gradient(to bottom,${hl.map((c, k) => `${c} ${k * 100 / hl.length}% ${(k + 1) * 100 / hl.length}%`).join(',')});`;
    if (ul) st += `text-decoration:underline;text-decoration-color:${ul.c};text-decoration-thickness:2px;text-underline-offset:3px;`;
    if (bd) st += 'font-weight:700;';
    out += `<span style="${st}">${seg}</span>`;
  }
  return out;
}
function isBm(pid, v) { return ST.bm.some(b => b.pid === pid && b.v === v); }
function verseHTML(day, pid, v, text) {
  const ms = D.memoAt[day.id + ':' + v] || [];
  const mm = ms.length ? `<sup class="mm" data-memo="${ms[0]}"${ms.length > 1 ? ` data-many="1"` : ''}>M</sup>` : '';
  const bm = isBm(pid, v) ? '<span class="bmk" aria-label="책갈피"></span>' : '';
  return `<p class="v" data-pid="${pid}" data-v="${v}"><span class="n">${v}</span><span class="t">${verseInner(pid, v, text)}</span>${mm}${bm}</p>${parallelHTML(pid, v)}`;
}
/* 대역: 구절 아래 B 글상자 (개역한글·ESV 자료가 있을 때만) */
const PAR = {}; // pid → { krv: {v:text}, esv: {v:text} }
// 대역 상태는 구절마다 하나 (본문 전체 아이콘·드래그 메뉴 어느 쪽으로 켜고 꺼도 같음). 책 속을 벗어나면 모두 해제
const KRV_SHOW = new Set(); // 개역한글을 펼친 구절 (pid:v)
const DBAR = new Set();     // 번역 줄을 펼친 본문 (pid)
function versesOfPid(pid) { const n = +pid[1], arr = D.text[n] && D.text[n][pid]; return arr ? arr.map(x => x[0]) : []; }
function krvState(pid) { const vs = versesOfPid(pid), on = vs.filter(v => KRV_SHOW.has(pid + ':' + v)).length; return on === 0 ? 'off' : on === vs.length ? 'all' : 'some'; }
function dyOf(pid) { const st = krvState(pid); return { bar: DBAR.has(pid) || st !== 'off', krv: st === 'all', some: st === 'some' }; }
function parallelHTML(pid, v) {
  const P = PAR[pid] || {};
  return KRV_SHOW.has(pid + ':' + v) && P.krv && P.krv[v] ? `<div class="bx krv" data-par="krv" data-pid="${pid}" data-v="${v}">${esc(P.krv[v])}</div>` : '';
}
function clearDual() { KRV_SHOW.clear(); DBAR.clear(); }
function headTools(pid) {
  const shown = dyOf(pid).bar;
  return `<span class="htools">${ST.set.ai !== 'none' ? `<button class="hb cmp" data-bcs="${pid}" aria-label="AI로 배경·문맥 살피기">${compassSVG()}</button>` : ''}<button class="hb dual ${shown ? 'on' : ''}" data-dual="${pid}" aria-label="대역 보기">${icon('dual')}</button></span>`;
}
function compassSVG() { return `<svg class="i cps" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4.6l2.3 7.4h-4.6z" fill="#c4473a"/><path d="M12 19.4l-2.3-7.4h4.6z" fill="#3f6fb0"/><circle cx="12" cy="12" r="1.1" fill="#fff" stroke="currentColor" stroke-width=".8"/></svg>`; }
function dualBarHTML(day, j) {
  const pid = `${day.id}-p${j + 1}`, on = dyOf(pid);
  if (!on.bar) return '';
  const inApp = k => k === 'krv' && D.krvOK;
  const b = k => inApp(k) ? `<button class="dv ${on[k] ? 'on' : on.some ? 'some' : ''}" data-dv="${k}" data-pid="${pid}">${EXT[k].name}<span class="car">${on[k] ? '⌃' : '⌄'}</span></button>` : `<button class="dv ext" data-ext="${k}" data-pid="${pid}">${EXT[k].name}<span class="car">↗</span></button>`;
  return `<div class="dvbar" data-pid="${pid}">${b('krv')}<span class="sep">·</span>${b('esv')}<span class="bar2"></span><button class="dv ext" data-ext="saenew" data-pid="${pid}">새번역<span class="car">↗</span></button><span class="sep">·</span><button class="dv ext" data-ext="niv" data-pid="${pid}">NIV<span class="car">↗</span></button></div>`;
}
const deepOpen = new Set();
// 다음·이전 날: 일자별은 달력 순서, 주제별은 주제 › 단원 순서
function stepDay(day, d, topic) { if (topic) { const id = D.tseq[D.tidx[day.id] + d]; return id ? D.days[id] : null; } return D.st.volumes[day.vol - 1].days[day.i + d] || null; }
const stepLabel = (x, topic) => topic ? `${esc(x.p[0].ref)}${x.p.length > 1 ? ' 외' : ''}` : dlabel(x);
function dayHTML(day, opts = {}) {
  const tp = D.topics[day.t], sb = D.subs[day.s], T = !!opts.topic;
  let h = '';
  if (!opts.noHead) h += `<div class="dayhead ${T ? 'topic' : ''}">${T ? '' : `<div class="vol">${vlabel(day.vol)}</div><h1>${dlabel(day)}</h1>`}<div class="tp">${esc(tp.title)}</div><div class="cln"></div><div class="st">${esc(sb.title)}</div></div>`;
  day.p.forEach((p, j) => {
    const pid = `${day.id}-p${j + 1}`;
    const bm = isBm(pid, null) ? ' <span class="bmk"></span>' : '';
    h += `<div class="phrow"><h2 class="ph" data-pid="${pid}">${esc(p.ref)}${bm}</h2>${headTools(pid)}</div>${dualBarHTML(day, j)}`;
    (D.text[day.vol][pid] || []).forEach(([v, t]) => { h += verseHTML(day, pid, v, t); });
  });
  if (day.x.length && !opts.noDeep) day.x.forEach((x, k) => {
    const pid = `${day.id}-p${day.p.length + k + 1}`, open = deepOpen.has(pid);
    D.text[day.vol][pid] = x.text;
    h += `<div class="deep ${open ? 'open' : ''}" data-deep="${pid}"><button class="dh" data-dtg="${pid}"><span>더 깊고 넓게 읽기 · ${esc(x.short)}</span><span class="car">${open ? '⌃' : '⌄'}</span></button>`;
    if (open) { h += `<div class="phrow"><h2 class="ph" data-pid="${pid}">${esc(x.ref)}</h2></div>`; x.text.forEach(([v, t]) => { h += verseHTML(day, pid, v, t); }); }
    h += '</div>';
  });
  if (!opts.noEnd) {
    const nxt = stepDay(day, 1, T);
    const sDays = sb.days, lastOfSub = sDays[sDays.length - 1] === day.id;
    const lastOfTp = lastOfSub && tp.subs[tp.subs.length - 1].id === sb.id;
    let end = `<div class="dayend"><div class="rdline"><button class="readbtn ${isRead(day.id) ? 'on' : ''}" data-read="${day.id}">${icon('check')}<span>${dlabel(day)} ${isRead(day.id) ? '읽음' : '읽기 완료'}</span></button></div>
      <div class="toclinks"><button data-go="#/toc/date?v=${day.vol}">‹ 일자별 목차</button><span>|</span><button data-go="#/toc/topic?v=${day.vol}">주제별 목차 ›</button></div>
      ${nxt ? `<button class="nextbtn" data-nextday="${nxt.id}">${T ? '다음 말씀 · ' + stepLabel(nxt, T) : dlabel(nxt)} ›</button>` : ''}`;
    if (lastOfSub) end += `<div class="unitend"><div class="ut">「${esc(sb.title)}」</div><div class="line">단원 끝</div></div>`;
    if (lastOfTp) end += `<div class="topicend"><div class="tt">「${esc(tp.title)}」</div><div class="line">주제 끝</div></div>`;
    end += '</div>';
    if (T) end = `<div class="datelink"><button data-go="#/read/${day.id}">${vlabel(day.vol)} ${dlabel(day)} · 일자별로 보기</button></div>` + end;
    const li = h.lastIndexOf('<p class="v"'); // 마지막 구절과 읽기 완료를 같은 쪽에
    h = li >= 0 ? h.slice(0, li) + '<div class="keep">' + h.slice(li) + end + '</div>' : h + end;
  }
  return h;
}

/* ---------- 쪽 넘김 ---------- */
class Pager {
  constructor(box, flow, mode, cb = {}) {
    Object.assign(this, { box, flow, mode, cb, page: 0, count: 1 });
    this.onResize = () => { const a = this.anchor(); this.layout(); if (a) this.show(a); };
    window.addEventListener('resize', this.onResize);
    this.bindTouch();
    this.layout();
  }
  layout() {
    if (this.mode !== 'page') { this.flow.style.columnWidth = ''; this.flow.style.transform = ''; this.count = 1; return; }
    const W = this.W = this.box.clientWidth;
    this.flow.style.height = this.box.clientHeight + 'px';
    const px = parseFloat(getComputedStyle(this.flow).paddingLeft) || 18;
    this.flow.style.columnWidth = (W - 2 * px) + 'px'; this.flow.style.columnGap = (2 * px) + 'px';
    this.count = Math.max(1, Math.ceil((this.flow.scrollWidth - 4) / W));
    this.go(Math.min(this.page, this.count - 1), false);
  }
  go(p, anim = true) {
    if (this.mode !== 'page') return;
    p = Math.max(0, Math.min(this.count - 1, p)); this.page = p;
    this.flow.style.transition = anim ? 'transform .32s cubic-bezier(.22,.7,.25,1)' : 'none';
    this.flow.style.transform = `translateX(${-p * this.W}px)`;
    this.cb.page && this.cb.page(p, this.count);
  }
  next() { if (this.page < this.count - 1) this.go(this.page + 1); else this.cb.after && this.cb.after(); }
  prev() { if (this.page > 0) this.go(this.page - 1); else this.cb.before && this.cb.before(); }
  pageOf(el) {
    const fr = this.flow.getBoundingClientRect(), r = el.getBoundingClientRect();
    return Math.floor((r.left - fr.left + 2) / this.W);
  }
  show(el) {
    if (this.mode === 'page') this.go(this.pageOf(el), false);
    else { const top = el.getBoundingClientRect().top - this.box.getBoundingClientRect().top + this.box.scrollTop - 8; this.box.scrollTop = top; }
  }
  anchor() {
    const br = this.box.getBoundingClientRect();
    return $$('p.v', this.flow).find(p => { const r = p.getBoundingClientRect(); return this.mode === 'page' ? (r.right > br.left + 4 && r.left < br.right - 4) : r.bottom > br.top + 4; });
  }
  bindTouch() {
    let sx, sy, st, moved, drag = false;
    this.down = e => { if (e.button > 0) return; sx = e.clientX; sy = e.clientY; st = Date.now(); moved = false; drag = false; };
    this.move = e => { // 쪽 넘기기: 손가락을 따라 화면이 움직임
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) moved = true;
      if (this.mode !== 'page' || hasSel() || sheetOpen() || OWNSEL) return;
      if (!drag && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) drag = true;
      if (drag) { const edge = (dx > 0 && this.page === 0) || (dx < 0 && this.page === this.count - 1) ? .35 : 1; this.flow.style.transition = 'none'; this.flow.style.transform = `translateX(${-this.page * this.W + dx * edge}px)`; }
    };
    this.up = e => {
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy, dt = Date.now() - st; sx = null;
      if (OWNSEL || hasSel() || sheetOpen() || Date.now() - ovJustClosed < 700 || Date.now() - lastSelAt < 900) { drag = false; return; }
      if (e.target.closest('button,a,sup.mm,h2.ph.sel,.bx')) return;
      if (drag) { drag = false; if (Math.abs(dx) > this.W * .18 || (Math.abs(dx) > 40 && dt < 300)) { dx < 0 ? this.next() : this.prev(); if ((dx < 0 && this.page === this.count - 1) || (dx > 0 && this.page === 0)) this.go(this.page); } else this.go(this.page); return; }
      if (!moved && dt < 350) { // 짧게 톡: 양옆은 쪽 넘기기, 가운데만 메뉴 (스크롤에서도 가운데만)
        const W = this.box.clientWidth, x = e.clientX - this.box.getBoundingClientRect().left;
        if (x < W * 0.28) { if (this.mode === 'page') this.prev(); }
        else if (x > W * 0.72) { if (this.mode === 'page') this.next(); }
        else this.cb.tap && this.cb.tap();
      }
    };
    this.box.addEventListener('pointerdown', this.down);
    this.box.addEventListener('pointermove', this.move);
    this.box.addEventListener('pointerup', this.up);
    this.box.addEventListener('pointercancel', () => { if (drag) { drag = false; this.go(this.page); } sx = null; });
    if (this.mode === 'scroll') { this.onScroll = () => this.cb.scroll && this.cb.scroll(); this.box.addEventListener('scroll', this.onScroll, { passive: true }); }
  }
  destroy() { window.removeEventListener('resize', this.onResize); }
}

/* ---------- 읽기 화면 ---------- */
async function vRead(id, at, fromMemo, deepX, topic) {
  if (RETURN_AT && RETURN_AT.day === id && !at) at = RETURN_AT.at; RETURN_AT = null;
  const day = D.days[id];
  if (!day) return go('#/', true);
  if (pager) { pager.destroy(); pager = null; }
  await loadVol(day.vol); setVolClass(day.vol);
  if (deepX != null) deepOpen.add(`${id}-p${day.p.length + +deepX + 1}`);
  await restorePAR(day);
  const mode = ST.set.mode;
  const tpT = D.topics[day.t].title, sbT = D.subs[day.s].title;
  const sl = SLIDE; SLIDE = '';
  $('#app').innerHTML = `<div class="reader ${mode === 'scroll' ? 'scrollmode' : ''} ${sl ? 'sl-' + sl : ''}" id="rd">
    <div class="rhead ${topic ? 'tm' : ''}" id="rhd"><div class="rh1"><span class="rhl"><button class="rhome" data-go="#/" aria-label="홈">${icon('home')}</button><button class="rchip" data-rhome="${topic ? 'topic' : 'date'}"><span class="vn">${vlabel(day.vol)}</span>${topic ? '주제별 읽기' : '일자별 읽기'}</button></span><button class="rsr" data-go="#/find" aria-label="찾기">${icon('search')}</button></div>
      ${topic ? '' : `<div class="rdate">${dlabel(day)}</div>`}<div class="rtp">${esc(tpT)}</div><div class="cln"></div><div class="rsb">${esc(sbT)}</div></div>
    ${fromMemo ? memoBand(fromMemo, id, at, deepX) : ''}
    <div class="pages" id="pg"><div class="flow" id="fl">${dayHTML(day, { noDeep: !!fromMemo && deepX == null, topic, noHead: true })}</div></div>
    <div class="pnum" id="pn"></div></div>`;
  const box = $('#pg'), fl = $('#fl'), rhd = $('#rhd'), mb = $('#mband');
  const placeTop = () => { const h = rhd.offsetHeight; document.documentElement.style.setProperty('--rhh', h + 'px'); if (mb) mb.style.top = h + 'px'; box.style.top = (h + (mb ? mb.offsetHeight : 0) + 14) + 'px'; };
  placeTop();
  $('.rchip', rhd).onclick = e => { e.stopPropagation(); ST.set.home = e.currentTarget.dataset.rhome; save(); go('#/'); };
  const T = topic ? '&t=1' : '', T1 = topic ? '?t=1' : '';
  const saveRecent = () => { const a = pager && pager.anchor(); if (a && !fromMemo) { const r = { day: id, pid: a.dataset.pid, v: +a.dataset.v, ts: Date.now() }; if (topic) ST.recentT = r; else { ST.recentD = r; ST.recent = r; } save(); } };
  const hint = () => {};
  let sT;
  pager = new Pager(box, fl, mode, {
    page: (p, n) => { const pn = $('#pn'); if (!pn) return; pn.textContent = n > 1 ? `${p + 1} / ${n}` : ''; hint(); saveRecent(); },
    after: () => { const n = stepDay(day, 1, topic); if (n) { SLIDE = 'next'; go(`#/read/${n.id}${T1}`, true); } },
    before: () => { const n = stepDay(day, -1, topic); if (n) { SLIDE = 'prev'; go(`#/read/${n.id}?at=end${T}`, true); } },
    tap: () => readPanel(day, topic),
    scroll: () => { hint(); clearTimeout(sT); sT = setTimeout(saveRecent, 400); },
  });
  await document.fonts.ready; placeTop(); pager.layout();
  if (at === 'end') pager.go(pager.count - 1, false);
  else if (deepX != null && !at) { const el = $(`[data-deep="${id}-p${day.p.length + +deepX + 1}"]`, fl); if (el) pager.show(el); }
  else if (at) { const [pid, v] = at.split(':'); const el = $(`p.v[data-pid="${pid}"][data-v="${v}"]`, fl); if (el) pager.show(el); }
  else pager.go(0, false);
  hint(); saveRecent();
  fl._opts = { noDeep: !!fromMemo && deepX == null, topic };
  fl._t = T1;
  bindFlow(fl, day, () => { const a = pager && pager.anchor(); vRead(id, a ? `${a.dataset.pid}:${a.dataset.v}` : null, fromMemo, deepX, topic); });
  if ($('#mband')) bindBand();
  if (!ST.tips.read6) { ST.tips.read6 = 1; save(); toast('화면 가운데를 톡 누르면 읽기 메뉴가, 구절을 길게 누른 채 끌면 구절 메뉴가 나타납니다.', 5200); }
}
/* 책 속 가운데를 누르면 뜨는 메뉴 (MRAe 모양): 아이콘 5개 · 누른 것만 펼침 */
let RP_TAB = '';
function readPanel(day, topic, memo) {
  const p = $('#rpanel');
  let tabs = [['mode', `<span class="rpi">${icon('book')}</span>읽는 방식`], ['fs', '<span class="rpi gg"><span class="a">가</span><span class="b">가</span></span>글자 크기'], ['font', '<span class="rpi aa">Aa</span>글꼴'], ['gap', `<span class="rpi">${icon('alignc')}</span>간격`], ['theme', '<span class="rpi dotc"></span>배경색']];
  if (memo) { tabs = tabs.filter(t => t[0] !== 'mode' && t[0] !== 'font'); if (['mode', 'font'].includes(RP_TAB)) RP_TAB = ''; }
  const sub = k => {
    const s = ST.set, seg = (key, arr) => `<div class="rseg">${arr.map(([v, t]) => `<button data-k="${key}" data-v="${v}" class="${String(s[key]) === String(v) ? 'on' : ''}"${key === 'font' ? ` data-f="${v}"` : ''}>${t}</button>`).join('')}</div>`;
    if (k === 'mode') return seg('mode', [['scroll', '스크롤'], ['page', '쪽 넘기기']]);
    if (k === 'fs') return `<div class="rstep"><button data-fs="-1"><span style="font-size:13px">가</span>−</button><b>${s.fs}</b><button data-fs="1"><span style="font-size:19px">가</span>+</button></div>`;
    if (k === 'font') return seg('font', FONTS.slice(0, 4));
    if (k === 'gap') return `<div class="rlab">줄 간격</div><div class="rseg">${LH_STEPS.map(([t, v]) => `<button data-lh="${v}" class="${Math.abs(s.lh - v) < .06 ? 'on' : ''}">${t}</button>`).join('')}</div><div class="rlab">여백</div>${seg('pad', PADS.map((x, i) => [i, x[1]]))}`;
    if (k === 'theme') return `<div class="rseg th">${THEMES.map(([v, t]) => `<button data-k="theme" data-v="${v}" class="${s.theme === v ? 'on' : ''}"><i class="sw ${v}"></i>${t}</button>`).join('')}</div>`;
    return '';
  };
  const draw = () => {
    p.innerHTML = `<div class="rptabs">${tabs.map(([k, t]) => `<button data-tab="${k}" class="${RP_TAB === k ? 'on' : ''}">${t}</button>`).join('')}<button class="rpx" data-rp="close" aria-label="닫기">${icon('check')}</button></div>
      ${RP_TAB ? `<div class="rpsub">${sub(RP_TAB)}</div>` : ''}`;
  };
  draw(); openOverlay(p);
  const relayout = () => { if (pager) { const a = pager.anchor(); setTimeout(() => { pager.layout(); if (a) pager.show(a); }, 30); } };
  p.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    const s = ST.set;
    if (b.dataset.rp === 'close') { closeOverlay(); return; }
    if (b.dataset.tab) { RP_TAB = RP_TAB === b.dataset.tab ? '' : b.dataset.tab; draw(); return; }
    if (b.dataset.fs) { s.fs = Math.max(14, Math.min(30, s.fs + +b.dataset.fs)); }
    else if (b.dataset.lh) { s.lh = +b.dataset.lh; }
    else if (b.dataset.k) { s[b.dataset.k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; }
    else return;
    save(); applyView(); draw();
    if (b.dataset.k === 'mode') { const fl = $('#fl'); closeOverlay(); setTimeout(() => fl && fl._rerender && fl._rerender(), 60); return; }
    relayout();
  };
}

function bindFlow(fl, day, rerender) {
  fl.addEventListener('click', e => {
    const r = e.target.closest('[data-read]');
    if (r) { const on = !isRead(r.dataset.read); setRead(r.dataset.read, on); r.classList.toggle('on', on); r.innerHTML = icon('check') + `<span>${dlabel(day)} ${on ? '읽음' : '읽기 완료'}</span>`; if (on) toast(`${dlabel(day)} 읽기를 표시했습니다.`); return; }
    const nd = e.target.closest('[data-nextday]'); if (nd) { SLIDE = 'next'; go(`#/read/${nd.dataset.nextday}${fl._t || ''}`, true); return; }
    const mm = e.target.closest('sup.mm');
    if (mm) {
      e.stopPropagation(); const p = mm.closest('p.v'), ids = D.memoAt[day.id + ':' + p.dataset.v] || [];
      if (ids.length > 1) memoPick(ids); else go(`#/memo/${mm.dataset.memo}`);
      return;
    }
    const bc = e.target.closest('[data-bcs]'); if (bc) { const j = +bc.dataset.bcs.split('-p')[1] - 1; openAI(`${day.p[j].ref}\n\n${TRIG_BCS}`); return; }
    const du = e.target.closest('[data-dual]');
    if (du) { const pid = du.dataset.dual; if (dyOf(pid).bar) { DBAR.delete(pid); versesOfPid(pid).forEach(v => KRV_SHOW.delete(pid + ':' + v)); } else DBAR.add(pid); rerender(); return; }
    const ex = e.target.closest('[data-ext]');
    if (ex) { const pid = ex.dataset.pid, p = day.pp[+pid.split('-p')[1] - 1]; openExt(EXT[ex.dataset.ext].url(p)); return; }
    const dv = e.target.closest('[data-dv]');
    if (dv) { toggleParallel(day, dv.dataset.pid, dv.dataset.dv, rerender); return; }
    const dt = e.target.closest('[data-dtg]');
    if (dt) { const pid = dt.dataset.dtg; deepOpen.has(pid) ? deepOpen.delete(pid) : deepOpen.add(pid); const keep = pid; restorePAR(day).then(() => { fl.innerHTML = dayHTML(day, fl._opts || {}); if (pager) { pager.layout(); const el = $(`[data-deep="${keep}"]`, fl); if (el) pager.show(el); } }); return; }
    const bx = e.target.closest('[data-par]');
    if (bx) { parSheet(day, bx); return; }
  });
  // 단락 제목 길게 누르기
  let t, sx, sy;
  fl.addEventListener('pointerdown', e => {
    const h = e.target.closest('h2.ph'); if (!h) return;
    sx = e.clientX; sy = e.clientY;
    t = setTimeout(() => { h.classList.add('sel'); passageSheet(day, h.dataset.pid, h); }, 480);
  });
  const cancel = e => { if (t && (e.type !== 'pointermove' || Math.abs(e.clientX - sx) > 8 || Math.abs(e.clientY - sy) > 8)) { clearTimeout(t); t = null; } };
  fl.addEventListener('pointermove', cancel); fl.addEventListener('pointerup', cancel); fl.addEventListener('pointercancel', cancel);
  fl.addEventListener('contextmenu', e => { if (e.target.closest('h2.ph')) e.preventDefault(); });
  fl._rerender = rerender;
  ownSelect(fl, {
    accept: n => !!(n.nodeType === 3 ? n.parentElement : n).closest('p.v .t,.bx.krv'),
    skip: tg => !!tg.closest('button,sup.mm,h2.ph,.dvbar,.deep .dh'),
    start: () => { if (sheetOpen()) hideSheet(); },
    done: (rg, rect) => {
      const el = n => (n.nodeType === 1 ? n : n.parentElement), bx = el(rg.startContainer).closest('.bx.krv');
      if (bx) { const t = rg.toString().trim(); if (!t) return; krvSheet({ fl, pid: bx.dataset.pid, v: +bx.dataset.v, text: t, whole: t === bx.textContent.trim() }); keepVisible(rect); return; }
      const si = selFromRange(rg); if (!si) { try { CSS.highlights.delete('pick'); } catch (e) {} return; } selInfo = si; selHeld = true; verseSheet(); keepVisible(rect); },
  });
}

/* ---------- 선택과 메뉴 ---------- */
let touchFresh = false, selInfo = null, selT, holdT, touching = false, selHeld = false, lastSelAt = 0;
document.addEventListener('touchstart', e => { touching = true; if (!hasSel()) touchFresh = true; }, { passive: true });
document.addEventListener('touchend', () => { touching = false; }, { passive: true });
document.addEventListener('touchcancel', () => { touching = false; }, { passive: true });
function hasSel() { const s = getSelection(); return s && !s.isCollapsed && s.toString().trim().length > 0; }
function sheetOpen() { return !$('#sheet').hidden; }
function showSheet() { openOverlay($('#sheet'), sheetCleanup); $('#toast').hidden = true; }
function sheetCleanup() { SH_POP = ''; const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; s.classList.remove('dk', 'attop'); $$('h2.ph.sel').forEach(h => h.classList.remove('sel')); selInfo = null; selHeld = false; clearTimeout(holdT); try { CSS.highlights && CSS.highlights.delete('pick'); } catch (e) {} }
function hideSheet() { if (OV && OV.el === $('#sheet')) closeOverlay(); else sheetCleanup(); }
// 고른 뒤 잠시 그대로 두면 휴대폰 선택(과 휴대폰 메뉴)을 풀고 앱 색으로만 표시해 둠
function holdSel() {
  clearTimeout(holdT);
  holdT = setTimeout(() => {
    if (touching) return holdSel();
    if (!hasSel() || !selInfo) return;
    const rg = getSelection().getRangeAt(0).cloneRange(), rect = rg.getBoundingClientRect();
    if (window.CSS && CSS.highlights && typeof Highlight !== 'undefined') { CSS.highlights.set('pick', new Highlight(rg)); selHeld = true; getSelection().removeAllRanges(); }
    verseSheet(); keepVisible(rect);
  }, 900);
}
function keepVisible(rect) { // 고른 글이 메뉴에 가리지 않게: 위쪽 절반이면 메뉴는 아래, 아래쪽 절반이면 위
  const sh = $('#sheet'); if (sh.hidden) return;
  sh.classList.remove('attop', 'compact');
  if ((rect.top + rect.bottom) / 2 > innerHeight / 2) sh.classList.add('attop');
  const r = sh.getBoundingClientRect(), hit = !(rect.bottom < r.top - 6 || rect.top > r.bottom + 6);
  if (!hit) return;
  const box = $('#pg');
  if (box && ST.set.mode === 'scroll') { box.scrollTop += sh.classList.contains('attop') ? rect.top - r.bottom - 20 : rect.bottom - r.top + 24; return; }
  sh.classList.add('compact'); // 쪽 넘기기: 메뉴를 줄여 첫 줄은 꼭 보이게
}
let ovJustClosed = 0;
function onDocDown(e) {
  if (sheetOpen() && !e.target.closest('#sheet')) { hideSheet(); ovJustClosed = Date.now(); }
  if (OV && (OV.el.id === 'rpanel' || OV.el.id === 'uipop') && !OV.el.contains(e.target) && !e.target.closest('[data-act=ui]')) { closeOverlay(); ovJustClosed = Date.now(); }
  if (MM_HELD && !e.target.closest('#mmenu')) hideMemoMenu();
}
function offsetIn(t, node, off) { const r = document.createRange(); r.setStart(t, 0); r.setEnd(node, off); return r.toString().length; }
function onSelChange() {
  clearTimeout(selT);
  selT = setTimeout(() => {
    const s = getSelection();
    if (!hasSel()) { if (selInfo && !selHeld) hideSheet(); return; }
    if (selHeld) { selHeld = false; try { CSS.highlights.delete('pick'); } catch (e) {} }
    const rg = s.getRangeAt(0);
    const fl = rg.commonAncestorContainer.nodeType === 1 ? rg.commonAncestorContainer.closest('.flow') : rg.commonAncestorContainer.parentElement.closest('.flow');
    if (!fl) return;
    const pa = (rg.startContainer.nodeType === 1 ? rg.startContainer : rg.startContainer.parentElement).closest('p.v');
    const pb = (rg.endContainer.nodeType === 1 ? rg.endContainer : rg.endContainer.parentElement).closest('p.v');
    if (!pa || !pb) return;
    const ta = $('.t', pa), tb = $('.t', pb);
    touchFresh = false; lastSelAt = Date.now(); // 고른 만큼만 (구절 전체로 저절로 넓히지 않음)
    const all = $$('p.v', fl);
    const ia = all.indexOf(pa), ib = all.indexOf(pb);
    const items = all.slice(ia, ib + 1).map((p, k) => {
      const t = $('.t', p), len = t.textContent.length;
      const s0 = k === 0 && ta.contains(rg.startContainer) ? offsetIn(ta, rg.startContainer, rg.startOffset) : 0;
      const e0 = p === pb && tb.contains(rg.endContainer) ? offsetIn(tb, rg.endContainer, rg.endOffset) : len;
      return { pid: p.dataset.pid, v: +p.dataset.v, s: s0, e: Math.max(s0, e0), len };
    }).filter(x => x.e > x.s);
    if (!items.length) return;
    const day = D.days[items[0].pid.split('-p')[0]];
    const whole = items.length === 1 && items[0].s === 0 && items[0].e === items[0].len;
    selInfo = { fl, day, items, mode: items.length > 1 ? 'multi' : whole ? 'verse' : 'part', text: s.toString().trim() };
    holdSel(); // 손을 떼고 잠시 멈추면 그때 앱 메뉴 (휴대폰 메뉴와 겹치지 않게)
  }, 220);
}
/* ---------- 앱이 직접 고르기: 길게 눌러 낱말 → 그대로 끌어 넓히기 → 손 떼면 메뉴 (휴대폰 메뉴 없음) ---------- */
let OWNSEL = false;
function ownSelect(root, opts) {
  if (root._own) return; root._own = 1;
  let t = null, sx = 0, sy = 0, active = false, anchor = null, rng = null;
  const caret = (x, y) => { const r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null; return r && root.contains(r.startContainer) && opts.accept(r.startContainer) ? r : null; };
  const wordAt = r => {
    const n = r.startContainer; if (n.nodeType !== 3) { const w = document.createRange(); w.selectNodeContents(n); return w; }
    const s = n.data; let a = Math.min(r.startOffset, s.length), b = a;
    while (a > 0 && !/\s/.test(s[a - 1])) a--; while (b < s.length && !/\s/.test(s[b])) b++;
    if (b === a && b < s.length) b++;
    const w = document.createRange(); w.setStart(n, a); w.setEnd(n, b); return w;
  };
  const paint = () => { try { if (window.CSS && CSS.highlights && typeof Highlight !== 'undefined') CSS.highlights.set('pick', new Highlight(rng)); } catch (e) {} };
  const extend = (x, y) => {
    const c = caret(x, y); if (!c) return;
    const r = document.createRange();
    if (anchor.compareBoundaryPoints(Range.START_TO_START, c) <= 0) { r.setStart(anchor.startContainer, anchor.startOffset); r.setEnd(c.startContainer, c.startOffset); if (r.compareBoundaryPoints(Range.END_TO_END, anchor) < 0) r.setEnd(anchor.endContainer, anchor.endOffset); }
    else { r.setStart(c.startContainer, c.startOffset); r.setEnd(anchor.endContainer, anchor.endOffset); }
    rng = r; paint();
  };
  root.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || (opts.skip && opts.skip(e.target))) { clearTimeout(t); return; }
    const p = e.touches[0]; sx = p.clientX; sy = p.clientY; clearTimeout(t);
    t = setTimeout(() => { const c = caret(sx, sy); if (!c) return; active = true; OWNSEL = true; opts.start && opts.start(); anchor = wordAt(c); rng = anchor.cloneRange(); paint(); try { navigator.vibrate && navigator.vibrate(12); } catch (er) {} }, 450);
  }, { passive: true });
  root.addEventListener('touchmove', e => {
    const p = e.touches[0];
    if (!active) { if (Math.hypot(p.clientX - sx, p.clientY - sy) > 8) clearTimeout(t); return; }
    e.preventDefault(); extend(p.clientX, p.clientY);
  }, { passive: false });
  const end = () => { clearTimeout(t); if (!active) return; active = false; setTimeout(() => { OWNSEL = false; }, 60); lastSelAt = Date.now(); opts.done(rng, rng.getBoundingClientRect()); };
  root.addEventListener('touchend', end); root.addEventListener('touchcancel', end);
  root.addEventListener('contextmenu', e => e.preventDefault());
}
function selFromRange(rg) { // 고른 범위 → 구절별 (시작·끝 글자 위치)
  const el = n => (n.nodeType === 1 ? n : n.parentElement);
  const fl = el(rg.commonAncestorContainer).closest('.flow'); if (!fl) return null;
  const pa = el(rg.startContainer).closest('p.v'), pb = el(rg.endContainer).closest('p.v'); if (!pa || !pb) return null;
  const ta = $('.t', pa), tb = $('.t', pb), all = $$('p.v', fl), ia = all.indexOf(pa), ib = all.indexOf(pb);
  const items = all.slice(ia, ib + 1).map((p, k) => {
    const t = $('.t', p), len = t.textContent.length;
    const s0 = k === 0 && ta.contains(rg.startContainer) ? offsetIn(ta, rg.startContainer, rg.startOffset) : 0;
    const e0 = p === pb && tb.contains(rg.endContainer) ? offsetIn(tb, rg.endContainer, rg.endOffset) : len;
    return { pid: p.dataset.pid, v: +p.dataset.v, s: s0, e: Math.max(s0, e0), len };
  }).filter(x => x.e > x.s);
  if (!items.length) return null;
  const day = D.days[items[0].pid.split('-p')[0]], whole = items.length === 1 && items[0].s === 0 && items[0].e === items[0].len;
  return { fl, day, items, mode: items.length > 1 ? 'multi' : whole ? 'verse' : 'part', text: rg.toString().trim() };
}

function refOf(items) {
  const d = D.days[items[0].pid.split('-p')[0]], p = d.p[+items[0].pid.split('-p')[1] - 1];
  const a = items[0].v, b = items[items.length - 1].v;
  return `${p.book} ${p.ch}:${a}${b !== a ? '~' + b : ''}`;
}
function selVersesText(items) { return items.map(x => (items.length > 1 ? x.v + ' ' : '') + vtext(x.pid, x.v)).join('\n'); }
function sameMark(m, x, k, c) { return m.pid === x.pid && m.v === x.v && m.s === x.s && m.e === x.e && m.k === k && (k === 'b' || m.c === c); }
let SH_POP = '';
function pickMark(items) { // 구절 전체를 고른 경우 앱 색으로 표시 유지
  try {
    if (!window.CSS || !CSS.highlights || typeof Highlight === 'undefined') return;
    const rs = items.filter(x => x.s === 0 && x.e === x.len).map(x => { const t = $(`p.v[data-pid="${x.pid}"][data-v="${x.v}"] .t`); if (!t) return null; const r = document.createRange(); r.selectNodeContents(t); return r; }).filter(Boolean);
    if (rs.length) CSS.highlights.set('pick', new Highlight(...rs)); else CSS.highlights.delete('pick');
  } catch (e) {}
}
function verseSheet() {
  const S = selInfo; if (!S) return;
  const it = S.items, ai = ST.set.ai !== 'none';
  const on = (k, c) => it.every(x => ST.marks.some(m => sameMark(m, x, k, c)));
  const bmOn = it.length === 1 && isBm(it[0].pid, it[0].v);
  const hlOn = HL.some(c => on('hl', c)), ulOn = UL.some(c => on('ul', c));
  const partial = it.some(x => x.s > 0 || x.e < x.len);
  const sh = $('#sheet'); sh.classList.add('dk');
  const B = (attr, inner, lab, onc) => `<button class="vb ${onc ? 'on' : ''}" ${attr} aria-label="${lab}">${inner}<small>${lab}</small></button>`;
  const krvOn = it.every(x => KRV_SHOW.has(x.pid + ':' + x.v));
  sh.innerHTML = `<div class="vsh">
    <div class="vtop"><span>${esc(refOf(it))}</span>${partial ? '<button class="whole" data-whole="1">구절 전체</button>' : ''}</div>

    ${SH_POP ? `<div class="pop">${SH_POP === 'hl' ? HL.map((c, i) => `<button class="dot ${on('hl', c) ? 'on' : ''}" style="background:${c}" data-mk="hl" data-c="${c}" aria-label="${HL_NAME[i]} 칠하기"></button>`).join('') : UL.map(c => `<button class="ulb ${on('ul', c) ? 'on' : ''}" style="--c:${c}" data-mk="ul" data-c="${c}" aria-label="밑줄"></button>`).join('')}</div>` : ''}
    <div class="vgrid2 ${ai ? '' : 'noai'}">${ai ? `<button class="aib" data-ai="ask">${icon('ask')}<span>AI와<br>간단 Q&amp;A</span></button>` : ''}<div class="vrow">${B('data-pop="hl"', `<span class="hlg">${icon('hl')}</span>`, '형광펜', hlOn || SH_POP === 'hl')}${B('data-pop="ul"', '<span class="uglyph">U</span>', '밑줄', ulOn || SH_POP === 'ul')}${B('data-mk="b"', '<span class="bglyph">B</span>', '진하게', on('b'))}${B('data-mk="clear"', icon('er'), '지우개')}</div>
      ${ai ? `<button class="aib" data-ai="tc">${icon('gem')}<span>AI로<br>번역 비교</span></button>` : ''}<div class="vrow">${B('data-a="memo"', icon('memo'), '메모')}${B('data-a="copy"', icon('copy'), '복사')}${B('data-a="share"', icon('share'), '공유')}${it.length === 1 ? B('data-a="bm"', icon('bm'), '책갈피', bmOn) : '<span class="vb"></span>'}</div>
    </div></div>`;
  if (sh.hidden) showSheet();
  $$('[data-yv]', sh).forEach(b => b.onclick = () => { const x = it[0], p = D.days[x.pid.split('-p')[0]].pp[+x.pid.split('-p')[1] - 1]; openExt(EXT[b.dataset.yv].url(p, it[0].v, it[it.length - 1].v)); });
  const krvB = $('[data-krv]', sh); if (krvB) krvB.onclick = async () => { // 개역한글은 본문 속 그 구절 바로 아래에
    if (!krvOn && !(await loadKRV(S.day))) { toast('개역한글 본문을 불러오지 못했습니다.'); return; }
    it.forEach(x => { const k = x.pid + ':' + x.v; if (krvOn) KRV_SHOW.delete(k); else KRV_SHOW.add(k); });
    holdNow(); redrawVerses(S.fl, it); pickMark(it);
    const a = pager && pager.anchor(); if (pager) { pager.layout(); if (a) pager.show(a); }
    const fl = S.fl; it.map(x => x.pid).filter((v, i, a2) => a2.indexOf(v) === i).forEach(pid => { const row = $(`.phrow h2.ph[data-pid="${pid}"]`, fl); const hb = row && row.parentElement.querySelector('.hb.dual'); if (hb) hb.classList.toggle('on', dyOf(pid).bar); });
    verseSheet(); const p0 = $(`p.v[data-pid="${it[0].pid}"][data-v="${it[0].v}"]`, fl); if (p0) keepVisible(p0.getBoundingClientRect());
  };
  const wb = $('[data-whole]', sh); if (wb) wb.onclick = () => { it.forEach(x => { x.s = 0; x.e = x.len; }); S.mode = it.length > 1 ? 'multi' : 'verse'; S.text = it.map(x => vtext(x.pid, x.v)).join(' '); holdNow(); pickMark(it); verseSheet(); };
  if (!ST.tips.tts) { ST.tips.tts = 1; save(); setTimeout(() => toast('구절을 고를 때 구글 검색 막대가 메뉴를 가리면 사용법 맨 아래 안내를 보세요.', 5200), 600); }
  $$('[data-ai]', sh).forEach(b => b.onclick = () => {
    const ref = refOf(it), body = selVersesText(it);
    if (b.dataset.ai === 'tc') return openAI(`${ref}\n${body}\n\n${S.mode === 'part' ? TRIG_TC_PART(S.text) : TRIG_TC}`);
    openAI(`${ref}\n${body}\n\n${S.mode === 'part' ? TRIG_QA_PART(S.text) : TRIG_QA}\n\n질문: `);
  });
  $$('[data-pop]', sh).forEach(b => b.onclick = () => { SH_POP = SH_POP === b.dataset.pop ? '' : b.dataset.pop; verseSheet(); });
  $$('[data-mk]', sh).forEach(b => b.onclick = () => { // 서식은 눌러도 창이 닫히지 않음
    const k = b.dataset.mk, c = b.dataset.c;
    if (k === 'clear') ST.marks = ST.marks.filter(m => !it.some(x => m.pid === x.pid && m.v === x.v && m.s < x.e && m.e > x.s));
    else if (on(k, c)) ST.marks = ST.marks.filter(m => !it.some(x => sameMark(m, x, k, c)));
    else { if (k !== 'b') ST.marks = ST.marks.filter(m => !(m.k === k && it.some(x => m.pid === x.pid && m.v === x.v && m.s === x.s && m.e === x.e))); it.forEach(x => ST.marks.push({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), day: x.pid.split('-p')[0], pid: x.pid, v: x.v, s: x.s, e: x.e, k, c: k === 'b' ? null : c, ts: Date.now() })); }
    save(); holdNow(); redrawVerses(S.fl, it); pickMark(it); verseSheet();
  });
  $$('[data-a]', sh).forEach(b => b.onclick = () => {
    const a = b.dataset.a, ref = refOf(it);
    if (a === 'memo') { const x = it[0]; return go(`#/edit/new?at=${x.pid}:${x.v}${S.mode === 'part' ? '&q=' + encodeURIComponent(S.text) : ''}`); }
    const txt = S.mode === 'part' ? `“${S.text}”\n— ${ref} (개역개정)` : `${ref} (개역개정)\n${selVersesText(it)}`;
    if (a === 'copy') { copy(txt); toast('복사했습니다.'); }
    if (a === 'share') share(txt);
    if (a === 'bm') { toggleBm(it[0].pid, it[0].v); holdNow(); redrawVerses(S.fl, it); pickMark(it); toast(isBm(it[0].pid, it[0].v) ? '책갈피를 꽂았습니다.' : '책갈피를 뺐습니다.'); verseSheet(); return; }
    getSelection().removeAllRanges(); hideSheet();
  });
}
function krvSheet(P) { // 개역한글 줄을 골랐을 때: AI·복사·메모만
  selInfo = null; selHeld = true;
  const sh = $('#sheet'); sh.classList.add('dk'); const ai = ST.set.ai !== 'none';
  const ref = refOf([{ pid: P.pid, v: P.v }]);
  const B = (a, ic, lab) => `<button class="vb" data-pa="${a}" aria-label="${lab}">${icon(ic)}<small>${lab}</small></button>`;
  sh.innerHTML = `<div class="vsh"><div class="vtop"><span>개역한글 · ${esc(ref)}</span></div>
    <div class="pgrid">${ai ? `<button class="aib" data-pa="ask">${icon('ask')}<span>AI와<br>간단 Q&amp;A</span></button><button class="aib" data-pa="tc">${icon('gem')}<span>AI로<br>번역 비교</span></button>` : ''}<button class="aib" data-pa="copy">${icon('copy')}<span>복사</span></button><button class="aib" data-pa="memo">${icon('memo')}<span>메모</span></button></div></div>`;
  if (sh.hidden) showSheet();
  const body = `${ref} (개역한글)\n${P.text}`;
  $$('[data-pa]', sh).forEach(b => b.onclick = () => {
    const a = b.dataset.pa;
    if (a === 'ask') return openAI(`${body}\n\n${P.whole ? TRIG_QA : TRIG_QA_PART(P.text)}\n\n질문: `);
    if (a === 'tc') return openAI(`${body}\n\n${P.whole ? TRIG_TC : TRIG_TC_PART(P.text)}`);
    if (a === 'memo') return go(`#/edit/new?at=${P.pid}:${P.v}&q=${encodeURIComponent(P.text + ' (개역한글)')}`);
    if (a === 'copy') { copy(`“${P.text}”\n— ${ref} (개역한글)`); toast('복사했습니다.'); }
    hideSheet();
  });
}
function holdNow() { selHeld = true; clearTimeout(holdT); try { getSelection().removeAllRanges(); } catch (e) {} }
function redrawVerses(fl, items) {
  items.forEach(x => {
    const p = $(`p.v[data-pid="${x.pid}"][data-v="${x.v}"]`, fl); if (!p) return;
    while (p.nextElementSibling && p.nextElementSibling.classList.contains('bx')) p.nextElementSibling.remove();
    const day = D.days[x.pid.split('-p')[0]]; p.outerHTML = verseHTML(day, x.pid, x.v, vtext(x.pid, x.v));
  });
}
function toggleBm(pid, v) {
  const i = ST.bm.findIndex(b => b.pid === pid && b.v === v);
  if (i >= 0) ST.bm.splice(i, 1); else ST.bm.push({ day: pid.split('-p')[0], pid, v, ts: Date.now() });
  save();
}
function passageSheet(day, pid, h) {
  const j = +pid.split('-p')[1] - 1, p = day.p[j];
  const bmOn = isBm(pid, null);
  const sh = $('#sheet');
  sh.innerHTML = `<div class="what">${esc(p.ref)} 본문 전체</div>
    ${ST.set.ai !== 'none' ? `<button class="aibtn ctx" id="ai">${compassSVG()}<div><b>AI로 배경·문맥 살피기</b><small>본문과 관련해 지침대로 살핀 결과 보기</small></div><span class="go">›</span></button>` : ''}
    <div class="acts"><button data-a="copy">${icon('copy')}본문 복사</button><button data-a="share">${icon('share')}본문 공유</button><button data-a="bm" class="${bmOn ? 'on' : ''}">${icon('bm')}책갈피</button></div>`;
  showSheet();
  const txt = () => `${p.ref} (개역개정)\n` + (D.text[day.vol][pid] || []).map(([v, t]) => `${v} ${t}`).join('\n');
  if ($('#ai', sh)) $('#ai', sh).onclick = () => openAI(`${p.ref}\n\n${TRIG_BCS}`);
  $$('[data-a]', sh).forEach(b => b.onclick = () => {
    const a = b.dataset.a;
    if (a === 'copy') { copy(txt()); toast('본문을 복사했습니다.'); }
    if (a === 'share') share(txt());
    if (a === 'bm') { toggleBm(pid, null); toast(isBm(pid, null) ? '본문에 책갈피를 꽂았습니다.' : '책갈피를 뺐습니다.'); const fl = h.closest('.flow'); if (fl && fl._rerender) fl._rerender(); }
    hideSheet();
  });
}

/* ---------- 대역 (개역한글 자료·ESV 열쇠가 있을 때) ---------- */
async function toggleParallel(day, pid, k, rerender) {
  const vs = versesOfPid(pid);
  if (krvState(pid) === 'all') { vs.forEach(v => KRV_SHOW.delete(pid + ':' + v)); return rerender(); }
  const ok = k === 'krv' ? await loadKRV(day) : false;
  if (!ok) { // 막히면 바깥 사이트로
    const p = day.pp[+pid.split('-p')[1] - 1];
    toast(`${EXT[k].name} 본문을 불러오지 못해 ${EXT[k].name} 사이트를 엽니다.`, 3600);
    openExt(EXT[k].url(p)); return;
  }
  DBAR.add(pid); vs.forEach(v => KRV_SHOW.add(pid + ':' + v)); rerender();
}
async function loadKRV(day) {
  try {
    if (!D.krv) D.krv = {};
    if (!D.krv[day.vol]) D.krv[day.vol] = await getJSON(`data/krv-v${day.vol}.json`);
    day.p.forEach((p, j) => { const pid = `${day.id}-p${j + 1}`, arr = D.krv[day.vol][pid] || []; (PAR[pid] = PAR[pid] || {}).krv = Object.fromEntries(arr); });
    day.x.forEach((x, k) => { (PAR[`${day.id}-p${day.p.length + k + 1}`] = PAR[`${day.id}-p${day.p.length + k + 1}`] || {}).krv = Object.fromEntries(x.krv || []); });
    return true;
  } catch (e) { return false; }
}
async function restorePAR(day) { // 다시 그릴 때 켜 둔 대역 자료 채우기
  if ([...KRV_SHOW].some(k => k.startsWith(day.id + '-')) && !(await loadKRV(day))) [...KRV_SHOW].filter(k => k.startsWith(day.id + '-')).forEach(k => KRV_SHOW.delete(k));
}
function parSheet(day, bx) {
  const k = bx.dataset.par, pid = bx.dataset.pid, v = +bx.dataset.v, p = day.pp[+pid.split('-p')[1] - 1];
  const ref = `${p.abbr} ${p.ch}:${v} (개역한글)`;
  const txt = `${ref}\n${bx.textContent}`;
  const sh = $('#sheet');
  sh.innerHTML = `<div class="what">${esc(ref)}</div><div class="acts"><button data-a="copy">${icon('copy')}복사</button><button data-a="share">${icon('share')}공유</button></div>`;
  showSheet();
  $$('[data-a]', sh).forEach(b => b.onclick = () => { if (b.dataset.a === 'copy') { copy(txt); toast('복사했습니다.'); } else share(txt); hideSheet(); });
}
function memoPick(ids) {
  const sh = $('#sheet');
  sh.innerHTML = `<div class="what">이 구절에 걸린 메모</div><div class="list">${ids.map(id => { const m = memoById(id); return m ? `<button class="it" data-mp="${id}"><span class="t" style="color:var(--ink)">${esc(m.title || '(제목 없음)')}</span></button>` : ''; }).join('')}</div>`;
  showSheet();
  $$('[data-mp]', sh).forEach(b => b.onclick = () => go(`#/memo/${b.dataset.mp}`));
}

/* ---------- AI·복사·공유 ---------- */
function copy(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  fallbackCopy(text);
}
function fallbackCopy(text) { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); }
function share(text) { if (navigator.share) navigator.share({ text }).catch(() => {}); else { copy(text); toast('공유 기능이 없는 화면이라 복사해 두었습니다.'); } }
function openAI(prompt) {
  if (ST.set.ai === 'none') { toast('AI를 활용하지 않도록 설정되어 있습니다. 설정 › AI 활용에서 바꿀 수 있습니다.'); return; }
  const a = AI[ST.set.ai] || AI.claude;
  hideSheet(); getSelection().removeAllRanges();
  if (ST.set.ai === 'chatgpt') { aiGo(a.name, a.url + encodeURIComponent(prompt), '보내기만 누르면 됩니다.'); return; } // ChatGPT: 입력칸에 채워진 채 열림
  copy(prompt); aiGo(a.name, AI_HOME[ST.set.ai] || AI_HOME.claude, PASTE_TIP); // Claude·Gemini: 붙여넣기 (경고창 없이)
}

/* ---------- 권 화면 (진도표 + 목차) ---------- */
async function vVol(n) {
  setVolClass(n);
  const P = ST.prog[n], vol = D.st.volumes[n - 1], tid = todayDayId(n);
  const c = Object.keys(P.read).length;
  const hist = P.hist.length ? `<div class="lab">지난 회차: ${P.hist.map((h, k) => `${k + 1}독 ${new Date(h.done).toLocaleDateString('ko-KR')} 마침`).join(' · ')}</div>` : '';
  let toc = '';
  for (const tp of D.st.topics.filter(t => t.vol === n)) {
    toc += `<div class="tp-t">${esc(tp.title)}</div>`;
    for (const s of tp.subs) {
      const ds = vol.days.filter(d => d.s === s.id);
      toc += `<div class="st-t">${esc(s.title)}</div><div class="dchips">${ds.map(d => `<button class="${P.read[d.id] ? 'f' : ''}" data-go="#/read/${d.id}">${d.m}/${d.d}</button>`).join('')}</div>`;
    }
  }
  $('#app').innerHTML = `<div class="screen">${bar(vlabel(n), 'back', { findOnly: true })}
    <div class="body">
      <div class="seg" id="vs">${[1, 2, 3].map(k => `<button data-v="${k}" class="${k === n ? 'on' : ''}">${vlabel(k)}</button>`).join('')}</div>
      <div class="row between"><b style="color:var(--vc)">${roundLabel(n).split(' · ')[0]}</b><span class="lab">${c} / 365일</span></div>
      <div class="grid">${vol.days.map(d => `<button class="${P.read[d.id] ? 'f' : ''} ${d.id === tid ? 't' : ''}" data-go="#/read/${d.id}" aria-label="${dlabel(d)}"></button>`).join('')}</div>
      <div class="row lab" style="gap:14px"><span><i style="display:inline-block;width:10px;height:10px;background:var(--vc);border-radius:2px"></i> 읽음</span><span><i style="display:inline-block;width:10px;height:10px;outline:2px solid var(--copper);border-radius:2px"></i> 오늘</span></div>
      ${hist}
      <button class="btn" data-go="#/toc/date?v=${n}">${icon('toc')}일자별 목차 보기</button>
    </div>${nav('')}</div>`;
  $('#vs').onclick = e => { const b = e.target.closest('button'); if (b) go(`#/vol/${b.dataset.v}`, true); };
}

/* ---------- 모아 보기 ---------- */
let colSort = 'text', colVol = 0;
function locLabel(dayId) { const d = D.days[dayId]; return `${vlabel(d.vol)} ${dlabel(d)}`; }
function refShort(pid, v) { const d = D.days[pid.split('-p')[0]], p = d.pp[+pid.split('-p')[1] - 1]; return v == null ? p.ref : `${p.abbr} ${p.ch}:${v}`; }
const fmtDate = ts => { const d = new Date(ts); return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`; };
async function vCol(tab) {
  await loadAll();
  if (tab !== 'bm') tab = 'hl';
  const seg = `<div class="seg" id="ct">${[['hl', '하이라이트'], ['bm', '책갈피']].map(([k, t]) => `<button data-v="${k}" class="${k === tab ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  const ctl = `<div class="row between"><span class="lab">${colSort === 'text' ? '본문 순서' : '최근 순'} · 아래 정렬에서 바꿈</span>
    <select id="cv" class="field" style="width:auto;padding:6px 8px">${['전체', '제1권', '제2권', '제3권'].map((t, k) => `<option value="${k}" ${k === colVol ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <input class="field" id="cq" placeholder="찾을 낱말" inputmode="search" hidden>`;
  $('#app').innerHTML = `<div class="screen">${bar('모아 보기', 'back', { findOnly: true })}<div class="body">${seg}${ctl}<div class="card list" id="cl"></div></div>${nav('col', { ctx: 'col' })}</div>`;
  const draw = () => {
    const q = $('#cq').value.trim();
    let rows = [];
    if (tab === 'hl') {
      rows = ST.marks.map(m => {
        const tx = vtext(m.pid, m.v).slice(m.s, m.e);
        const st = m.k === 'hl' ? `background:${m.c}` : m.k === 'ul' ? `text-decoration:underline;text-decoration-color:${m.c};text-decoration-thickness:2px` : 'font-weight:700';
        return { ord: D.order[m.day] * 1000 + m.v + m.s / 1e4, ts: m.ts, vol: D.days[m.day].vol, find: tx,
          html: `<button class="it" data-go="#/read/${m.day}?at=${m.pid}:${m.v}"><span class="t">${refShort(m.pid, m.v)} · ${locLabel(m.day)}</span><span class="q"><span style="${st}">${esc(tx)}</span></span><span class="m">${fmtDate(m.ts)}</span></button>` };
      });
    } else {
      rows = ST.bm.map(b => {
        const tx = b.v == null ? '' : vtext(b.pid, b.v);
        return { ord: D.order[b.day] * 1000 + (b.v || 0), ts: b.ts, vol: D.days[b.day].vol, find: tx + refShort(b.pid, b.v),
          html: `<button class="it" data-go="#/read/${b.day}${b.v == null ? '' : `?at=${b.pid}:${b.v}`}"><span class="t">${refShort(b.pid, b.v)}${b.v == null ? ' 본문' : ''} · ${locLabel(b.day)}</span>${tx ? `<span class="q">${esc(tx)}</span>` : ''}<span class="m">${fmtDate(b.ts)}</span></button>` };
      });
    }
    if (colVol) rows = rows.filter(r => r.vol === colVol);
    if (q) rows = rows.filter(r => r.find.includes(q));
    rows.sort((a, b) => colSort === 'text' ? a.ord - b.ord : b.ts - a.ts);
    const empty = tab === 'hl' ? '아직 하이라이트가 없습니다.<br>구절을 길게 누르거나 드래그해서 칠해 보세요.' : '아직 책갈피가 없습니다.<br>구절 표시를 길게 누르거나 책갈피 아이콘으로 꽂을 수 있습니다.';
    $('#cl').innerHTML = rows.length ? rows.map(r => r.html).join('') : `<div class="empty">${empty}</div>`;
  };
  $('#ct').onclick = e => { const b = e.target.closest('button'); if (b) go(`#/col/${b.dataset.v}`, true); };

  $('#cv').onchange = e => { colVol = +e.target.value; draw(); };
  $('#cq').oninput = draw;
  draw();
}

/* ---------- 메모: 색인·분류 ---------- */
function allMemos() { return D.memos.concat(UM); }
function memoById(id) { return allMemos().find(m => m.id === id); }
function indexMemos() {
  D.memoAt = {};
  for (const m of allMemos()) for (const a of m.anchors || []) (D.memoAt[a.day + ':' + a.v] = D.memoAt[a.day + ':' + a.v] || []).push(m.id);
}
function catsOf(m) { return ST.mcat[m.id] || m.cats || []; }
function catList() { return CATS0.concat(ST.cats.filter(c => !CATS0.includes(c))); }
const styleShort = m => m.style === '전도 대화체' ? '대화' : m.style === '나눔체' ? '나눔' : '';
function memoKey(m) { // 성경 순서 열쇠 (구절 없는 메모는 맨 아래)
  if (m._k != null) return m._k;
  const a = (m.anchors || [])[0]; let k = Infinity;
  if (a && D.days[a.day]) { const pi = findPidIdx(a.day, a.v, a.ref), p = D.days[a.day].pp[pi - 1]; if (p) k = bkey(p.code, p.ch, a.v); }
  return (m._k = k);
}
function memoSort(a, b) {
  if ((ST.set.msort || 'verse') === 'date') return Date.parse(b.created) - Date.parse(a.created);
  const ka = memoKey(a), kb = memoKey(b);
  return ka !== kb ? (ka === Infinity ? 1 : kb === Infinity ? -1 : ka - kb) : Date.parse(a.created) - Date.parse(b.created);
}
function memoDates(m) { const c = m.created.slice(0, 10).replace(/-/g, '.'), u = (m.updated || m.created).slice(0, 10).replace(/-/g, '.'); return `${c} 작성${u !== c ? ' · ' + u + ' 수정' : ''}`; }
function plainOf(m) { return (m.title || '') + ' ' + (m.ref || '') + ' ' + (m.search || '') + ' ' + (m.html || '').replace(/<[^>]+>/g, ' '); }

/* ---------- 메모와 이어진 구절 (대표 · 관련) ---------- */
function parseRef(r) { const m = String(r || '').match(/^(\S+)\s+(\d+):(\d+)/); if (!m) return null; const code = ABBR_CODE[m[1]]; return code ? { code, ch: +m[2], v: +m[3] } : null; }
let ABBR_CODE = {};
function bkey(code, ch, v) { return BOOKS.indexOf(code) * 1e6 + ch * 1e3 + v; }
function memoRel(m) {
  const items = [], an = (m.anchors || []).map(a => { const pi = findPidIdx(a.day, a.v, a.ref), pid = `${a.day}-p${pi}`, p = D.days[a.day].pp[pi - 1]; return { day: a.day, pid, p, v: a.v }; });
  an.sort((x, y) => bkey(x.p.code, x.p.ch, x.v) - bkey(y.p.code, y.p.ch, y.v) || D.order[x.day] - D.order[y.day]);
  for (const a of an) {
    const last = items[items.length - 1];
    if (last && !last.x && last.pid === a.pid && a.v === last.b + 1) last.b = a.v;
    else if (!(last && !last.x && last.pid === a.pid && a.v >= last.a && a.v <= last.b)) items.push({ day: a.day, pid: a.pid, p: a.p, a: a.v, b: a.v });
  }
  const cited = parseRef(m.ref);
  for (const id in D.extra) D.extra[id].forEach((x, k) => {
    const hit = cited && cited.code === x.code && cited.ch === x.ch && cited.v >= x.vs && cited.v <= x.ve;
    const viaAnchor = (m.anchors || []).some(a => { const r = parseRef(a.ref); return r && r.code === x.code && r.ch === x.ch && r.v >= x.vs && r.v <= x.ve; });
    if (hit || viaAnchor) items.push({ x: true, day: id, k, pid: `${id}-p${D.days[id].p.length + k + 1}`, p: x, a: x.vs, b: x.ve });
  });
  items.sort((x, y) => bkey(x.p.code, x.p.ch, x.a) - bkey(y.p.code, y.p.ch, y.a));
  const seen = new Set(); for (let i = 0; i < items.length; i++) { const k = (items[i].x ? 'x' : '') + relLabel(items[i]); if (seen.has(k)) { items.splice(i, 1); i--; } else seen.add(k); }
  let rep = null;
  if (cited) rep = items.find(i => !i.x && i.p.code === cited.code && i.p.ch === cited.ch && cited.v >= i.a && cited.v <= i.b);
  if (!rep && cited) { const xi = items.find(i => i.x && i.p.code === cited.code && i.p.ch === cited.ch && cited.v >= i.a && cited.v <= i.b); if (xi) rep = { day: xi.day, pid: xi.pid, p: xi.p, a: cited.v, b: cited.v, inX: xi }; }
  if (!rep) rep = items.find(i => !i.x) || null;
  return { rep, others: items.filter(i => i !== rep) };
}
const relLabel = i => i.x ? i.p.short : `${i.p.abbr} ${i.p.ch}:${i.a}${i.b !== i.a ? '~' + i.b : ''}`;
const relHref = (i, mid) => i.x ? `#/read/${i.day}?x=${i.k}&m=${mid}` : i.inX ? `#/read/${i.day}?x=${i.inX.k}&at=${i.pid}:${i.a}&m=${mid}` : `#/read/${i.day}?at=${i.pid}:${i.a}&m=${mid}`;
function memoHeadHTML(m) {
  const { rep, others } = memoRel(m);
  if (!rep && !others.length) return '';
  let h = '';
  if (rep) {
    const t = vtext(rep.pid, rep.a), more = rep.b > rep.a;
    h += `<div class="repbox"><div class="rl"><span class="ri">${icon('flag')}<b>대표 구절 · ${esc(relLabel(rep))}</b></span><button data-go="${relHref(rep, m.id)}">${locLabel(rep.day)} ›</button></div>
      <div class="rt" id="rt"><span class="n">${rep.a}</span>${esc(t)}${more ? ` <span class="ell">…</span> <button class="rmore" id="rmore">(${rep.a + 1}${rep.b > rep.a + 1 ? '~' + rep.b : ''}절 전체 보기)</button>` : ''}</div></div>`;
  }
  if (others.length) h += `<div class="relbox ${rep ? 'joined' : ''}"><span class="ri">${icon('link')}</span><div><div class="rlab">관련 구절</div><div class="rchips">${others.map(i => `<button class="${i.x ? 'xchip' : ''}" data-go="${relHref(i, m.id)}">${esc(relLabel(i))}</button>`).join('')}</div></div></div>`;
  return h;
}
function bindMemoHead(m) {
  const b = $('#rmore'); if (!b) return;
  b.onclick = () => { const { rep } = memoRel(m); let h = ''; for (let v = rep.a; v <= rep.b; v++) h += `<span class="n">${v}</span>${esc(vtext(rep.pid, v))} `; $('#rt').innerHTML = h; };
}
function memoBand(mid, dayId, at, deepX) {
  const m = memoById(mid); if (!m) return '';
  const { rep, others } = memoRel(m), cur = at ? at.split(':') : null;
  const isCur = i => (deepX != null && i.x && i.day === dayId && i.k === +deepX && !cur) || (cur && i.pid === cur[0] && +cur[1] >= i.a && +cur[1] <= i.b) || (i.inX && deepX != null && cur && i.inX.k === +deepX && i.pid === cur[0]);
  const all = (rep ? [rep] : []).concat(others).sort((x, y) => bkey(x.p.code, x.p.ch, x.a) - bkey(y.p.code, y.p.ch, y.a)).filter(i => !isCur(i));
  return `<div class="mband" id="mband"><button class="mb-back" data-mb="${mid}">메모로 돌아가기 ›</button>${all.length ? `<div class="rchips">${all.map(i => `<button class="${i.x ? 'xchip' : ''}" data-go="${relHref(i, mid)}" data-rep="${i === rep ? 1 : ''}">${i === rep ? icon('flag', 'i fl') : ''}${esc(relLabel(i))}</button>`).join('')}</div>` : ''}</div>`;
}
function bindBand() { const b = $('[data-mb]'); if (b) b.onclick = () => go(`#/memo/${b.dataset.mb}`); }

/* ---------- Memo 목차 (분류별) ---------- */
let mOpen = null, mQuery = '';
function memoRow(m, cat) {
  const main = catsOf(m)[0], a = (m.anchors || [])[0], st = styleShort(m);
  const badge = cat && main && main !== cat ? `<span class="cbadge">${esc(main)}</span>` : '';
  return `<button class="mit" data-go="#/memo/${m.id}"><span class="mt">${esc(m.title || '(제목 없음)')}${st ? ` <span class="tag style">${st}</span>` : ''}</span>${badge}<span class="mm2">${a ? esc(m.ref || a.ref) + ' · ' : ''}${memoDates(m)}</span></button>`;
}
function vMemoList() {
  const ms = allMemos().slice().sort(memoSort), cats = catList();
  if (!mOpen) mOpen = {};
  const groups = cats.map(c => [c, ms.filter(m => catsOf(m).includes(c))]);
  const un = ms.filter(m => !catsOf(m).length);
  if (un.length) groups.push(['미분류', un]);
  const allOpen = groups.every(([c]) => mOpen[c]);
  const list = `<div class="card mtoc">${groups.map(([c, arr]) => `<button class="crow ${mOpen[c] ? 'open' : ''}" data-cat="${esc(c)}"><span>${esc(c)}</span><span class="cnt">${arr.length}${fx(mOpen[c])}</span></button>${mOpen[c] ? `<div class="cbody">${arr.length ? arr.map(m => memoRow(m, c)).join('') : '<div class="empty small">아직 이 분류에 넣은 메모가 없습니다.</div>'}</div>` : ''}`).join('')}
      <button class="crow add" id="addcat"><span>＋ 분류 추가</span></button></div>`;
  $('#app').innerHTML = `<div class="screen">${bar('메모', 'back', { findOnly: true, ic: 'memos' })}<div class="body">
    <div class="mhead"><b>Memo · 묵상&amp;연구</b><span class="row"><button class="btn sm" data-go="#/edit/new">${icon('pen')}새 메모</button><button class="xall" id="mx" aria-label="${allOpen ? '모두 접기' : '모두 펼치기'}">${icon(allOpen ? 'collapse' : 'expand')}</button></span></div>
    ${list}</div>${nav('memo', { ctx: 'memo', sort: true })}</div>`;
  $('#mx').onclick = () => { mOpen = {}; if (!allOpen) groups.forEach(([c]) => mOpen[c] = true); vMemoList(); };
  $$('[data-cat]').forEach(b => b.onclick = () => { mOpen[b.dataset.cat] = !mOpen[b.dataset.cat]; const y = scrollY; vMemoList(); scrollTo(0, y); });
  if ($('#addcat')) $('#addcat').onclick = () => addCat(vMemoList);
}
function addCat(after) {
  const n = (prompt('새 분류 이름') || '').trim();
  if (!n) return;
  if (catList().includes(n) || n === '미분류') { toast('이미 있는 분류입니다.'); return; }
  ST.cats.push(n); save(); after && after();
}

/* ---------- 메모 보기 ---------- */
async function vMemo(id) {
  const m = memoById(id);
  if (!m) return go('#/memos', true);
  await loadAll();
  const st = styleShort(m), cs = catsOf(m);
  const badges = (cs.length ? cs.map(c => `<button class="tag cat" data-pick>${esc(c)}</button>`).join('') : '<button class="tag cat un" data-pick>미분류</button>') + (st ? `<span class="tag style">${st}</span>` : '');
  const hasOrig = !!m.orig, onlyOrig = hasOrig && !m.html;
  $('#app').innerHTML = `<div class="screen">${bar('메모', 'back', { findOnly: true, ic: 'memos' })}
    <div class="body memo">
      <div class="row between"><span class="lab">${memoDates(m)}</span><span class="row" style="gap:5px">${badges}</span></div>
      <h1>${esc(m.title || '(제목 없음)')}</h1>
      ${memoHeadHTML(m)}
      ${hasOrig && !onlyOrig ? `<div class="seg" id="ov"><button data-v="t" class="on">폰으로 보기</button><button data-v="o">원본 보기</button></div>` : ''}
      <div class="mbody ${ST.mind && ST.mind[m.id] === false ? 'noind' : ''}" id="mb">${onlyOrig ? m.orig : htmlOf(m)}</div>
      <div class="funread" id="fun" hidden></div>
      <div class="row" style="justify-content:center;gap:10px;margin-top:8px">
        <button class="quiet" id="mcopy">${icon('copy')}복사</button><button class="quiet" id="mshare">${icon('share')}공유</button>
        ${m.builtin ? '' : `<button class="quiet" data-go="#/edit/${m.id}">${icon('pen')}고치기</button><button class="quiet" id="mdel">${icon('x')}지우기</button>`}
      </div>
    </div>${nav('memo', { ctx: 'memo' })}</div>`;
  if ($('#ov')) $('#ov').onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('#ov button').forEach(x => x.classList.toggle('on', x === b)); $('#mb').innerHTML = b.dataset.v === 'o' ? m.orig : htmlOf(m); if (b.dataset.v !== 'o') applyFolds(m); memoEnhance(m); };
  $$('[data-pick]').forEach(b => b.onclick = () => catPicker(m, () => vMemo(id)));
  bindMemoHead(m);
  if (!onlyOrig) { applyFolds(m); bindMemoMenu(m); }
  const text = () => `${m.title || ''}\n${(m.anchors || []).map(a => a.ref).join(', ')}\n\n${$('#mb').innerText}`.trim();
  $('#mcopy').onclick = () => { copy(text()); toast('메모를 복사했습니다.'); };
  $('#mshare').onclick = () => share(text());
  if ($('#mdel')) $('#mdel').onclick = async () => { if (!confirm('이 메모를 지울까요? 되돌릴 수 없습니다.')) return; UM = UM.filter(x => x.id !== m.id); await saveUM(); toast('메모를 지웠습니다.'); go('#/memos', true); };
  memoEnhance(m);
}
function catPicker(m, after) {
  let sel = catsOf(m).slice();
  const draw = () => {
    const sh = $('#sheet');
    sh.innerHTML = `<div class="what">분류 고르기 (여러 개 가능 · 처음 고른 것이 주 분류)</div>
      <div class="catchips">${catList().map(c => `<button class="${sel.includes(c) ? 'on' : ''}" data-c="${esc(c)}">${sel.includes(c) ? `<b>${sel.indexOf(c) + 1}</b> ` : ''}${esc(c)}</button>`).join('')}<button data-add>＋ 분류 추가</button></div>
      <div style="text-align:center"><button class="btn dark" id="cok">확인</button></div>`;
    showSheet();
    $$('[data-c]', sh).forEach(b => b.onclick = () => { const c = b.dataset.c; sel = sel.includes(c) ? sel.filter(x => x !== c) : sel.concat(c); draw(); });
    $('[data-add]', sh).onclick = () => addCat(draw);
    $('#cok', sh).onclick = async () => {
      if (m.builtin) { ST.mcat[m.id] = sel; save(); }
      else { m.cats = sel; m.updated = new Date().toISOString(); await saveUM(); }
      hideSheet(); after && after();
    };
  };
  draw();
}
function findPidIdx(dayId, v, ref) { const d = D.days[dayId], r = ref && String(ref).match(/^(\S+)\s+(\d+):/); let j = r ? d.p.findIndex(p => p.abbr === r[1] && p.ch === +r[2] && v >= p.vs && v <= p.ve) : -1; if (j < 0) j = d.p.findIndex(p => v >= p.vs && v <= p.ve); return j + 1; }
function shortAt(a) { const d = D.days[a.day], p = d.p[findPidIdx(a.day, a.v) - 1]; return `${p.abbr} ${p.ch}:${a.v}`; }

/* ---------- 메모 화면 보강: 표 → 행별 카드, 사진 확대 보기, 가운데 톡 → 읽기 메뉴 ---------- */
function memoEnhance(m) {
  const mb = $('#mb'); if (!mb) return;
  $$('table', mb).forEach(tb => {
    if (tb.dataset.carded || tb.closest('.gen')) return;
    const rows = Array.from(tb.rows); if (rows.length < 2) return;
    const head = Array.from(rows[0].cells).map(c => c.textContent.trim()); if (head.length < 3) return;
    const box = document.createElement('div'); box.className = 'tcards gen';
    box.innerHTML = rows.slice(1).map(r => { const c = Array.from(r.cells); if (!c.length) return ''; return `<details class="tcard"><summary><b>${c[0].innerHTML}</b>${c[1] && head.length > 3 ? `<span>${c[1].innerHTML}</span>` : ''}</summary><dl>${c.slice(head.length > 3 ? 2 : 1).map((x, k) => `<dt>${esc(head[(head.length > 3 ? 2 : 1) + k] || '')}</dt><dd>${x.innerHTML}</dd>`).join('')}</dl></details>`; }).join('');
    tb.before(box); tb.hidden = true; tb.dataset.carded = '1';
  });
  applyFolds(m);
  $$('img', mb).forEach(img => { img.onclick = e => { e.stopPropagation(); imgView(img.src); }; img.oncontextmenu = e => e.preventDefault(); });
  if (!mb._tap) {
    mb._tap = 1;
    mb.addEventListener('click', e => {
      if (hasSel() || MM_HELD || !$('#mmenu').hidden || Date.now() - lastMemoSel < 900) return;
      if (e.target.closest('.fold,a,img,button,sup,summary,.tcard,.pnote')) return;
      const x = e.clientX / innerWidth; if (x < .2 || x > .8) return;
      readPanel(null, false, true);
    });
  }
}
function imgView(src) { // 앱 안에서 사진 크게 보기: 두 손가락 확대·끌어서 이동·두 번 톡 확대
  let v = $('#imgv'); if (!v) { v = document.createElement('div'); v.id = 'imgv'; v.className = 'imgv'; v.hidden = true; document.body.appendChild(v); }
  v.innerHTML = `<button class="ivb" aria-label="닫기">${icon('back')}</button><div class="ivs"><img src="${src}" alt=""></div><div class="ivhint"><span class="ivx">⤢</span>두 손가락으로 벌리면 확대됩니다</div>`;
  openOverlay(v, () => { v.innerHTML = ''; });
  const img = $('img', v); let sc = 1, tx = 0, ty = 0; const pts = new Map(); let d0 = 0, s0 = 1, last = 0, px = 0, py = 0;
  const ap = () => { img.style.transform = `translate(${tx}px,${ty}px) scale(${sc})`; };
  $('.ivb', v).onclick = () => closeOverlay();
  setTimeout(() => { const h = $('.ivhint', v); if (h) h.classList.add('fade'); }, 2600);
  const s = $('.ivs', v);
  s.onpointerdown = e => { s.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); s0 = sc; } px = e.clientX; py = e.clientY;
    if (pts.size === 1 && Date.now() - last < 300) { sc = sc > 1 ? 1 : 2.5; if (sc === 1) { tx = 0; ty = 0; } ap(); } last = Date.now(); };
  s.onpointermove = e => { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; sc = Math.max(1, Math.min(6, s0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / d0)); ap(); }
    else if (sc > 1) { tx += e.clientX - px; ty += e.clientY - py; px = e.clientX; py = e.clientY; ap(); } };
  s.onpointerup = s.onpointercancel = e => { pts.delete(e.pointerId); if (sc <= 1) { tx = 0; ty = 0; ap(); } };
}

/* ---------- 메모 쓰기·고치기 ---------- */
async function vEdit(id, at) {
  await loadAll();
  const isNew = id === 'new' || !id;
  const m = isNew ? { id: 'u' + Date.now().toString(36), title: '', html: '', cats: [], anchors: [], style: '', created: new Date().toISOString(), updated: new Date().toISOString() } : UM.find(x => x.id === id);
  if (!m) return go('#/memos', true);
  let cats = (m.cats || []).slice(), anchors = (m.anchors || []).slice();
  const q = new URLSearchParams(location.hash.split('?')[1] || '').get('q');
  if (isNew && at) { const [pid, v] = at.split(':'), day = pid.split('-p')[0], d = D.days[day], p = d.pp[+pid.split('-p')[1] - 1]; anchors = [{ day, v: +v, ref: `${p.abbr} ${p.ch}:${v}` }]; }
  const quote = isNew && anchors[0] ? (() => { const a = anchors[0], pid = `${a.day}-p${findPidIdx(a.day, a.v)}`; const t = q || vtext(pid, a.v); return `<blockquote class="vquote">${esc(q ? `“${t}”` : t)}<br><small>${esc(a.ref)} (개역개정)</small></blockquote><p><br></p>`; })() : '';
  $('#app').innerHTML = `<div class="screen">${bar(isNew ? '새 메모' : '메모 고치기', 'back', { tools: false })}
    <div class="body memo edit">
      <div class="anch">${anchors.map(a => `<span class="achip">${esc(a.ref)} · ${locLabel(a.day)}</span>`).join('') || '<span class="lab">관련 구절 없이 쓰는 메모</span>'}</div>
      <input class="field ttl" id="et" placeholder="제목" value="${esc(m.title)}">
      <div class="catline" id="ec"></div>
      <div class="tbar" id="tb">
        <button data-cmd="h2" aria-label="큰 제목">제목</button><button data-cmd="h3" aria-label="소제목">소제목</button>
        <button data-cmd="bold" aria-label="굵게"><b>B</b></button><button data-cmd="quote" aria-label="인용">“ ”</button>
        <button data-cmd="ul" aria-label="목록">• 목록</button><button data-cmd="fold" aria-label="접기 제목">⌄ 접기</button><button data-cmd="clear" aria-label="서식 지우기">${icon('er')}</button>
      </div>
      <div class="mbody ed" id="eb" contenteditable="true" data-ph="여기에 쓰거나, AI의 답을 복사해 붙여 넣으세요.">${isNew ? quote : m.html}</div>
      <div class="small">AI 답을 붙여 넣으면 제목·굵게·인용·목록·표·그림을 최대한 그대로 살립니다. 답에 “요약”과 “상세”가 있으면 어디를 접을지 묻습니다. “⌄ 접기”는 커서가 있는 줄을 접기 제목으로 만듭니다.</div>
      <div style="text-align:center"><button class="btn dark" id="es">${icon('check')}저장</button></div>
    </div></div>`;
  const drawCats = () => { $('#ec').innerHTML = (cats.length ? cats.map(c => `<span class="tag cat">${esc(c)}</span>`).join('') : '<span class="tag cat un">미분류</span>') + ' <button class="lab" id="ecp">분류 고르기 ›</button>'; $('#ecp').onclick = () => catPicker({ id: m.id, cats, builtin: false, _tmp: true }, null); };
  drawCats();
  // 분류 고르기: 임시 객체로 받고 화면만 갱신
  const origSaveUM = saveUM;
  catPickerTemp = sel => { cats = sel; drawCats(); };
  const eb = $('#eb');
  $('#tb').onmousedown = e => e.preventDefault();
  $('#tb').onclick = e => {
    const b = e.target.closest('[data-cmd]'); if (!b) return; eb.focus();
    const c = b.dataset.cmd;
    if (c === 'bold') document.execCommand('bold');
    else if (c === 'ul') document.execCommand('insertUnorderedList');
    else if (c === 'clear') { document.execCommand('removeFormat'); document.execCommand('formatBlock', false, 'p'); }
    else if (c === 'fold') { const r = getSelection().rangeCount && getSelection().getRangeAt(0); if (r && eb.contains(r.startContainer)) blockHeading(eb, r, 'H3', 'fold'); }
    else document.execCommand('formatBlock', false, c === 'quote' ? 'blockquote' : c);
  };
  eb.addEventListener('paste', e => { e.preventDefault(); handlePaste(e.clipboardData, eb); });
  const snap0 = () => $('#et').value + '\u0001' + eb.innerHTML + '\u0001' + cats.join(','), first = snap0(), here = location.hash;
  LEAVE_GUARD = () => { // 저장 안 한 채 뒤로 가면 묻기
    if (!$('#eb') || snap0() === first) return false;
    history.pushState({ top: 1 }, '', here);
    const md = $('#modal');
    md.innerHTML = `<div class="card"><b>저장하지 않은 내용이 있습니다</b><div class="row" style="justify-content:center"><button class="btn dark" data-l="save">저장하고 나가기</button><button class="btn" data-l="out">저장 안 하고 나가기</button></div><button class="lab" data-l="stay">계속 쓰기</button></div>`;
    md.hidden = false;
    $$('[data-l]', md).forEach(b => b.onclick = () => { md.hidden = true; const k = b.dataset.l; if (k === 'save') $('#es').click(); if (k === 'out') { LEAVE_GUARD = null; history.back(); } });
    return true;
  };
  $('#es').onclick = async () => {
    const html = cleanHTML(eb.innerHTML).trim();
    const title = $('#et').value.trim() || (eb.innerText.trim().split('\n').find(x => x.trim() && !x.includes('(개역개정)')) || '').slice(0, 40);
    if (!html && !title) { toast('빈 메모는 저장하지 않습니다.'); return; }
    Object.assign(m, { title, html, cats, anchors, ref: anchors[0] ? anchors[0].ref : '', updated: new Date().toISOString() });
    if (isNew) UM.push(m);
    await origSaveUM(); LEAVE_GUARD = null;
    if (isNew && at) { RETURN_AT = { day: at.split(':')[0].split('-p')[0], at }; history.back(); setTimeout(() => toastGo('메모를 저장했습니다 · 메모 보기 ›', `#/memo/${m.id}`), 400); return; } // 읽다가 쓴 메모: 읽던 구절로
    toast('메모를 저장했습니다.'); go(`#/memo/${m.id}`, true);
  };
}
let catPickerTemp = null;
// catPicker가 임시 객체(_tmp)면 저장 대신 화면에 돌려준다
const _catPicker = catPicker;
catPicker = function (m, after) {
  if (!m._tmp) return _catPicker(m, after);
  let sel = (m.cats || []).slice();
  const draw = () => {
    const sh = $('#sheet');
    sh.innerHTML = `<div class="what">분류 고르기 (여러 개 가능 · 처음 고른 것이 주 분류)</div>
      <div class="catchips">${catList().map(c => `<button class="${sel.includes(c) ? 'on' : ''}" data-c="${esc(c)}">${sel.includes(c) ? `<b>${sel.indexOf(c) + 1}</b> ` : ''}${esc(c)}</button>`).join('')}<button data-add>＋ 분류 추가</button></div>
      <div style="text-align:center"><button class="btn dark" id="cok">확인</button></div>`;
    showSheet();
    $$('[data-c]', sh).forEach(b => b.onclick = () => { const c = b.dataset.c; sel = sel.includes(c) ? sel.filter(x => x !== c) : sel.concat(c); draw(); });
    $('[data-add]', sh).onclick = () => addCat(draw);
    $('#cok', sh).onclick = () => { hideSheet(); catPickerTemp && catPickerTemp(sel); };
  };
  draw();
};

/* ---------- 붙여 넣기: 서식 살리기 · 요약/자세히 나누기 ---------- */
const OK_TAGS = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'IMG', 'HR', 'A', 'MARK', 'CODE', 'PRE', 'SMALL', 'SUP', 'SUB', 'FIGURE', 'FIGCAPTION', 'DIV', 'SPAN', 'FONT']);
function cleanHTML(html) {
  const tpl = document.createElement('template'); tpl.innerHTML = html;
  const walk = el => {
    for (const n of Array.from(el.childNodes)) {
      if (n.nodeType === 8) { n.remove(); continue; }
      if (n.nodeType !== 1) continue;
      if (['SCRIPT', 'STYLE', 'META', 'LINK', 'IFRAME', 'OBJECT', 'BUTTON', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'NOSCRIPT'].includes(n.tagName)) { n.remove(); continue; }
      walk(n);
      if (!OK_TAGS.has(n.tagName)) { n.replaceWith(...n.childNodes); continue; }
      for (const a of Array.from(n.attributes)) {
        const k = a.name.toLowerCase();
        const keep = (n.tagName === 'A' && k === 'href' && /^https?:/i.test(a.value)) || (n.tagName === 'IMG' && k === 'src' && /^(https?:|data:image\/)/i.test(a.value)) || (n.tagName === 'IMG' && k === 'alt') || (['TD', 'TH'].includes(n.tagName) && (k === 'colspan' || k === 'rowspan')) || (k === 'class' && ['vquote', 'fold', 'pnote', 'pnm', 'memo-sub'].includes(a.value)) || (k === 'data-note' && n.classList.contains('pnote')) || (n.tagName === 'FONT' && k === 'face') || (k === 'style' && (a.value = a.value.split(';').filter(x => /^\s*(background-color|font-family|text-align|text-indent|font-weight|text-decoration|text-decoration-line)\s*:/.test(x)).join(';')) !== '');
        if (!keep) n.removeAttribute(a.name);
      }
      if (n.tagName === 'A') { n.setAttribute('target', '_blank'); n.setAttribute('rel', 'noopener'); }
      if (n.tagName === 'FONT') { const sp = document.createElement('span'); if (n.getAttribute('face')) sp.style.fontFamily = n.getAttribute('face'); sp.append(...n.childNodes); n.replaceWith(sp); continue; }
      if (n.tagName === 'SPAN' && !n.attributes.length) n.replaceWith(...n.childNodes);
    }
  };
  walk(tpl.content);
  return tpl.innerHTML.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');
}
const curly = s => s.replace(/(^|[\s(\[{>])"/g, '$1“').replace(/"/g, '”').replace(/(^|[\s(\[{>])'/g, '$1‘').replace(/'/g, '’');
function inlineMD(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>'); }
function mdToHTML(md) {
  const L = md.replace(/\r/g, '').split('\n'); let h = '', i = 0;
  while (i < L.length) {
    let l = L[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { const n = Math.min(4, m[1].length + 1); h += `<h${n}>${inlineMD(curly(m[2]))}</h${n}>`; i++; continue; }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(l)) { h += '<hr>'; i++; continue; }
    if (/^\s*\|.*\|\s*$/.test(l)) {
      const rows = []; while (i < L.length && /^\s*\|.*\|\s*$/.test(L[i])) { rows.push(L[i]); i++; }
      const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const body = rows.filter(r => !/^\s*\|?\s*:?-{2,}/.test(r));
      h += '<table>' + body.map((r, k) => '<tr>' + cells(r).map(c => k === 0 ? `<th>${inlineMD(curly(c))}</th>` : `<td>${inlineMD(curly(c))}</td>`).join('') + '</tr>').join('') + '</table>'; continue;
    }
    if (/^\s*>/.test(l)) { const q = []; while (i < L.length && /^\s*>/.test(L[i])) { q.push(L[i].replace(/^\s*>\s?/, '')); i++; } h += `<blockquote>${mdToHTML(q.join('\n'))}</blockquote>`; continue; }
    if (/^\s*([-*•]|\d+[.)])\s+/.test(l)) {
      const ol = /^\s*\d/.test(l), it = [];
      while (i < L.length && /^\s*([-*•]|\d+[.)])\s+/.test(L[i])) { it.push(L[i].replace(/^\s*([-*•]|\d+[.)])\s+/, '')); i++; }
      h += `<${ol ? 'ol' : 'ul'}>${it.map(x => `<li>${inlineMD(curly(x))}</li>`).join('')}</${ol ? 'ol' : 'ul'}>`; continue;
    }
    const para = []; while (i < L.length && L[i].trim() && !/^(#{1,6}\s|\s*>|\s*\||\s*([-*•]|\d+[.)])\s)/.test(L[i])) { para.push(L[i]); i++; }
    h += `<p>${para.map(x => inlineMD(curly(x))).join('<br>')}</p>`;
  }
  return h;
}
function splitAnswer(html) { // AI 답의 “요약” / “상세”(예전 “자세히 살펴보기”) 표지 찾기
  const tpl = document.createElement('template'); tpl.innerHTML = html;
  const top = Array.from(tpl.content.children);
  const norm = el => el.textContent.replace(/[\s*#:：]/g, '');
  const a = top.findIndex(el => norm(el) === '요약'), b = top.findIndex(el => ['상세', '자세히살펴보기'].includes(norm(el)));
  if (a < 0 || b < 0 || b < a) return null;
  return { tpl, top, a, b };
}
function markFolds(parts, which) { // which: sum | det | all
  const { tpl, top, a, b } = parts, H = el => /^H[1-6]$/.test(el.tagName);
  const mk = el => { const h = document.createElement('h3'); h.className = 'fold'; h.innerHTML = el.innerHTML; el.replaceWith(h); return h; };
  if (which === 'sum' || which === 'all') { const t = top.slice(a + 1, b).find(H); if (t) mk(t); }
  if (which === 'det' || which === 'all') {
    const hs = top.slice(b + 1).filter(H), num = hs.filter(h => /^\s*\d+\s*[.)]/.test(h.textContent));
    (num.length ? num : hs.slice(1)).forEach(mk);
  }
  return tpl.innerHTML;
}
function handlePaste(cd, eb) {
  let html = cd.getData('text/html'), text = cd.getData('text/plain');
  html = html ? cleanHTML(html) : mdToHTML(text || '');
  const ins = h => {
    eb.focus();
    const sel = getSelection();
    if (!sel.rangeCount || !eb.contains(sel.anchorNode) || (eb.querySelector('.vquote') && eb.querySelector('.vquote').contains(sel.anchorNode))) {
      const r = document.createRange(); r.selectNodeContents(eb); r.collapse(false); sel.removeAllRanges(); sel.addRange(r);
    }
    document.execCommand('insertHTML', false, h);
  };
  const parts = splitAnswer(html);
  if (!parts) return ins(html);
  const m = $('#modal'), pick = ST.foldPick || 'det';
  m.innerHTML = `<div class="card"><b>접기 기능을 사용할 수 있습니다</b>
    <div class="row" style="justify-content:center">${[['sum', '요약만'], ['det', '상세만'], ['all', '모두']].map(([k, t]) => `<button class="btn ${k === pick ? 'dark' : ''}" data-f="${k}">${t}</button>`).join('')}</div>
    <button class="lab" data-f="none">접지 않고 그대로 넣기</button></div>`;
  m.hidden = false;
  $$('[data-f]', m).forEach(b => b.onclick = () => { m.hidden = true; const f = b.dataset.f; if (f !== 'none') { ST.foldPick = f; save(); } ins(f === 'none' ? html : markFolds(parts, f)); });
}

/* ---------- 접기 칸 ---------- */
function htmlOf(m) { return m.builtin ? (MO[m.id] || m.html) : m.html; }
const isHead = el => el && /^H[1-6]$/.test(el.tagName);
function applyFolds(m) {
  const mb = $('#mb'); if (!mb) return;
  $$(':scope > p', mb).forEach(p => { if (/^(요약|상세|자세히 살펴보기|더 알아보기)$/.test(p.textContent.replace(/[\s*:：]/g, ' ').trim())) p.classList.add('mlabel'); });
  const read = new Set(ST.fread[m.id] || []), heads = $$('.fold', mb);
  heads.forEach((h, i) => {
    h.dataset.fi = i; h.classList.toggle('done', read.has(i));
    const open = h.classList.contains('open');
    for (let n = h.nextElementSibling; n && !isHead(n); n = n.nextElementSibling) n.hidden = !open || n.dataset.carded === '1';
  });
  const fun = $('#fun'); if (!fun) return;
  const left = heads.filter((h, i) => !read.has(i));
  fun.hidden = !heads.length;
  fun.innerHTML = heads.length ? (left.length ? `아직 안 읽은 항목 · ${left.map(h => `<button data-fj="${h.dataset.fi}">${esc(h.textContent.trim().slice(0, 18))}</button>`).join(' · ')}` : '접은 항목을 모두 읽었습니다 ✓') : '';
  $$('[data-fj]', fun).forEach(b => b.onclick = () => { const h = $(`.fold[data-fi="${b.dataset.fj}"]`, mb); toggleFold(m, h, true); h.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  if (!mb._fold) { mb._fold = 1; mb.addEventListener('click', e => { const h = e.target.closest('.fold'); if (h && !hasSel()) toggleFold(m, h); }); }
}
function toggleFold(m, h, force) {
  const open = force != null ? force : !h.classList.contains('open');
  h.classList.toggle('open', open);
  if (open) { const r = new Set(ST.fread[m.id] || []); r.add(+h.dataset.fi); ST.fread[m.id] = [...r]; save(); }
  applyFolds(m);
}
function blockOf(root, node) { let n = node.nodeType === 1 ? node : node.parentElement; while (n && n.parentElement !== root) { if (n.tagName === 'LI') return n; n = n.parentElement; } return n; }
function blockHeading(root, range, tag, cls) { // 고른 글자만 제목으로 (문단 중간이면 앞·뒤를 나눔), 같은 제목이면 풀기
  const blk = blockOf(root, range.startContainer); if (!blk || blk === root) return false;
  const same = blk.tagName === tag && (cls ? blk.classList.contains(cls) : !blk.classList.contains('fold'));
  if (same) { const p = document.createElement('p'); p.innerHTML = blk.innerHTML; blk.replaceWith(p); return true; }
  const pre = document.createRange(); pre.setStart(blk, 0); pre.setEnd(range.startContainer, range.startOffset);
  const post = document.createRange(); post.setStart(range.endContainer, range.endOffset); post.setEnd(blk, blk.childNodes.length);
  const sel = range.cloneRange(); if (!blk.contains(range.endContainer)) sel.setEnd(blk, blk.childNodes.length);
  const mkEl = (t, frag) => { const e = document.createElement(t); e.appendChild(frag); return e; };
  const out = [];
  if (pre.toString().trim()) out.push(mkEl(blk.tagName === 'LI' ? 'P' : blk.tagName, pre.cloneContents()));
  const h = mkEl(tag, (sel.toString().trim() ? sel : (() => { const r = document.createRange(); r.selectNodeContents(blk); return r; })()).cloneContents()); if (cls) h.className = cls; out.push(h);
  if (blk.contains(range.endContainer) && post.toString().trim()) out.push(mkEl(blk.tagName === 'LI' ? 'P' : blk.tagName, post.cloneContents()));
  blk.replaceWith(...out); return true;
}

/* ---------- 저장된 메모 읽기 화면: 글자 선택 메뉴 (MRAe 발췌문 메뉴와 같게, 4번은 접기) ---------- */
let MM = null; // { m, range, undo:[], redo:[], panel }
function memoSaveHTML(m) {
  const mb = $('#mb'), c = mb.cloneNode(true);
  $$('.gen', c).forEach(n => n.remove()); $$('[data-carded]', c).forEach(n => n.removeAttribute('data-carded'));
  $$('[hidden]', c).forEach(n => n.removeAttribute('hidden')); $$('.fold', c).forEach(h => { h.classList.remove('open', 'done'); h.removeAttribute('data-fi'); if (!h.className) h.removeAttribute('class'); });
  const html = c.innerHTML;
  if (m.builtin) { MO[m.id] = html; idbSet('mo', MO); } else { m.html = html; m.updated = new Date().toISOString(); saveUM(); }
}
function memoSnap() { MM.undo.push($('#mb').innerHTML); if (MM.undo.length > 60) MM.undo.shift(); MM.redo = []; }
function memoOp(fn) {
  const mb = $('#mb'); if (!MM || !MM.range) return;
  memoSnap();
  mb.style.userSelect = 'text'; mb.style.webkitUserSelect = 'text'; mb.contentEditable = 'true'; const s = getSelection(); s.removeAllRanges(); s.addRange(MM.range);
  document.execCommand('styleWithCSS', false, true);
  try { fn(mb, MM.range); } finally { mb.contentEditable = 'false'; mb.style.userSelect = ''; mb.style.webkitUserSelect = ''; }
  getSelection().removeAllRanges(); hideMemoMenu(); memoSaveHTML(MM.m); applyFolds(MM.m);
}
function blocksIn(mb, r) { const a = blockOf(mb, r.startContainer), b = blockOf(mb, r.endContainer), all = Array.from(mb.children); const i = all.indexOf(a), j = all.indexOf(b); return i < 0 ? [] : all.slice(i, (j < 0 ? i : j) + 1); }
function memoMenuHTML() {
  const B = (k, inner, lab, on) => `<button data-mo="${k}" class="${on ? 'on' : ''}" aria-label="${lab}">${inner}</button>`;
  const can = MM && MM.undo.length, canR = MM && MM.redo.length;
  return `<div class="mr r7">${B('hl', icon('hl') + '<i class="hlbar"></i>', '하이라이트')}${B('b', '<b class="bg">B</b>', '굵게', document.queryCommandState && false)}${B('u', '<u class="bg">U</u>', '밑줄')}${B('fold', '<span class="fg">⌄</span><small>접기</small>', '접기')}${B('note', icon('note'), '부분 메모')}${B('copy', icon('copy'), '복사')}${B('share', icon('sharedown'), '공유·다운로드')}</div>
    <div class="mr r8">${B('h2', '<span class="hg big"></span>', '대제목')}${B('h3', '<span class="hg"></span>', '소제목')}${B('align', icon('alignc'), '맞춤')}${B('font', '<span class="aa">Aa</span>', '글꼴')}${B('indent', icon('indent'), '들여쓰기')}${B('clear', icon('er'), '서식 지우기')}${B('undo', icon('undo'), '되돌리기').replace('<button', `<button ${can ? '' : 'disabled'}`)}${B('redo', icon('redo'), '다시 하기').replace('<button', `<button ${canR ? '' : 'disabled'}`)}</div>
    <div class="mpanel" id="mpanel" hidden></div>`;
}
function hideMemoMenu() { const x = $('#mmenu'); if (x) { x.hidden = true; x.innerHTML = ''; } MM_HELD = false; try { CSS.highlights && CSS.highlights.delete('pick'); } catch (e) {} }
let MM_HELD = false, lastMemoSel = 0;
function placeMemoMenu() {
  const x = $('#mmenu'); if (!x || x.hidden || !MM || !MM.range) return;
  const r = MM.range.getBoundingClientRect(), w = Math.min(innerWidth - 16, 520), h = x.offsetHeight, barH = 56;
  // 고른 글을 가리지 않게: 아래 공간이 넉넉하면 아래, 아니면 위
  let top = r.bottom + 12;
  if (top + h > innerHeight - 70) top = r.top - h - 12;
  if (top < barH) { window.scrollBy(0, r.bottom + 12 + h - (innerHeight - 70)); const r2 = MM.range.getBoundingClientRect(); top = Math.max(barH, r2.bottom + 12); }
  x.style.width = w + 'px'; x.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px'; x.style.top = top + 'px';
}
function bindMemoMenu(m) {
  MM = { m, range: null, undo: [], redo: [] };
  let t;
  const onSel = () => { clearTimeout(t); t = setTimeout(function hold() {
    const mb = $('#mb'), s = getSelection(); if (!mb || !MM || MM.m !== m) return;
    if (!hasSel() || !mb.contains(s.anchorNode) || !mb.contains(s.focusNode)) { if (MM_HELD) return; if (!($('#mmenu') && $('#mmenu').contains(document.activeElement))) hideMemoMenu(); return; }
    if (touching) { t = setTimeout(hold, 200); return; } // 손을 뗀 뒤에
    lastMemoSel = Date.now();
    MM.range = s.getRangeAt(0).cloneRange();
    if (window.CSS && CSS.highlights && typeof Highlight !== 'undefined') { CSS.highlights.set('pick', new Highlight(MM.range)); MM_HELD = true; s.removeAllRanges(); }
    const x = $('#mmenu'); x.innerHTML = memoMenuHTML(); x.hidden = false; placeMemoMenu(); bindMemoMenuBtns();
  }, 900); };
  document.removeEventListener('selectionchange', MM_SEL); MM_SEL = onSel; document.addEventListener('selectionchange', onSel);
  const mb0 = $('#mb'); if (mb0) ownSelect(mb0, {
    accept: n => !!(n.nodeType === 3 ? n.parentElement : n).closest('#mb'),
    skip: tg => !!tg.closest('img,button,summary,a'),
    start: () => hideMemoMenu(),
    done: rg => { if (!MM || !rg || rg.collapsed) return; lastMemoSel = Date.now(); MM.range = rg.cloneRange(); MM_HELD = true; try { CSS.highlights.set('pick', new Highlight(MM.range)); } catch (e) {} const x = $('#mmenu'); x.innerHTML = memoMenuHTML(); x.hidden = false; placeMemoMenu(); bindMemoMenuBtns(); },
  });
}
let MM_SEL = () => {};
function memoPanel(html) { const p = $('#mpanel'); p.innerHTML = html; p.hidden = false; placeMemoMenu(); return p; }
function bindMemoMenuBtns() {
  const x = $('#mmenu'), m = MM.m;
  x.onmousedown = e => e.preventDefault();
  $$('[data-mo]', x).forEach(b => b.onclick = () => {
    const k = b.dataset.mo, txt = MM.range.toString();
    if (k === 'b') return memoOp(() => document.execCommand('bold'));
    if (k === 'u') return memoOp(() => document.execCommand('underline'));
    if (k === 'h2' || k === 'h3') return memoOp((mb, r) => blockHeading(mb, r, k.toUpperCase(), null));
    if (k === 'fold') return memoOp((mb, r) => blockHeading(mb, r, 'H3', 'fold'));
    if (k === 'copy') { copy(`“${txt.trim()}”\n— ${m.title || '메모'} (${APPNAME})`); toast('복사했습니다.'); getSelection().removeAllRanges(); return hideMemoMenu(); }
    if (k === 'undo' || k === 'redo') { const from = k === 'undo' ? MM.undo : MM.redo, to = k === 'undo' ? MM.redo : MM.undo; if (!from.length) return; to.push($('#mb').innerHTML); $('#mb').innerHTML = from.pop(); memoSaveHTML(m); applyFolds(m); getSelection().removeAllRanges(); return hideMemoMenu(); }
    if (k === 'hl') {
      const p = memoPanel(`<div class="prow">${HL.map((c, i) => `<button class="dot" style="background:${c}" data-c="${c}" aria-label="${HL_NAME[i]}"></button>`).join('')}<button class="ptxt" data-c="x">서식 삭제</button></div>`);
      $$('[data-c]', p).forEach(c => c.onclick = () => memoOp(() => { if (c.dataset.c === 'x') document.execCommand('removeFormat'); else document.execCommand('hiliteColor', false, c.dataset.c); }));
      return;
    }
    if (k === 'align') {
      const p = memoPanel(`<div class="prow">${[['left', '왼쪽'], ['center', '가운데'], ['right', '오른쪽'], ['justify', '양쪽'], ['', '기본']].map(([v, t]) => `<button class="ptxt" data-a="${v}">${t}</button>`).join('')}</div>`);
      $$('[data-a]', p).forEach(c => c.onclick = () => memoOp((mb, r) => blocksIn(mb, r).forEach(el => { el.style.textAlign = c.dataset.a; })));
      return;
    }
    if (k === 'font') {
      const FAM = { serif: 'BookSerif', 'serif-light': 'BookSerifLight', 'sans-kr': 'BookSans', 'sans-light': 'BookSansLight', sys: 'system-ui' };
      const p = memoPanel(`<div class="prow">${[['', '기본']].concat(FONTS).map(([v, t]) => `<button class="ptxt" data-f="${v}" style="font-family:${FAM[v] || 'inherit'}">${t}</button>`).join('')}</div>`);
      $$('[data-f]', p).forEach(c => c.onclick = () => memoOp((mb, r) => {
        if (c.dataset.f) document.execCommand('fontName', false, FAM[c.dataset.f]);
        else { const box = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement; $$('[style*="font-family"], font[face]', box).forEach(el => { if (r.intersectsNode(el)) { el.style.fontFamily = ''; el.removeAttribute('face'); } }); }
      }));
      return;
    }
    if (k === 'indent') {
      const blks = blocksIn($('#mb'), MM.range), allOn = !$('#mb').classList.contains('noind'), thisOn = blks.length && getComputedStyle(blks[0]).textIndent !== '0px';
      const p = memoPanel(`<div class="pttl">들여쓰기</div><div class="prow"><label class="pchk"><input type="checkbox" id="pi1" ${thisOn ? 'checked' : ''}> 이 문단</label><label class="pchk"><input type="checkbox" id="pi2" ${allOn ? 'checked' : ''}> 전체</label></div>`);
      $('#pi1', p).onchange = e => memoOp((mb, r) => blocksIn(mb, r).forEach(el => { if (!isHead(el)) el.style.textIndent = e.target.checked ? '1em' : '0'; }));
      $('#pi2', p).onchange = e => { memoSnap(); const mb = $('#mb'); ST.mind[m.id] = e.target.checked; save(); mb.classList.toggle('noind', !e.target.checked); $$('p[style*="text-indent"]', mb).forEach(el => { el.style.textIndent = ''; }); memoSaveHTML(m); hideMemoMenu(); getSelection().removeAllRanges(); };
      return;
    }
    if (k === 'clear') {
      const p = memoPanel(`<div class="prow"><button class="ptxt" data-x="sel">선택 부분 서식 지우기</button><button class="ptxt" data-x="all">이 메모 전체</button></div>`);
      $('[data-x=sel]', p).onclick = () => memoOp((mb, r) => { document.execCommand('removeFormat'); blocksIn(mb, r).forEach(el => { el.style.textAlign = ''; el.style.textIndent = ''; if (isHead(el)) { const q = document.createElement('p'); q.innerHTML = el.innerHTML; el.replaceWith(q); } }); });
      $('[data-x=all]', p).onclick = () => {
        if (!confirm('이 메모 전체의 서식을 지울까요? 부분 메모와 그림은 남습니다.')) return;
        memoSnap(); const mb = $('#mb');
        $$('[style]', mb).forEach(el => { if (!el.classList.contains('pnote')) el.removeAttribute('style'); });
        $$('b,strong,u,i,em,mark,font,span:not(.pnote)', mb).forEach(el => el.replaceWith(...el.childNodes));
        $$('h1,h2,h3,h4,h5,h6', mb).forEach(el => { const q = document.createElement('p'); q.innerHTML = el.innerHTML; el.replaceWith(q); });
        memoSaveHTML(m); applyFolds(m); hideMemoMenu(); getSelection().removeAllRanges();
      };
      return;
    }
    if (k === 'note') {
      const p = memoPanel(`<div class="pttl">부분 메모</div><textarea class="field" id="pn" rows="3" placeholder="고른 글에 붙일 메모"></textarea><div class="prow"><button class="ptxt" id="pns">저장</button></div>`);
      $('#pn', p).focus();
      $('#pns', p).onclick = () => { const v = $('#pn', p).value.trim(); if (!v) return; memoOp((mb, r) => { const sp = document.createElement('span'); sp.className = 'pnote'; sp.dataset.note = v; sp.appendChild(r.extractContents()); r.insertNode(sp); const sup = document.createElement('sup'); sup.className = 'pnm'; sup.textContent = '✎'; sp.after(sup); }); };
      return;
    }
    if (k === 'share') {
      const body = `“${txt.trim()}”\n— ${m.title || '메모'} (${APPNAME})`;
      const p = memoPanel(`<div class="prow"><button class="ptxt" data-s="share">공유하기</button><button class="ptxt" data-s="copy">복사</button><button class="ptxt" data-s="doc">Word(.doc)</button><button class="ptxt" data-s="txt">텍스트(.txt)</button></div>`);
      $$('[data-s]', p).forEach(c => c.onclick = () => {
        const s = c.dataset.s;
        if (s === 'share') share(body); else if (s === 'copy') { copy(body); toast('복사했습니다.'); }
        else { const isDoc = s === 'doc', blob = new Blob([isDoc ? `<html><head><meta charset="utf-8"></head><body><p>${esc(body).replace(/\n/g, '<br>')}</p></body></html>` : body], { type: isDoc ? 'application/msword' : 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${(m.title || '메모').slice(0, 30)}-발췌.${isDoc ? 'doc' : 'txt'}`; document.body.appendChild(a); a.click(); a.remove(); }
        getSelection().removeAllRanges(); hideMemoMenu();
      });
    }
  });
}
document.addEventListener('click', e => { const n = e.target.closest('sup.pnm'); if (n && n.previousElementSibling && n.previousElementSibling.classList.contains('pnote')) { e.stopPropagation(); toast('메모: ' + n.previousElementSibling.dataset.note, 4200); } });
window.addEventListener('hashchange', () => { hideMemoMenu(); document.removeEventListener('selectionchange', MM_SEL); MM = null; });

/* ---------- 찾기: 범위 [전체 | 본문 | 메모], 결과는 본문·메모로 나눔 ---------- */
function bookRegex() { const names = Object.keys(D.books).concat(Object.values(D.books)).sort((a, b) => b.length - a.length); return new RegExp(`^(${names.join('|')})\\s*(\\d{1,3})\\s*(?:장)?\\s*(?::\\s*(\\d{1,3})\\s*절?)?$`); }
let findScope = 'all';
async function vFind(q0) {
  $('#app').innerHTML = `<div class="screen">${bar('찾기', 'back', { find: false })}<div class="body">
    <input class="field big" id="fq" placeholder="구절이나 낱말 (예: 요 3:16, 화목제물)" value="${esc(q0)}" inputmode="search">
    <div class="seg" id="fs">${[['all', '전체'], ['text', '본문'], ['memo', '메모']].map(([k, t]) => `<button data-v="${k}" class="${findScope === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div id="fr"></div></div>${nav('')}</div>`;
  await loadAll();
  const re = bookRegex();
  let t;
  const hit = (tx, q) => { const k = tx.indexOf(q); if (k < 0) return ''; const a = Math.max(0, k - 30); return `${a ? '…' : ''}${esc(tx.slice(a, k))}<mark class="q">${esc(q)}</mark>${esc(tx.slice(k + q.length, k + q.length + 50))}…`; };
  const run = () => {
    const q = $('#fq').value.trim(), out = $('#fr');
    if (!q) { out.innerHTML = '<div class="fnote">본문은 개역개정 기준입니다.</div>'; return; }
    const m = q.match(re);
    if (m) {
      const full = D.books[m[1]] ? m[1] : Object.keys(D.books).find(k => D.books[k] === m[1]), ch = +m[2], v = m[3] ? +m[3] : null, rows = [];
      for (const id in D.days) { const d = D.days[id]; d.p.forEach((p, j) => { if (p.book === full && p.ch === ch && (v == null || (v >= p.vs && v <= p.ve))) rows.push(`<button class="it" data-go="#/read/${id}${v ? `?at=${id}-p${j + 1}:${v}` : ''}"><span class="t">${esc(p.ref)}</span><span class="m">${locLabel(id)}</span></button>`); }); }
      out.innerHTML = `<div class="fsec">본문 · ${rows.length}곳</div><div class="card list">${rows.join('') || '<div class="empty">이 책에 실린 날이 없습니다.</div>'}</div>`;
      return;
    }
    if (q.length < 2) { out.innerHTML = '<div class="empty">두 글자 이상 넣어 주세요.</div>'; return; }
    let h = '';
    if (findScope !== 'memo') {
      let n = 0; const rows = [];
      for (const id in D.days) { const d = D.days[id]; for (let j = 0; j < d.pp.length; j++) { const pid = `${id}-p${j + 1}`, p = d.pp[j]; for (const [v, tx] of D.text[d.vol][pid] || []) { if (tx.includes(q)) { n++; if (rows.length < 300) rows.push(`<button class="it" data-go="#/read/${id}?at=${pid}:${v}${j >= d.p.length ? `&x=${j - d.p.length}` : ''}"><span class="t">${p.abbr} ${p.ch}:${v} · ${locLabel(id)}</span><span class="q">${hit(tx, q)}</span></button>`); } } } }
      h += `<div class="fsec">본문 · ${n}곳${n > 300 ? ' (앞의 300곳)' : ''}</div><div class="card list">${rows.join('') || '<div class="empty">찾는 말이 든 구절이 없습니다.</div>'}</div>`;
    }
    if (findScope !== 'text') {
      const ms = allMemos().slice().sort(memoSort).filter(x => plainOf(x).includes(q));
      h += `<div class="fsec">메모 · ${ms.length}편</div><div class="card list">${ms.map(x => `<button class="it" data-go="#/memo/${x.id}"><span class="t" style="color:var(--ink)">${esc(x.title || '(제목 없음)')}</span><span class="q">${hit(plainOf(x).replace(/\s+/g, ' '), q)}</span></button>`).join('') || '<div class="empty">찾는 말이 든 메모가 없습니다.</div>'}</div>`;
    }
    out.innerHTML = h;
  };
  $('#fq').oninput = () => { clearTimeout(t); t = setTimeout(run, 250); };
  $('#fs').onclick = e => { const b = e.target.closest('button'); if (!b) return; findScope = b.dataset.v; $$('#fs button').forEach(x => x.classList.toggle('on', x === b)); run(); };
  run();
  if (!q0) $('#fq').focus();
}

/* ---------- 개인 메모 묶음 (암호로 잠김 · 버전 글자 다섯 번 누르기로 열기) ---------- */
const PACK_URL = 'data/n.dat';
async function packFetch() { try { const r = await fetch(PACK_URL, { cache: 'no-store' }); return r.ok ? await r.json() : null; } catch (e) { return null; } }
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function packKey(pw, salt) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(salt), iterations: 200000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
}
async function packOpen(pk, key) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(pk.iv) }, key, b64(pk.ct));
  const j = JSON.parse(new TextDecoder().decode(pt));
  const fix = h => (h || '').replace(/src="(?:data\/)?memo_media\/([^"]+)"/g, (m, f) => j.media[f] ? `src="${j.media[f]}"` : m);
  j.memos.forEach(m => { m.html = fix(m.html); if (m.orig) m.orig = fix(m.orig); });
  await idbSet('pm', j.memos); await idbSet('pk', key);
  ST.pm = { ver: pk.ver, n: j.memos.length }; save();
  D.memos = j.memos; D.memos.forEach((m, k) => { m.no = k + 1; m.builtin = true; }); indexMemos();
  return j.memos.length;
}
function packAsk(isNew) {
  if (!window.crypto || !crypto.subtle) { toast('이 화면에서는 열 수 없습니다. 설치한 앱에서 다시 해 주세요.'); return; }
  const m = $('#modal');
  m.innerHTML = `<div class="card"><b>${isNew ? '새 개인 메모가 있습니다' : '개인 메모 열기'}</b>
    <input class="field" id="pkw" type="password" autocomplete="current-password" placeholder="비밀번호">
    <div class="row" style="justify-content:center"><button class="btn" id="pkc">닫기</button><button class="btn dark" id="pko">열기</button></div><div class="lab" id="pkm"></div></div>`;
  m.hidden = false; $('#pkw').focus();
  $('#pkc').onclick = () => { m.hidden = true; };
  const go2 = async () => {
    const pw = $('#pkw').value; if (!pw) return; $('#pkm').textContent = '여는 중…';
    const pk = await packFetch(); if (!pk) { $('#pkm').textContent = '묶음을 찾지 못했습니다. 인터넷 연결을 확인해 주세요.'; return; }
    try { const n = await packOpen(pk, await packKey(pw, pk.salt)); m.hidden = true; toast(`개인 메모 ${n}편을 넣었습니다.`, 3200); route(); }
    catch (e) { $('#pkm').textContent = '비밀번호가 맞지 않습니다.'; }
  };
  $('#pko').onclick = go2; $('#pkw').onkeydown = e => { if (e.key === 'Enter') go2(); };
}
async function packCheck() { // 한 번 연 휴대폰에서만: 새 묶음이 올라오면 저절로 넣기
  if (!ST.pm) return;
  const pk = await packFetch(); if (!pk || pk.ver === ST.pm.ver) return;
  try { const key = await idbGet('pk'); const n = await packOpen(pk, key); toast(`개인 메모가 새로 들어왔습니다 · ${n}편`, 3600); if (/^#\/(memos|memo|find)/.test(location.hash)) route(); }
  catch (e) { packAsk(true); }
}

/* ---------- 설정 ---------- */
function vSet() {
  const s = ST.set;
  const segs = (k, arr) => `<div class="seg" data-k="${k}">${arr.map(([v, t]) => `<button data-v="${v}" class="${String(s[k]) === String(v) ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  const old = ST.lastBackup ? `${fmtDate(ST.lastBackup)} (${Math.floor((Date.now() - ST.lastBackup) / 864e5)}일 전)` : '아직 없음';
  $('#app').innerHTML = `<div class="screen">${bar('설정', 'back', { findOnly: true })}
   <div class="body set">
    <button class="helpbig" data-go="#/help">${icon('help')}<b>사용법</b><span>읽기 · 표시·메모 · AI</span></button>
    <h3>보기</h3><div class="card">
      <div class="lab">시작 화면</div><label class="chk"><input type="checkbox" id="intro" ${s.intro ? 'checked' : ''}> 앱을 열 때마다 시작 화면(로마서 16:25~27) 보기</label>
      <div class="lab">색 테마</div>${segs('theme', THEMES)}
      <div class="lab">화면 글자 (오른쪽 위 가가 단추와 같음 · 날짜·메뉴·안내 글씨)</div>${segs('ui', UI_STEPS.map((x, i) => [i, x[1]]))}
      <div class="lab">본문 글꼴</div><div class="seg wrap" data-k="font">${FONTS.map(([v, t]) => `<button data-v="${v}" class="${s.font === v ? 'on' : ''}" data-f="${v}">${t}</button>`).join('')}</div>
      <div class="lab">본문 글자 크기 (책 속에서 화면 가운데를 눌러도 바꿀 수 있습니다)</div><input type="range" min="15" max="28" step="1" value="${s.fs}" id="fs">
      <div class="lab">줄 간격</div><input type="range" min="1.5" max="2.4" step="0.1" value="${s.lh}" id="lh">
      <div class="lab">좌우 여백</div>${segs('pad', PADS.map((x, i) => [i, x[1]]))}
      <div class="preview">내가 너로 여자와 원수가 되게 하고 네 후손도 여자의 후손과 원수가 되게 하리니 여자의 후손은 네 머리를 상하게 할 것이요</div>
      <div class="lab">넘기기</div>${segs('mode', [['page', '쪽 넘기기'], ['scroll', '스크롤']])}</div>
    <h3>올해 읽을 권</h3><div class="card">${segs('vol', [[1, '제1권'], [2, '제2권'], [3, '제3권']])}
      <label class="chk"><input type="checkbox" id="ny" ${s.newYear ? 'checked' : ''}> 새해 첫날 “올해 읽을 권” 묻기</label></div>
    <h3>매일 알림</h3><div class="card">
      <div class="small">휴대폰 캘린더에 매일 반복 일정 "${NOTIFY_TITLE}"을 넣어 알림을 받습니다. 알림의 링크를 누르면 이 앱이 열립니다.</div>
      <div class="row"><span class="lab">알림 시각</span><input type="time" id="nt" class="field" style="width:auto" value="${s.notifyTime}"></div>
      <div class="row"><button class="btn" id="ncal">${icon('bell')}구글 캘린더에 넣기</button><button class="btn" id="nics">${icon('down')}캘린더 파일(.ics)</button></div></div>
    <h3 id="bksec">메모 · 기록 (백업)</h3><div class="card">
      <div class="small">진도, 최근 읽은 구절, 하이라이트, 책갈피, 내가 쓴 메모, 설정은 이 휴대폰의 이 브라우저 안에만 저장됩니다. 휴대폰을 바꾸거나 브라우저 데이터를 지우면 사라지므로 백업 파일을 저장해 두세요. 성경 본문과 ESV 열쇠는 백업에 넣지 않습니다.</div>
      <div class="lab">마지막 백업: ${old}</div>
      <div class="row"><button class="btn dark" id="bk">${icon('down')}백업 파일 내보내기</button><button class="btn" id="rs">${icon('up')}불러오기</button></div>
      <input type="file" id="rf" accept="application/json,.json" hidden></div>
    <h3 id="aisec">AI 활용</h3><div class="card">
      <div class="lab">연결할 AI</div>${segs('ai', AI_CHOICES)}
      ${s.ai === 'none' ? '<div class="small">AI 활용 아이콘이 모두 숨겨져 있습니다.</div>' : `<div class="small">AI를 바꾸었다면, 새 AI에는 지침이 없으니 아래 세 지침을 다시 “AI에 저장”해 주세요. AI의 기억 기능(메모리)이 켜져 있어야 다음 대화에서도 기억합니다.</div><div id="gcs">${guideCards()}</div>`}</div>
    <h3>앱 정보</h3><div class="card small">
      <span id="ver">${APPNAME}</span>${D.memos.length ? ` · 개인 메모 ${D.memos.length}편` : ''}<br>
      성경 본문: ${esc(D.st.translation || '개역개정 4판')}. ${esc(D.st.copyright || '')}<br>
      본문 출처: 『365일 성경 묵상』 제1·2·3권</div>
   </div>${nav('set')}</div>`;
  if (location.hash.includes('bk=1')) setTimeout(() => { const b = $('#bksec'); if (b) b.scrollIntoView({ block: 'start' }); }, 50);
  let vt = 0, vn = 0; $('#ver').onclick = () => { vn = Date.now() - vt < 900 ? vn + 1 : 1; vt = Date.now(); if (vn >= 5) { vn = 0; packAsk(); } };
  $$('.seg').forEach(g => g.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return; const k = g.dataset.k;
    s[k] = isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v; $$('button', g).forEach(x => x.classList.toggle('on', x === b));
    save(); applyView(); if (k === 'vol') await loadVol(s.vol); if (k === 'ai') { vSet(); if (s.ai !== 'none') { toast(`연결할 AI를 ${AI[s.ai].name}(으)로 바꾸었습니다. 아래 지침을 새 AI에 저장해 주세요.`, 4200); setTimeout(() => { const a = $('#aisec'); if (a) a.scrollIntoView({ block: 'start' }); }, 50); } }
  }));
  $('#ny').onchange = e => { s.newYear = e.target.checked; save(); };
  $('#fs').oninput = e => { s.fs = +e.target.value; applyView(); save(); };
  $('#lh').oninput = e => { s.lh = +e.target.value; applyView(); save(); };
  const rg = () => { const g = $('#gcs'); if (!g) return; g.innerHTML = guideCards(); bindGuideCards(rg); }; if ($('#gcs')) bindGuideCards(rg);
  $('#intro').onchange = e => { s.intro = e.target.checked; save(); };
  $('#nt').onchange = e => { s.notifyTime = e.target.value || '06:00'; save(); };
  $('#ncal').onclick = () => openExt(gcalURL());
  $('#nics').onclick = () => downloadICS();
  $('#bk').onclick = () => {
    const t = todayInfo();
    const data = JSON.stringify({ app: '365말씀묵상', edition: D.edition, version: VERSION, exported: new Date().toISOString(), state: Object.assign({}, ST, { set: Object.assign({}, ST.set, { esvKey: '' }) }), memos: UM }, null, 1);
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = `복음묵상-백업-${t.y}${pad(t.m)}${pad(t.d)}.json`; document.body.appendChild(a); a.click(); a.remove();
    ST.lastBackup = Date.now(); save(); toast('백업 파일을 내보냈습니다. 구글 드라이브 같은 곳에 보관해 두세요.', 4000); setTimeout(vSet, 300);
  };
  $('#rs').onclick = () => $('#rf').click();
  $('#rf').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (j.app !== '365말씀묵상' || !j.state || j.state.v !== 1) throw new Error('형식');
      if (!confirm(`${fmtDate(Date.parse(j.exported))}에 만든 백업으로 지금 기록을 바꿀까요?`)) return;
      const key = ST.set.esvKey; normalize(j.state); ST.set.esvKey = ST.set.esvKey || key; save();
      if (Array.isArray(j.memos)) { UM = j.memos; await saveUM(); }
      applyView(); toast('백업을 불러왔습니다.'); go('#/', true);
    } catch (err) { toast('이 앱의 백업 파일이 아닙니다.'); }
  };
}

/* ---------- 매일 알림 (캘린더 반복 일정) ---------- */
function appURL() { return location.href.split('#')[0].split('?')[0] + '#/today?n=1'; }
function notifyStart() { const t = todayInfo(), [h, mi] = ST.set.notifyTime.split(':'); return `${t.y}${pad(t.m)}${pad(t.d)}T${h}${mi}00`; }
function endOf(st) { const h = +st.slice(9, 11), mi = +st.slice(11, 13) + 10; return st.slice(0, 9) + pad(h + Math.floor(mi / 60)) + pad(mi % 60) + '00'; }
function gcalURL() {
  const st = notifyStart();
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: NOTIFY_TITLE, dates: `${st}/${endOf(st)}`, recur: 'RRULE:FREQ=DAILY', details: `오늘의 말씀 열기: ${appURL()}` });
}
function downloadICS() {
  const st = notifyStart();
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//365 Gospel Meditation//KO', 'BEGIN:VEVENT', `UID:m365-${Date.now()}@local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART:${st}`, `DTEND:${endOf(st)}`, 'RRULE:FREQ=DAILY', `SUMMARY:${NOTIFY_TITLE}`, `DESCRIPTION:오늘의 말씀 열기: ${appURL()}`, `URL:${appURL()}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${NOTIFY_TITLE}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = '오늘의-복음-묵상-알림.ics'; document.body.appendChild(a); a.click(); a.remove();
  toast('캘린더 파일을 내려받았습니다. 파일을 열어 캘린더에 추가하세요.', 4200);
}

/* ---------- 처음 안내 (처음 설정 직후 · 설정에서 다시 보기) ---------- */
const FIG = {
  read: `<div class="fgpage"><div class="fz l">‹ 앞쪽</div><div class="fz c">가운데 톡<br><small>읽는 방식·글자</small></div><div class="fz r">다음 쪽 ›</div></div>`,
  mark: () => `<div class="fgverse"><span class="n">16</span>하나님이 세상을 <span class="hl">이처럼 사랑하사</span> 독생자를 주셨으니</div><div class="hrow mn"><span>${icon('hl')}<b class="u">U</b><b>B</b>${icon('pen')}${icon('copy')}${icon('share')}${icon('bm')}</span></div>`,
  ai: () => `<div class="hrow mn"><span class="aiz">${icon('ask')}<br>AI와<br>간단 Q&amp;A</span><span class="aiz">${icon('gem')}<br>AI로<br>번역 비교</span><span class="aiz">${compassSVG()}<br>AI로 배경·<br>문맥 살피기</span></div>`,
};
function vTour() {
  const ai = ST.set.ai !== 'none';
  const cards = [
    ['읽기', FIG.read, ['화면 양옆을 누르면 쪽을 넘깁니다.', '가운데를 톡 누르면 읽는 방식과 글자 크기 메뉴가 나옵니다.', '끝까지 넘기면 다음 날로 갑니다.']],
    ['표시 · 메모', FIG.mark(), ['구절을 길게 누른 채 끌어서 고르고, 손을 떼면 아래에 메뉴가 뜹니다.', '형광펜·밑줄로 표시하고, 펜으로 메모를 씁니다.', '쓴 메모는 아래 메뉴 “메모”에 모입니다.']],
  ];
  if (ai) cards.push(['AI 활용', FIG.ai(), ['구절을 고른 뒤 AI와 간단 Q&A, AI로 번역 비교를 누릅니다.', '구절 표시 옆 나침반은 AI로 배경·문맥 살피기입니다.'], 'AI의 답은 참고 자료입니다. 최종 판단은 스스로 내리며 묵상하세요.']);
  let i = 0;
  const draw = () => {
    const [t, fig, lines, note] = cards[i], last = i === cards.length - 1;
    $('#app').innerHTML = `<div class="screen">${bar('처음 안내', 'back')}<div class="body tour">
      <div class="tcard"><div class="hfig big">${fig}</div><h2>${t}</h2>${lines.map(l => `<p>${l}</p>`).join('')}${note ? `<p class="tnote">${note}</p>` : ''}</div>
      <div class="stepdots">${cards.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      ${last ? '<p class="lab" style="text-align:center">사용법은 언제든 설정 맨 위에서 다시 볼 수 있습니다.</p>' : ''}
      <div class="row" style="justify-content:center;gap:12px">${i > 0 ? '<button class="btn" id="tp">이전</button>' : '<button class="lab" id="tskip">건너뛰기</button>'}<button class="btn dark" id="tn">${last ? '시작하기' : '다음'}</button></div></div></div>`;
    $('#tn').onclick = () => { if (last) go('#/', true); else { i++; draw(); } };
    if ($('#tp')) $('#tp').onclick = () => { i--; draw(); };
    $('[data-act=back]') && ($('[data-act=back]').onclick = e => { e.stopPropagation(); if (i > 0) { i--; draw(); } else goBack(); });
    if ($('#tskip')) $('#tskip').onclick = () => go('#/', true);
  };
  draw();
}

/* ---------- 사용법: ① 읽기 ② 표시·메모 ③ AI ④ 더 알아두기 (제목을 누르면 펼침) ---------- */
function vHelp() {
  const ai = ST.set.ai !== 'none';
  const ic = (n, cls = '') => `<span class="hic ${cls}">${n === 'cmp' ? compassSVG() : icon(n)}</span>`;
  let k = 0;
  const sec = (t, body, fig = '') => `<section class="hs ${k++ === 0 ? 'open' : ''}"><button class="hh"><span>${t}</span>${fx(false)}</button><div class="hb2">${fig ? `<div class="hfig">${fig}</div>` : ''}<p>${body}</p></div></section>`;
  const tier = t => `<div class="htier">${t}</div>`;
  const gg = '<span class="hic"><span class="ga">가</span><span class="gb">가</span></span>';
  $('#app').innerHTML = `<div class="screen">${bar('사용법', 'back', { find: false })}
   <div class="body help">
    <button class="btn" data-go="#/tour">처음 안내 다시 보기 ›</button>
    ${tier('① 읽기')}
    ${sec('첫 화면', '앱을 열면 [오늘의 말씀]이 켜져 있습니다. [일자별]과 [주제별]을 누르면 각각 최근 읽은 곳의 말씀이 뜨고, 카드 오른쪽 위 “목차”로 그 목차를 엽니다. “책 속으로”를 누르면 책 속에서 이어 읽습니다. 첫 화면은 말씀만 보이고, 맨 아래 가운데 화살표를 누르거나 위로 밀면 권별 진도와 아래 메뉴가 올라옵니다.', '<div class="hrow"><span class="pastef">일자별</span><span class="pastef">주제별</span></div><div class="hrow"><span class="pastef on" style="flex:1;text-align:center">오늘의 말씀</span></div>')}
    ${sec('쪽 넘기기 · 다음 날', '화면 오른쪽을 누르거나 왼쪽으로 밀면 다음 쪽, 왼쪽을 누르거나 오른쪽으로 밀면 앞쪽입니다. 마지막 쪽에서 한 번 더 넘기면 다음 날로 갑니다. 주제별로 읽을 때는 같은 단원의 다음 말씀으로 가고, 날짜는 말씀 끝 오른쪽 아래에 작게 보입니다. 그날 끝에 “읽기 완료” 단추가 있습니다.', FIG.read)}
    ${sec('읽기 메뉴 (화면 가운데)', `책 속에서 화면 가운데를 짧게 톡 누르면 메뉴가 뜹니다. 읽는 방식 · 글자 크기 · 글꼴 · 간격 · 배경색 아이콘 가운데 하나를 누르면 그 설정만 펼쳐집니다. 목차는 그날 본문 끝(읽기 완료 아래)에 있습니다. 날짜·메뉴 같은 화면 글씨는 아래 메뉴의 ${gg}로 바꿉니다.`, '<div class="hrow"><span class="pastef">읽는 방식</span><span class="pastef on">가가</span><span class="pastef">글꼴</span><span class="pastef">간격</span><span class="pastef">배경색</span></div><div class="hrow"><span class="pastef">가 −</span><b>20</b><span class="pastef">가 +</span></div>')}
    ${sec('뒤로 가기 · 아래 메뉴', `왼쪽 위 ${ic('back')}와 휴대폰 뒤로 가기는 바로 앞 화면으로 돌아갑니다. 첫 화면에서는 두 번 눌러야 앱이 닫힙니다. 아래 메뉴는 홈 · 메모 · 모아 보기 · 찾기 · 글자(가가) · 설정 아이콘입니다. 책 속에서는 맨 위 [제n권 일자별 읽기]나 [제n권 주제별 읽기]를 누르면 그 홈으로, 집 아이콘을 누르면 홈으로 갑니다.`)}
    ${tier('② 표시 · 메모')}
    ${sec('구절 고르기 · 표시', `구절을 길게 누르면 그 낱말이 골라지고, 손을 떼지 않고 그대로 끌면 원하는 데까지 넓어집니다. 손을 떼면 아래에 메뉴가 뜹니다. 휴대폰의 복사·검색 메뉴는 뜨지 않습니다. 한 절 전체는 메뉴 오른쪽 위 [구절 전체]로 고릅니다. 다시 고르려면 다시 길게 누르면 됩니다. 윗줄은 ${ic('hl')} 형광펜, <b>U</b> 밑줄, <b>B</b> 진하게, ${ic('er')} 지우개, 아랫줄은 ${ic('memo')} 메모, ${ic('copy')} 복사, ${ic('share')} 공유, ${ic('bm')} 책갈피입니다. 서식은 눌러도 메뉴가 닫히지 않아 연달아 고를 수 있습니다. 일자별에서 하든 주제별에서 하든 같은 자리에 남습니다.`, FIG.mark())}
    ${sec('메모', `아래 메뉴 “메모”에서 분류별로 보고 “새 메모”로 씁니다. 구절 메뉴의 ${ic('memo')} 메모로 쓰면 그 구절에 걸리고, 본문에 작은 M이 붙습니다. AI 답을 붙여 넣으면 서식을 살리고, “요약”과 “상세”가 있으면 어디를 접을지 묻습니다. 저장된 메모에서 글을 끌어 고르면 서식 메뉴가 뜹니다. 메모 머리의 ${ic('flag')} 대표 구절, ${ic('link')} 관련 구절을 누르면 그 본문으로 가고 “메모로 돌아가기 ›”로 돌아옵니다.`, `<div class="hrow"><span>${ic('flag')}<b>대표 구절 · 요 3:16</b></span></div><div class="hrow"><span>${ic('link')}관련 구절</span><span class="pastef">롬 5:8</span><span class="pastef">요일 4:10</span></div>`)}
    ${sec('모아 보기 · 찾기', `모아 보기에는 하이라이트와 책갈피가 모입니다. 아래 메뉴의 ${ic('search')} 찾기에서 구절(예: 요 3:16)이나 낱말을 찾고, 범위를 전체 · 본문 · 메모 중에서 고릅니다. 결과는 본문과 메모로 나뉘어 보입니다.`, '<div class="hrow"><span class="pastef on">전체</span><span class="pastef">본문</span><span class="pastef">메모</span></div>')}
    ${ai ? tier('③ AI 활용') + sec('AI 활용 아이콘 세 가지', `구절을 고른 뒤 ${ic('ask')} AI와 간단 Q&A, ${ic('gem')} AI로 번역 비교를 누릅니다. 구절 표시 옆 ${ic('cmp')} 나침반은 AI로 배경·문맥 살피기입니다. 누르면 잠시 “붙여넣으세요” 안내가 뜬 뒤 연결한 AI 창이 열립니다. 구절과 요청은 이미 복사되어 있으니, Claude·Gemini는 입력칸을 길게 눌러 붙여넣기 한 뒤 보내면 됩니다. ChatGPT는 입력칸에 채워진 채 열리니 보내기만 누르면 됩니다. 본문 아래 펼친 개역한글 줄도 길게 눌러 고르면 AI에게 물을 수 있습니다. 최종 판단은 스스로 내리며 묵상하세요.`, FIG.ai()) + sec('AI 지침', '설정 › AI 활용에서 세 지침을 “AI에 저장”해 두어야 AI가 짧은 요청만으로 지침대로 답합니다. 지침은 “전문 보기”로 읽고 “고치기”로 바꿀 수 있습니다. 붙여 넣을 때 AI가 “외부 지시문일 수 있다”는 안내를 띄울 수 있는데, 이 앱의 성경 읽기 지침이니 읽어 보고 보내시면 됩니다. 연결할 AI를 바꾸면 새 AI에 지침을 다시 저장해 주세요.') : ''}
    ${tier('더 알아두기')}
    ${sec('다른 번역 보기', `구절 표시 옆 ${ic('dual', 'on')}를 누르면 그 본문 아래에만 번역 줄이 나타납니다. 개역한글(⌄)은 앱 안에서 각 구절 아래에 바로 보이고, ↗는 YouVersion(성경 앱)에서 그 본문을 엽니다. 구절 메뉴 맨 위 상자의 개역한글도 메뉴 안에 바로 펼쳐집니다.`, `<div class="hrow ph"><b>창세기 6:5~7</b><span>${ai ? ic('cmp') : ''}${ic('dual', 'on')}</span></div><div class="hrow dvl"><span>개역한글 ⌄</span><span>·</span><span>ESV ↗</span><span>|</span><span>새번역 ↗</span><span>·</span><span>NIV ↗</span></div>`)}
    ${sec('더 깊고 넓게 읽기', '어떤 날은 본문 끝에 “더 깊고 넓게 읽기” 칸이 있습니다. 누르면 그날 말씀과 이어지는 긴 본문이 펼쳐집니다. 읽기 완료와는 따로입니다.', `<div class="hrow deepf"><span>더 깊고 넓게 읽기 · 창 7</span><span>⌄</span></div>`)}
    ${sec('매일 알림 · 백업', `설정 › 매일 알림에서 캘린더에 "${NOTIFY_TITLE}" 반복 일정을 넣습니다. 알림의 링크를 누르면 그날 말씀으로 바로 갑니다. 기록은 이 휴대폰 안에만 있으니 설정 › 메모·기록에서 백업 파일을 내보내 보관해 두세요.`)}
    ${sec('구글 검색 막대가 메뉴를 가릴 때', '구절을 고를 때 화면 아래에 구글 검색 막대(“탭하여 검색”)가 먼저 뜨면, 크롬에서 그 기능을 끄면 됩니다. 크롬 버전에 따라 위치가 조금 다르고, Google 서비스에 없으면 “개인정보 보호 및 보안” 아래쪽에 있습니다.', `<div class="hrow path">크롬 ⋮ › 설정 › Google 서비스 › <b>탭하여 검색</b> 끄기</div>`)}
   </div></div>`;
  const sync = () => $$('.help .hs').forEach(x => { const o = x.classList.contains('open'); $('.fx', x).innerHTML = icon(o ? 'collapse' : 'expand'); });
  $$('.help .hh').forEach(b => b.onclick = () => { b.parentElement.classList.toggle('open'); sync(); });
  sync();
}

boot();
