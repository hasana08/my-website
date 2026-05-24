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

    const COUNT = Math.min(100, Math.floor((W * H) / 14000));
    const CONNECTION_DIST = 130;
    const MOUSE_REPEL = 120;
    const SPEED = 0.35;

    canvas.width = W;
    canvas.height = H;

    class Particle {
      constructor() { this.reset(true); }

      reset(initial) {
        this.x  = Math.random() * W;
        this.y  = initial ? Math.random() * H : -10;
        this.vx = (Math.random() - 0.5) * SPEED;
        this.vy = (Math.random() - 0.5) * SPEED;
        this.r  = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.45 + 0.1;
      }

      update() {
        /* Mouse repulsion */
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL) {
          const force = (MOUSE_REPEL - dist) / MOUSE_REPEL;
          this.vx += (dx / dist) * force * 0.6;
          this.vy += (dy / dist) * force * 0.6;
        }

        /* Damping */
        this.vx *= 0.985;
        this.vy *= 0.985;

        /* Clamp speed */
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) { this.vx *= 2 / speed; this.vy *= 2 / speed; }

        this.x += this.vx;
        this.y += this.vy;

        /* Wrap */
        if (this.x < -20) this.x = W + 20;
        if (this.x > W + 20) this.x = -20;
        if (this.y < -20) this.y = H + 20;
        if (this.y > H + 20) this.y = -20;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126,184,247,${this.alpha})`;
        ctx.fill();
      }
    }

    function buildParticles() {
      particles = [];
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(126,184,247,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(loop);
    }

    buildParticles();
    loop();

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      buildParticles();
    });

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    /* Touch support */
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

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    (function animate() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(animate);
    })();
  }

  /* ==========================================
     3. TYPING EFFECT
     ========================================== */
  function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const phrases = [
      'Hasan Ahmed',
      'Pre-Medicine',
      'Biochemistry',
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
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 70 + Math.random() * 40);
      } else {
        el.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 420);
          return;
        }
        setTimeout(tick, 38 + Math.random() * 20);
      }
    }

    setTimeout(tick, 600);
  }

  /* ==========================================
     4. NAVBAR SCROLL STATE
     ========================================== */
  function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================
     5. ACTIVE NAV LINK
     ========================================== */
  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
    });
  }

  /* ==========================================
     6. FADE-IN ON SCROLL
     ========================================== */
  function initFadeIns() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => io.observe(el));
  }

  /* ==========================================
     7. SMOOTH SECTION SCROLL FOR SAME-PAGE
     ========================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ==========================================
     INIT ALL
     ========================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initTyping();
    initNav();
    setActiveNav();
    initFadeIns();
    initSmoothScroll();
  });

})();
