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
    glow.style.transform = `translate3d(${e.clientX - size}px, ${e.clientY - size}px, 0)`;
});


// ================== PARTICLE BACKGROUND ==================
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Create particles
class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = size;
        this.speed = (Math.random() * 2) + 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
    }

    update() {
        // Move slowly
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion effect
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let forceX = (dx / distance) * force * 6;
            let forceY = (dy / distance) * force * 6;

            this.x += forceX;
            this.y += forceY;
        } else {
            // Slowly return to base position
            this.x -= (this.x - this.baseX) * 0.02;
            this.y -= (this.y - this.baseY) * 0.02;
        }

        this.draw();
    }
}

function initParticles() {
    particles = [];
    const number = Math.floor((canvas.width * canvas.height) / 9000);

    for (let i = 0; i < number; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y, 1.4));
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animateParticles);
}
animateParticles();
