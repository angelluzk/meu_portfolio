async function initProjetos() {
    const carrossel = document.querySelector('.swiper-projetos .swiper-wrapper');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');

    const projetos = [
        'projeto-adote-pet',
        'projeto-clinica-odontologica',
        'projeto-motoxtreme',
        'projeto-mypetshow',
        'projeto-reconhecimento-facial',
    ];

    for (let projeto of projetos) {
        try {
            const res = await fetch(`projetos/${projeto}.html`);
            const html = await res.text();

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const card = tempDiv.querySelector('.card-projeto');
            if (card) {
                card.dataset.projeto = projeto;
                card.classList.add('swiper-slide');  // <-- ADICIONADO
                carrossel.appendChild(card);
            }

            const content = tempDiv.querySelector('.modal-content');
            if (content) {
                content.classList.add('hidden');
                content.dataset.projeto = projeto;
                document.body.appendChild(content);
            }

        } catch (error) {
            console.error(`Erro ao carregar ${projeto}:`, error);
        }
    }

    // Inicializa o swiper
    initMainSwiper();
    initLucide();

    // ⭐ Evento para abrir o modal
    carrossel.addEventListener('click', e => {
        const btn = e.target.closest('.ver-mais');  // <-- APENAS .ver-mais
        if (!btn) return;

        const card = btn.closest('.card-projeto');
        if (!card) return;

        const projeto = card.dataset.projeto;
        if (!projeto) return;

        const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
        if (modal && modalContent && modalData) {
            modalContent.innerHTML = modalData.innerHTML;
            modal.classList.remove('hidden');
        }
    });

    // ⭐ Evento para fechar o modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
            modalContent.innerHTML = '';
        });
    }
}
