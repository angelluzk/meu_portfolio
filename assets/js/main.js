async function loadPartial(id, file) {
    const response = await fetch(`partials/${file}.html`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    const sections = ["navbar", "hero", "sobre", "mapa", "projetos", "laboratorio", "estudio", "contato", "footer"];
    sections.forEach(section => loadPartial(section, section));
});