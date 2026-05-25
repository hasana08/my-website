/* ============================================================
   HASAN IBN AHMED — Portfolio Script
   script.js — Pure JavaScript only. No CSS here.
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================
     1. PARTICLE CANVAS
     ========================================== */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    let mouse = { x: W / 2, y: H / 2 };
    let particles = [];

    const COUNT = Math.min(90, Math.floor((W * H) / 14000));
    const CONN  = 130;
    const REPEL = 115;
    const SPEED = 0.32;

    canvas.width  = W;
    canvas.height = H;

    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x  = Math.random() * W;
        this.y  = initial ? Math.random() * H : -10;
        this.vx = (Math.random() - 0.5) * SPEED;
        this.vy = (Math.random() - 0.5) * SPEED;
        this.r  = Math.random() * 1.4 + 0.5;
        this.a  = Math.random() * 0.4 + 0.1;
      }
      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL) {
          const f = (REPEL - d) / REPEL;
          this.vx += (dx / d) * f * 0.55;
          this.vy += (dy / d) * f * 0.55;
        }
        this.vx *= 0.986;
        this.vy *= 0.986;
        const s = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (s > 2) { this.vx *= 2/s; this.vy *= 2/s; }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -20) this.x = W + 20;
        if (this.x > W+20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H+20) this.y = -20;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126,184,247,${this.a})`;
        ctx.fill();
      }
    }

    function build() {
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < CONN) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(126,184,247,${(1 - d/CONN) * 0.14})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    }

    build();
    loop();

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      build();
    });

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', e => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }, { passive: true });
  }

  /* ==========================================
     2. CURSOR GLOW
     ========================================== */
  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      glow.style.display = 'none';
      return;
    }
    let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();
  }

  /* ==========================================
     3. TYPING EFFECT
     ========================================== */
  function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
      'Hasan Ibn Ahmed',
      'Biochemistry',
      'Pre-Medicine',
      'Future Physician'
    ];

    let pi = 0, ci = 0, deleting = false;

    function tick() {
      const phrase = phrases[pi];
      if (!deleting) {
        el.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(tick, 1900);
          return;
        }
        setTimeout(tick, 68 + Math.random() * 38);
      } else {
        el.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 36 + Math.random() * 18);
      }
    }

    setTimeout(tick, 500);
  }

  /* ==========================================
     4. NAVBAR SCROLL — targets .top-nav only
     ========================================== */
  function initNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;
    const check = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ==========================================
     5. ACTIVE LINK
     ========================================== */
  function setActiveLinks() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const match = href === page || (page === '' && href === 'index.html') ||
                    (page === 'index.html' && href === 'index.html');
      a.classList.toggle('active', match);
    });
  }

  /* ==========================================
     6. FADE-IN ON SCROLL
     ========================================== */
  function initFadeIns() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    els.forEach(el => io.observe(el));
  }

  /* ==========================================
     7. SMOOTH SCROLL (same-page anchors)
     ========================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const t = document.getElementById(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  /* ==========================================
     INIT
     ========================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initTyping();
    initNav();
    setActiveLinks();
    initFadeIns();
    initSmoothScroll();
  });

})();


/* ==========================================
   8. ANIMATED HA AVATAR CANVAS
   ========================================== */
function initHaAvatar() {
  const canvas = document.getElementById('ha-avatar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const wrap = canvas.parentElement;

  function resize() {
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Orbiting particles
  const NUM_ORBS = 28;
  const orbs = Array.from({ length: NUM_ORBS }, (_, i) => ({
    angle:  (i / NUM_ORBS) * Math.PI * 2,
    radius: 55 + Math.random() * 45,
    speed:  0.004 + Math.random() * 0.006,
    size:   1 + Math.random() * 2,
    alpha:  0.3 + Math.random() * 0.5,
  }));

  // Pulsing ring phases
  let pulse = 0;
  let textGlow = 0;

  function draw(ts) {
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    pulse = ts * 0.001;
    textGlow = (Math.sin(ts * 0.0015) + 1) / 2; // 0..1

    // Outer glow ring
    const ringR = Math.min(W, H) * 0.36 + Math.sin(pulse) * 4;
    const grad = ctx.createRadialGradient(cx, cy, ringR * 0.6, cx, cy, ringR + 18);
    grad.addColorStop(0, `rgba(126,184,247,${0.06 + textGlow * 0.04})`);
    grad.addColorStop(1, 'rgba(126,184,247,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, ringR + 18, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Dashed circle ring
    ctx.save();
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(126,184,247,${0.18 + textGlow * 0.1})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Orbiting dots
    orbs.forEach(o => {
      o.angle += o.speed;
      const x = cx + Math.cos(o.angle) * o.radius;
      const y = cy + Math.sin(o.angle) * o.radius;
      ctx.beginPath();
      ctx.arc(x, y, o.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(126,184,247,${o.alpha})`;
      ctx.fill();
    });

    // Connection lines between nearby orbs
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const ax = cx + Math.cos(orbs[i].angle) * orbs[i].radius;
        const ay = cy + Math.sin(orbs[i].angle) * orbs[i].radius;
        const bx = cx + Math.cos(orbs[j].angle) * orbs[j].radius;
        const by = cy + Math.sin(orbs[j].angle) * orbs[j].radius;
        const d  = Math.hypot(bx - ax, by - ay);
        if (d < 60) {
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(126,184,247,${(1 - d / 60) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // HA text — elegant, glowing
    const fontSize = Math.min(W, H) * 0.28;
    ctx.save();
    ctx.font = `300 ${fontSize}px 'Cormorant Garamond', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow glow
    ctx.shadowColor = `rgba(126,184,247,${0.4 + textGlow * 0.4})`;
    ctx.shadowBlur = 24 + textGlow * 16;
    ctx.fillStyle = `rgba(240,244,255,${0.85 + textGlow * 0.15})`;
    ctx.fillText('H.A.', cx, cy);

    // Second pass for sharper text on top
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(240,244,255,0.9)`;
    ctx.fillText('H.A.', cx, cy);
    ctx.restore();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ==========================================
   9. DEGREE PROGRESS BAR ANIMATION
   ========================================== */
function initProgressBar() {
  const bar = document.getElementById('degree-bar');
  if (!bar) return;

  const pct = parseInt(bar.dataset.pct, 10) || 0;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { bar.style.width = pct + '%'; }, 200);
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  io.observe(bar);
}

/* Re-init on DOMContentLoaded for pages that have these elements */
document.addEventListener('DOMContentLoaded', () => {
  initHaAvatar();
  initProgressBar();
});
