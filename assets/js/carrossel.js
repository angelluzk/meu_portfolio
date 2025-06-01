// ⭐ Função para abrir o modal de zoom
function openModal(img) {
    const zoomImage = document.getElementById("zoomImage");
    const zoomModal = document.getElementById("zoomModal");
    if (!zoomImage || !zoomModal) return;

    zoomImage.src = img.src;
    zoomModal.classList.remove("hidden");
}

// ⭐ Função para fechar o modal de zoom
function closeModal() {
    const zoomModal = document.getElementById("zoomModal");
    if (!zoomModal) return;

    zoomModal.classList.add("hidden");
}

// ⭐ Inicialização da delegação de evento para imagens com classe .cursor-zoom-in
function initModalDelegation() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cursor-zoom-in')) {
            openModal(e.target);
        }
    });
}