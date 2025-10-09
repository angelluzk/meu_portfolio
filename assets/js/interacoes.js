// ⭐ Canvas Estrelas SECTION HERO
const canvas = document.getElementById('starCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        offsetX: 0,
        offsetY: 0
    }));

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x + star.offsetX, star.y + star.offsetY, star.radius, 0, 2 * Math.PI);
            ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();
}

// ⭐ Scroll Button INDEX.HTML
document.addEventListener("DOMContentLoaded", function () {
    const scrollButton = document.getElementById("scrollButton");
    const sectionOrder = ["sobre", "mapa", "projetos", "laboratorio", "estudio", "mais-sobre-mim", "contato"];

    if (!scrollButton) return;

    window.addEventListener("scroll", () => {
        const sobreSection = document.getElementById("sobre");
        const contatoSection = document.getElementById("contato");

        if (!sobreSection || !contatoSection) return;

        const currentScroll = window.scrollY;
        const isBelowSobre = currentScroll >= sobreSection.offsetTop - 50;
        const isInContato = currentScroll + window.innerHeight >= contatoSection.offsetTop + contatoSection.offsetHeight / 2;

        if (isBelowSobre) {
            scrollButton.classList.remove("hidden");
            scrollButton.innerHTML = isInContato ?
                `<div class="rastro-container" aria-hidden="true">
                    <span class="rastro fumaca"></span>
                    <span class="rastro faisca"></span>
                    <span class="rastro faisca-pequena"></span>
                </div>
                <i class="fa-solid fa-arrow-up text-xl" aria-hidden="true"></i>` :
                `<div class="rastro-container" aria-hidden="true">
                    <span class="rastro fumaca"></span>
                    <span class="rastro faisca"></span>
                    <span class="rastro faisca-pequena"></span>
                </div>
                <i class="fa-solid fa-arrow-down text-xl" aria-hidden="true"></i>`;
            scrollButton.setAttribute("aria-label", isInContato ? "Voltar para o topo" : "Ir para a próxima seção");
        } else {
            scrollButton.classList.add("hidden");
        }
    });

    scrollButton.addEventListener("click", () => {
        const currentScroll = window.scrollY;
        const contatoSection = document.getElementById("contato");
        if (!contatoSection) return;

        const isInContato = currentScroll + window.innerHeight >= contatoSection.offsetTop + contatoSection.offsetHeight / 2;

        if (isInContato) {
            document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
        } else {
            for (let i = 0; i < sectionOrder.length; i++) {
                const currentSection = document.getElementById(sectionOrder[i]);
                const nextSection = document.getElementById(sectionOrder[i + 1]);
                if (!currentSection) continue;

                const top = currentSection.offsetTop;
                const bottom = top + currentSection.offsetHeight;

                if (currentScroll >= top - 50 && currentScroll < bottom - 50) {
                    if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
                    break;
                }
            }
        }
    });
});

// ⭐ Navbar Mobile do navbar.html
function initNavbar() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  if (!menuBtn || !menu) return;

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menuBtn.classList.toggle('open');
  });
}
