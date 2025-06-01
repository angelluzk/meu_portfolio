async function loadPartial(id, file) {
    const response = await fetch(`partials/${file}.html`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    // Sempre reexecuta os ícones do Lucide
 initLucide();

    switch (file) {
        case 'hero':
            initMainSwiper();
            initTyped();
            initStarCanvas();
            break;
        case 'laboratorio':
            initCarrossels();
            break;
        case 'projetos':
            initMainSwiper();
            initCarrossels();
            initMarquee();
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
        "contato",
        "footer"
    ];

    sections.forEach(section => loadPartial(section, section));
});