// ════ PRELOADER (0 → 100 counter) ═════════════════════
const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloaderCount');
let count = 0;

const countUp = setInterval(() => {
  count += Math.floor(Math.random() * 14) + 4;
  if (count >= 100) {
    count = 100;
    clearInterval(countUp);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
    }, 300);
  }
  preloaderCount.textContent = count;
}, 110);

// ════ CURSOR ═══════════════════════════════════════════
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});
(function ringLoop() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// ════ MAGNETIC ═════════════════════════════════════════
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ════ TYPEWRITER ═══════════════════════════════════════
const phrases = [
  'aspiring penetration tester',
  'MS in AI @ CU Boulder',
  'AWS certified cloud practitioner',
  'building Monday, my AI assistant',
  'engineering IoT for aquaculture'
];
const tw = document.getElementById('typewriter');
let pi = 0, ci = 0, del = false;

function type() {
  const cur = phrases[pi];
  if (!del) {
    tw.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2100); return; }
    setTimeout(type, 42 + Math.random() * 38);
  } else {
    tw.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 380); return; }
    setTimeout(type, 20);
  }
}
setTimeout(type, 1500);

// ════ RIGHT RAIL: progress + section label ═════════════
const railProgress = document.getElementById('railProgress');
const sectionLabel = document.getElementById('sectionLabel');
const sections = [
  { id: 'about', label: 'INTRO' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'education', label: 'CREDENTIALS' },
  { id: 'contact', label: 'CONTACT' }
];

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  railProgress.style.height = (window.scrollY / total * 100) + '%';

  // Active section
  let current = sections[0];
  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s;
  }
  sectionLabel.textContent = current.label;
  document.querySelectorAll('.rail-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.section === current.id);
  });
});

// ════ MOBILE MENU ══════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}));

// ════ TILT ═════════════════════════════════════════════
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ════ SCROLL REVEAL ════════════════════════════════════
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ════ LOCAL TIME (footer rail) ═════════════════════════
const timeEl = document.getElementById('localTime');
function tickTime() {
  timeEl.textContent = new Date().toLocaleTimeString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: false
  }) + ' MYT';
}
tickTime();
setInterval(tickTime, 30000);

// ════ THEME TOGGLE ═════════════════════════════════════
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  root.setAttribute('data-theme', 'light');
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (next === 'dark') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', next);
}
const tBtn = document.getElementById('themeToggle');
const tBtnM = document.getElementById('themeToggleMobile');
if (tBtn) tBtn.addEventListener('click', toggleTheme);
if (tBtnM) tBtnM.addEventListener('click', toggleTheme);

// ════ FLOW LINE — built from real section positions ════
const flowPath = document.getElementById('flowPath');
const flowDot = document.getElementById('flowDot');
const flowSvg = document.getElementById('flowSvg');
let pathLen = 0;
let pathCache = [];   // pre-sampled points: getPointAtLength is too slow for phones

function buildFlowPath() {
  const main = document.querySelector('main');
  const mainTop = main.getBoundingClientRect().top + window.scrollY;
  const W = main.offsetWidth;

  const yOf = id => {
    const el = document.getElementById(id);
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY - mainTop + r.height / 2;
  };

  const hero = document.getElementById('about');
  const heroBottom = hero.offsetHeight - 60;
  const mobile = W < 1000;
  const L = mobile ? 0.06 : 0.30;
  const R = mobile ? 0.94 : 0.72;
  flowPath.setAttribute('stroke-width', mobile ? 2.5 : 3.5);
  flowDot.setAttribute('r', mobile ? 5 : 7);

  // the glow filter forces a full blur re-render EVERY frame the line
  // moves — fine on desktop GPUs, brutal on phones. Plain stroke on mobile.
  if (mobile) {
    flowPath.removeAttribute('filter');
    flowDot.removeAttribute('filter');
  } else {
    flowPath.setAttribute('filter', 'url(#flowGlow)');
    flowDot.setAttribute('filter', 'url(#flowGlow)');
  }

  const stops = [
    { x: W * (mobile ? 0.85 : 0.62), y: heroBottom },
    { x: W * L, y: yOf('skills') },
    { x: W * R, y: yOf('projects') },
    { x: W * L, y: yOf('education') },
    { x: W * (mobile ? 0.5 : 0.58), y: yOf('contact') + 40 }
  ];

  const H = stops[stops.length - 1].y + 120;
  flowSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  flowSvg.style.height = H + 'px';

  let d = `M ${stops[0].x} ${stops[0].y}`;
  for (let i = 1; i < stops.length; i++) {
    const p0 = stops[i - 1], p1 = stops[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  flowPath.setAttribute('d', d);

  pathLen = flowPath.getTotalLength();
  flowPath.style.strokeDasharray = pathLen;
  flowPath.style.strokeDashoffset = pathLen;

  // sample the path ONCE — all later lookups hit this array, not the DOM
  const SAMPLES = 300;
  pathCache = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const len = (pathLen * i) / SAMPLES;
    const pt = flowPath.getPointAtLength(len);
    pathCache.push({ len, x: pt.x, y: pt.y });
  }
}

let targetP = 0, currentP = 0;

function computeFlow() {
  const rect = flowSvg.getBoundingClientRect();
  const targetY = window.innerHeight * 0.5 - rect.top;
  if (targetY <= 0 || !pathCache.length) { targetP = 0; return; }

  // binary search the CACHED samples (zero DOM calls)
  let lo = 0, hi = pathCache.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (pathCache[mid].y < targetY) lo = mid;
    else hi = mid;
  }
  targetP = Math.min(pathCache[lo].len / pathLen, 1);
}

