/* ═══════════════════════════════════════════════════════════════════════════
   CIT INPT — script.js
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR
   ══════════════════════════════════════════════ */
const dot  = document.querySelector('.cur-dot');
const ring = document.querySelector('.cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});

// Smooth ring lag
(function trackRing() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(trackRing);
})();

// Ring expand on interactive elements
document.querySelectorAll('a, button, .cell, .tm-card, .ev-card, .acard').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });


/* ══════════════════════════════════════════════
   2. SCROLL PROGRESS BAR
   ══════════════════════════════════════════════ */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  bar.style.width = (pct * 100) + '%';
}, { passive: true });


/* ══════════════════════════════════════════════
   3. STICKY NAVBAR
   ══════════════════════════════════════════════ */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('sticky', window.scrollY > 70);
}, { passive: true });


/* ══════════════════════════════════════════════
   4. ACTIVE NAV LINK (IntersectionObserver)
   ══════════════════════════════════════════════ */
const allSections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: .38 }).observe && allSections.forEach(s =>
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (a) a.classList.add('active');
    }
  }, { threshold: .38 }).observe(s)
);


/* ══════════════════════════════════════════════
   5. HAMBURGER
   ══════════════════════════════════════════════ */
const ham  = document.querySelector('.hamburger');
const navL = document.querySelector('.nav-links');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  navL.classList.toggle('open');
});
navL.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open'); navL.classList.remove('open');
}));


/* ══════════════════════════════════════════════
   6. SMOOTH SCROLL
   ══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


/* ══════════════════════════════════════════════
   7. STARFIELD CANVAS
   ══════════════════════════════════════════════ */
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], nebulas = [];

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize, { passive: true });

// Star class
class Star {
  constructor() { this.init(); }
  init() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 1.2 + .1;
    this.speed = Math.random() * .15 + .02;
    this.alpha = Math.random() * .6 + .1;
    this.da    = (Math.random() - .5) * .004;
    this.color = ['#ffffff','#00f5d4','#0066ff','#8b5cf6'][Math.floor(Math.random()*4)];
  }
  tick() {
    this.y -= this.speed;
    this.alpha += this.da;
    if (this.alpha < .05 || this.alpha > .7) this.da *= -1;
    if (this.y < -2) { this.y = H + 2; this.x = Math.random() * W; }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha  = this.alpha;
    ctx.fillStyle    = this.color;
    ctx.shadowColor  = this.color;
    ctx.shadowBlur   = this.r * 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Nebula/aurora class
class Nebula {
  constructor() { this.init(); }
  init() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 220 + 80;
    this.vx   = (Math.random() - .5) * .08;
    this.vy   = (Math.random() - .5) * .08;
    this.alpha= Math.random() * .025 + .005;
    this.color= ['rgba(0,245,212','rgba(0,102,255','rgba(139,92,246','rgba(247,37,133'][Math.floor(Math.random()*4)];
  }
  tick() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -this.r || this.x > W + this.r) this.vx *= -1;
    if (this.y < -this.r || this.y > H + this.r) this.vy *= -1;
  }
  draw() {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0, this.color + `,${this.alpha})`);
    g.addColorStop(1, this.color + ',0)');
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Init
for (let i = 0; i < 200; i++) stars.push(new Star());
for (let i = 0; i < 8;   i++) nebulas.push(new Nebula());

// Draw connection lines between close stars
function drawConnections() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i+1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 80) {
        ctx.save();
        ctx.globalAlpha = (1 - d/80) * .06;
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth   = .4;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

// Mouse-influenced stars
let mouseInfluenceX = -9999, mouseInfluenceY = -9999;
window.addEventListener('mousemove', e => { mouseInfluenceX = e.clientX; mouseInfluenceY = e.clientY; }, { passive: true });

function loop() {
  ctx.clearRect(0, 0, W, H);
  nebulas.forEach(n => { n.tick(); n.draw(); });
  drawConnections();
  stars.forEach(s => {
    // subtle repel from mouse
    const dx = s.x - mouseInfluenceX;
    const dy = s.y - mouseInfluenceY;
    const d  = Math.sqrt(dx*dx + dy*dy);
    if (d < 120) { s.x += (dx/d) * .5; s.y += (dy/d) * .5; }
    s.tick(); s.draw();
  });
  requestAnimationFrame(loop);
}
loop();


/* ══════════════════════════════════════════════
   8. SCROLL REVEAL
   ══════════════════════════════════════════════ */
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
}, { threshold: .1 }).observe && (() => {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* ══════════════════════════════════════════════
   9. COUNTER ANIMATION
   ══════════════════════════════════════════════ */
function countUp(el, target, suffix, dur = 1800) {
  let s = null;
  const step = ts => {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const v = Math.floor((1 - Math.pow(1-p, 3)) * target);
    el.innerHTML = v + '<span class="unit">' + suffix + '</span>';
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el  = e.target;
      const num = parseInt(el.dataset.count);
      const suf = el.dataset.suffix || '';
      countUp(el, num, suf);
      cObs.unobserve(el);
    }
  });
}, { threshold: .7 });
counterEls.forEach(el => cObs.observe(el));


/* ══════════════════════════════════════════════
   10. CELL CARD MOUSE-TRACKING GLOW
   ══════════════════════════════════════════════ */
document.querySelectorAll('.cell').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.querySelector('.cell-shine').style.setProperty('--mx', x + '%');
    card.querySelector('.cell-shine').style.setProperty('--my', y + '%');

    // 3D tilt
    const cx = r.width / 2, cy = r.height / 2;
    const rx = ((e.clientY - r.top  - cy) / cy) * 5;
    const ry = ((e.clientX - r.left - cx) / cx) * -5;
    card.style.transform = `translateY(-8px) scale(1.015) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ══════════════════════════════════════════════
   11. TERMINAL TYPEWRITER
   ══════════════════════════════════════════════ */
function typeEl(el, speed = 36) {
  const txt = el.dataset.t || '';
  el.textContent = '';
  let i = 0;
  return new Promise(res => {
    const iv = setInterval(() => {
      el.textContent += txt[i++];
      if (i >= txt.length) { clearInterval(iv); res(); }
    }, speed);
  });
}

async function runTerminal() {
  const lines = document.querySelectorAll('.t-type');
  for (const l of lines) { await typeEl(l); await new Promise(r => setTimeout(r, 200)); }
}

// Trigger when hero visible
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting) { setTimeout(runTerminal, 700); obs.disconnect(); }
}, { threshold: .3 }).observe(document.getElementById('hero'));


/* ══════════════════════════════════════════════
   12. HOLO CARD TILT (hero card)
   ══════════════════════════════════════════════ */
const holoCard = document.querySelector('.holo-card');
if (holoCard) {
  holoCard.addEventListener('mousemove', e => {
    const r  = holoCard.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const rx = ((e.clientY - r.top  - cy) / cy) * 6;
    const ry = ((e.clientX - r.left - cx) / cx) * -6;
    holoCard.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  holoCard.addEventListener('mouseleave', () => {
    holoCard.style.transform = '';
  });
}


/* ══════════════════════════════════════════════
   13. CONTACT FORM
   ══════════════════════════════════════════════ */
const cForm = document.getElementById('cForm');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cForm.querySelector('.btn-send');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ &nbsp; Message envoyé !';
    btn.style.background = 'var(--neon-green)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false;
      cForm.reset();
    }, 3500);
  });
}


/* ══════════════════════════════════════════════
   14. PARALLAX (hero grid bg)
   ══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const el = document.querySelector('.hero-bg-grid');
  if (el) el.style.transform = `translateY(${y * .07}px)`;
}, { passive: true });