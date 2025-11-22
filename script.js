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


// ================== PARTICLE BACKGROUND ==================
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

// Track mouse
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    // Trigger color pulse
    mouse.pulse = 1;
});


// ---------------------- PARTICLE CLASS ----------------------
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

        ctx.fillStyle = `rgba(255,255,255,${0.45 + mouse.pulse * 0.4})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion
        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let forceX = (dx / distance) * force * 6;
            let forceY = (dy / distance) * force * 6;

            this.x += forceX;
            this.y += forceY;
        } else {
            // Return to base
            this.x -= (this.x - this.baseX) * 0.02;
            this.y -= (this.y - this.baseY) * 0.02;
        }

        this.draw();
    }
}


// ---------------------- INIT PARTICLES ----------------------
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


// ---------------------- CONNECTING LINES ----------------------
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = dx * dx + dy * dy;

            if (distance < 14000) {
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


// ---------------------- ANIMATION LOOP ----------------------
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouse.pulse > 0) mouse.pulse -= 0.02;
    if (mouse.pulse < 0) mouse.pulse = 0;

    particles.forEach((p) => p.update());
    connectParticles();

    requestAnimationFrame(animateParticles);
}
animateParticles();

// ================== TYPEWRITER EFFECT (MULTI-LINE) ==================

document.addEventListener("DOMContentLoaded", () => {
    const typedElement = document.getElementById("typed-name");
    if (!typedElement) return;

    const texts = [
        "Hasan Ahmed",
        "Biochemistry Undergraduate",
        "Aspiring Physician Assistant"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        const currentText = texts[textIndex];

        if (!deleting) {
            // Typing forward
            typedElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                setTimeout(() => deleting = true, 900);
            }
        } else {
            // Deleting backward
            typedElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                deleting = false;
                textIndex = (textIndex + 1) % texts.length; // Move to next line
            }
        }

        const speed = deleting ? 70 : 110;
        setTimeout(typeEffect, speed);
    }

    typeEffect();
});

