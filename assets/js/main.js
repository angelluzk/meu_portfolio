async function loadPartial(id, file) {
    const response = await fetch(`partials/${file}.html`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    // Sempre reexecuta os ícones do Lucide após carregar qualquer parcial
    initLucide();

    // Inicializa funções específicas por seção
    switch (file) {
        case 'hero':
            initTyped();
            initStarCanvas();
            break;
        case 'projetos':
            initMainSwiper();
            initMarquee();
            initProjetos(); // ⭐ Chama a função que carrega os projetos dinamicamente
            break;
        case 'laboratorio':
            initCarrossels();
            break;
        case 'skills':
            initMarquee();
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const sections = [
        "navbar",
        "hero",
        "sobre",
        "mapa",
        "projetos",
        "laboratorio",
        "estudio",
        "mais-sobre-mim",
        "contato",
        "footer"
    ];

    sections.forEach(section => loadPartial(section, section));
});