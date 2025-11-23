// ================== YEAR + FADE-IN ==================
document.addEventListener("DOMContentLoaded", () => {
    // YEAR
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // FADE-IN
    const fadeIns = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeIns.forEach((el) => observer.observe(el));
});


// ================== CURSOR GLOW ==================
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
    if (!glow) return;
    const size = glow.offsetWidth / 2;
    glow.style.transform = `translate3d(${e.clientX - size}px, ${e.clientY - size}px, 0)`;
});


// ================== PARTICLE BACKGROUND ==================
const canvas = document.getElementById("bg-canvas");
let ctx = null;

// Only get context if canvas exists
if (canvas) ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 140, pulse: 0 };

function resizeCanvas() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.pulse = 1;
});

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        const alpha = 0.35 + mouse.pulse * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        if (!ctx) return;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const fx = (dx / distance) * force * 6;
                const fy = (dy / distance) * force * 6;
                this.x += fx;
                this.y += fy;
            } else {
                this.x -= (this.x - this.baseX) * 0.02;
                this.y -= (this.y - this.baseY) * 0.02;
            }
        }

        this.draw();
    }
}

function initParticles() {
    if (!canvas || !ctx) return;
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 9000);

    for (let i = 0; i < count; i++) {
        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                1.4
            )
        );
    }
}

function connectParticles() {
    if (!ctx) return;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 15000) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255,255,255,0.12)";
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.pulse > 0) {
        mouse.pulse -= 0.02;
        if (mouse.pulse < 0) mouse.pulse = 0;
    }

    particles.forEach((p) => p.update());
    connectParticles();

    requestAnimationFrame(animateParticles);
}

animateParticles();


// ================== TYPING EFFECT ==================
document.addEventListener("DOMContentLoaded", () => {
    const typedEl = document.getElementById("typed-text");
    if (!typedEl) return;

    const phrases = [
        "Hasan Ibn Ahmed",
        "Biochemistry Undergraduate",
        "Aspiring Physician Assistant"
    ];

