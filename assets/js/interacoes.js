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
  }, { passive: true });

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
}, { passive: true });

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

// Inicializa navbar ao carregar
document.addEventListener('DOMContentLoaded', initNavbar, { passive: true });
