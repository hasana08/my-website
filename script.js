// Update footer year
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Trigger fade-in
    document.querySelectorAll(".fade-in").forEach((el) => {
        requestAnimationFrame(() => {
            el.classList.add("visible");
        });
    });
});

// Cursor-follow glow
const glow = document.querySelector(".cursor-glow");

if (glow) {
    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const size = glow.offsetWidth / 2;
        glow.style.transform = `translate3d(${x - size}px, ${y - size}px, 0)`;
    });
}
