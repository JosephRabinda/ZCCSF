/* ================================================================
   ZCCSF GRADUATION 2026 — MAIN JAVASCRIPT
   Controls:
   1. Countdown to 25 September 2026
   2. Responsive navigation
   3. Floating balloons
   4. Balloon pop + mini confetti
   5. Celebration confetti
   6. Scroll entrance animations
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCountdown();
    initBalloons();
    initRevealAnimations();
});

/* ================================================================
   01. RESPONSIVE NAVIGATION
   ================================================================ */
function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* ================================================================
   02. LIVE COUNTDOWN
   IMPORTANT:
   Target = 25 September 2026 at 00:00:00 local time.
   Change the date below if the graduation date changes.
   ================================================================ */
function initCountdown() {
    const countdown = document.getElementById("countdown");
    const complete = document.getElementById("countdown-complete");

    if (!countdown || !complete) return;

    // 25 September 2026 — local browser time
    const targetDate = new Date(2026, 8, 25, 0, 0, 0);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
        const now = new Date();
        const distance = targetDate.getTime() - now.getTime();

        if (distance <= 0) {
            countdown.hidden = true;
            complete.hidden = false;
            launchCelebration(90);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ================================================================
   03. FLOATING BALLOONS
   Elegant, subtle and interactive.
   Click a balloon → pop + small confetti.
   ================================================================ */
function initBalloons() {
    const field = document.getElementById("balloon-field");

    if (!field) return;

    const types = ["gold", "white", "green"];

    function createBalloon() {
        const balloon = document.createElement("span");
        balloon.className = `balloon ${types[Math.floor(Math.random() * types.length)]}`;

        balloon.style.left = `${Math.random() * 94 + 2}%`;
        balloon.style.setProperty("--duration", `${12 + Math.random() * 10}s`);
        balloon.style.transform = `scale(${0.65 + Math.random() * 0.5})`;

        balloon.addEventListener("click", () => {
            popBalloon(balloon);
        });

        field.appendChild(balloon);

        // Keep the page lightweight.
        setTimeout(() => balloon.remove(), 24000);
    }

    // Initial balloons
    for (let i = 0; i < 8; i++) {
        setTimeout(createBalloon, i * 650);
    }

    // Continue creating balloons slowly.
    setInterval(createBalloon, 2200);
}

function popBalloon(balloon) {
    const rect = balloon.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {
        createConfettiPiece(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
    }

    balloon.animate(
        [
            { transform: "scale(1)", opacity: 0.8 },
            { transform: "scale(1.35)", opacity: 0 }
        ],
        { duration: 220, easing: "ease-out" }
    );

    setTimeout(() => balloon.remove(), 230);
}

/* ================================================================
   04. CONFETTI
   ================================================================ */
function launchCelebration(amount = 70) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            createConfettiPiece(
                window.innerWidth / 2,
                Math.min(window.innerHeight * 0.35, 360),
                false
            );
        }, i * 12);
    }
}

function createConfettiPiece(originX, originY, small = false) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const colors = [
        "#075b35",
        "#0b7445",
        "#d6aa42",
        "#f4df9b",
        "#ffffff"
    ];

    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;

    const spread = small ? 75 : Math.max(window.innerWidth * 0.65, 300);
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() * (small ? 130 : 500)) + 60;

    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.width = `${small ? 5 : 6 + Math.random() * 5}px`;
    piece.style.height = `${small ? 7 : 8 + Math.random() * 8}px`;

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 1000);
}

/* ================================================================
   05. SCROLL REVEAL
   ================================================================ */
function initRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach(el => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    elements.forEach(el => observer.observe(el));
}

/* ================================================================
   06. SMALL CELEBRATION ON GRADUATES PAGE
   ================================================================ */
if (document.body.classList.contains("page-graduates")) {
    setTimeout(() => launchCelebration(30), 900);
}
