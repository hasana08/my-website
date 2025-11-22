// ================== YEAR + FADE-IN ==================
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    document.querySelectorAll(".fade-in").forEach((el) => {
        requestAnimationFrame(() => el.classList.add("visible"));
    });
});

// ================== CURSOR GLOW ==================
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
    if (!glow) return;
    const size = glow.offsetWidth / 2;
    glow.style.transform =
        `translate3d(${e.clientX - size}px, ${e.clientY - size}px, 0)`;
});

// ================== PARTICLES ==================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 140, pulse: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
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
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.5 + mouse.pulse})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let fx = (dx / distance) * force * 6;
            let fy = (dy / distance) * force * 6;
            this.x += fx;
            this.y += fy;
        } else {
            this.x -= (this.x - this.baseX) * 0.02;
            this.y -= (this.y - this.baseY) * 0.02;
        }
        this.draw();
    }
}

function initParticles() {
    particles = [];
    let number = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < number; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1.4
        ));
    }
}
initParticles();

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < 15000) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255,255,255,0.12)";
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mouse.pulse > 0) mouse.pulse -= 0.02;
    particles.forEach((p) => p.update());
    connectParticles();
    requestAnimationFrame(animate);
}
animate();

// ================== TYPING TEXT (MULTI-PHRASE, HOME ONLY) ==================
document.addEventListener("DOMContentLoaded", () => {
    const typed = document.getElementById("typed-name");
    if (!typed) return; // safely does nothing on about.html

    const phrases = [
        "Hasan Ahmed",
        "Biochemistry Undergraduate",
        "Aspiring Physician Assistant"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function loop() {
        const current = phrases[phraseIndex];

        typed.textContent = current.substring(0, charIndex);

        if (!deleting) {
            if (charIndex < current.length) {
                charIndex++;
            } else {
                setTimeout(() => (deleting = true), 900);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
            } else {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        const speed = deleting ? 70 : 120;
        setTimeout(loop, speed);
    }

    loop();
});
