async function loadPartial(id, file) {
    const response = await fetch(`partials/${file}.html`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;

    initLucide();

    switch (file) {
        case 'navbar':
            initNavbar();
        break;
        case 'hero':
            initTyped();
            initStarCanvas();
            break;
        case 'projetos':
            initMarquee();
            initProjetos();
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