// ========== YEAR ==========
document.addEventListener("DOMContentLoaded", () => {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
});

// ========== CURSOR GLOW ==========
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
    if (!glow) return;
    const r = glow.offsetWidth / 2;
    glow.style.transform = `translate3d(${e.clientX - r}px, ${e.clientY - r}px, 0)`;
});

// ========== PARTICLES BACKGROUND ==========
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 140, pulse: 0 };

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
}
resize();
addEventListener("resize", resize);

addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.pulse = 1;
});

class Particle {
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.s = s;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.3 + mouse.pulse * 0.4})`;
        ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < mouse.radius) {
            const f = (mouse.radius - d) / mouse.radius;
            this.x += (dx / d) * f * 6;
            this.y += (dy / d) * f * 6;
        } else {
            this.x -= (this.x - this.baseX) * 0.02;
            this.y -= (this.y - this.baseY) * 0.02;
        }
        this.draw();
    }
}

function initParticles() {
    particles = [];
    const count = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, 1.4));
    }
}

function connect() {
    particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            if (dx * dx + dy * dy < 15000) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255,255,255,0.12)";
                ctx.lineWidth = 0.6;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.pulse > 0) mouse.pulse -= 0.02;
    if (mouse.pulse < 0) mouse.pulse = 0;

    particles.forEach((p) => p.update());
    connect();

    requestAnimationFrame(animate);
}
animate();

// ========== TYPING EFFECT (FIXED) ==========
document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("typed-text");
    if (!el) return;

    const phrases = [
        "Hasan Ibn Ahmed",
        "Biochemistry Undergraduate",
        "Aspiring Physician Assistant"
    ];

    let i = 0, j = 0, deleting = false;

    function loop() {
        const word = phrases[i];
        el.textContent = word.substring(0, j);

        if (!deleting) {
            if (j < word.length) j++;
            else setTimeout(() => (deleting = true), 900);
        } else {
            if (j > 0) j--;
            else {
                deleting = false;
                i = (i + 1) % phrases.length;
            }
        }

        setTimeout(loop, deleting ? 60 : 120);
    }

    loop();
});