function renderFlow() {
  const diff = targetP - currentP;
  // idle skip: nothing moved, do nothing this frame
  if (Math.abs(diff) > 0.0004) {
    currentP += diff * 0.14;
    const drawn = pathLen * currentP;
    flowPath.style.strokeDashoffset = pathLen - drawn;
    if (drawn > 1 && pathCache.length) {
      // interpolate dot position from cache
      const idx = Math.min((currentP * (pathCache.length - 1)) | 0, pathCache.length - 2);
      const a = pathCache[idx], b = pathCache[idx + 1];
      const t = (drawn - a.len) / (b.len - a.len || 1);
      flowDot.setAttribute('cx', a.x + (b.x - a.x) * t);
      flowDot.setAttribute('cy', a.y + (b.y - a.y) * t);
      flowDot.style.opacity = 1;
    } else {
      flowDot.style.opacity = 0;
    }
  }
  requestAnimationFrame(renderFlow);
}

if (flowPath) {
  // build after layout settles (fonts/images can shift positions)
  window.addEventListener('load', () => { buildFlowPath(); computeFlow(); });
  buildFlowPath();
  computeFlow();
  renderFlow();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildFlowPath(); computeFlow(); }, 200);
  });
  window.addEventListener('scroll', computeFlow, { passive: true });
}

// ════ COLOR JOURNEY — background shifts per section ════
// [r, g, b] pairs: [main glow, deep glow, center wash]
const journey = [
  { p: 0.00, a: [255,150,40],  b: [120,40,10],   c: [255,100,30]  }, // hero — amber
  { p: 0.25, a: [255,70,90],   b: [110,10,45],   c: [255,60,90]   }, // skills — crimson
  { p: 0.50, a: [175,70,255],  b: [55,20,110],   c: [150,60,255]  }, // projects — violet
  { p: 0.75, a: [50,160,255],  b: [10,50,110],   c: [60,140,255]  }, // education — azure
  { p: 1.00, a: [45,255,185],  b: [8,90,75],     c: [40,230,170]  }  // contact — mint
];
const ALPHAS = { a: 0.16, b: 0.13, c: 0.06 };

function lerp(x, y, t) { return x + (y - x) * t; }
function lerpRGB(c1, c2, t) {
  return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)];
}

function updateJourney() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const p = Math.min(Math.max(window.scrollY / total, 0), 1);

  // find surrounding stops
  let i = 0;
  while (i < journey.length - 2 && p > journey[i + 1].p) i++;
  const s1 = journey[i], s2 = journey[i + 1];
  const t = Math.min(Math.max((p - s1.p) / (s2.p - s1.p), 0), 1);
  // ease the blend
  const e = t * t * (3 - 2 * t);

  const A = lerpRGB(s1.a, s2.a, e);
  const B = lerpRGB(s1.b, s2.b, e);
  const C = lerpRGB(s1.c, s2.c, e);

  const r = document.documentElement.style;
  r.setProperty('--j1', `rgba(${A[0]|0},${A[1]|0},${A[2]|0},${ALPHAS.a})`);
  r.setProperty('--j2', `rgba(${B[0]|0},${B[1]|0},${B[2]|0},${ALPHAS.b})`);
  r.setProperty('--j3', `rgba(${C[0]|0},${C[1]|0},${C[2]|0},${ALPHAS.c})`);
}
window.addEventListener('scroll', updateJourney, { passive: true });
updateJourney();
