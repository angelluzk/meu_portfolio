async function initProjetos() {
  const carrossel = document.querySelector('.swiper-wrapper');
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

      const card = tempDiv.querySelector('.swiper-slide');
      if (card) {
        card.dataset.projeto = projeto; // adiciona atributo data-projeto no slide
        carrossel.appendChild(card);
      }

      const content = tempDiv.querySelector('.modal-content');
      if (content) {
        content.classList.add('hidden'); // garante que está oculto
        content.dataset.projeto = projeto;
        document.body.appendChild(content);
      }

    } catch (error) {
      console.error(`Erro ao carregar ${projeto}:`, error);
    }
  }

  initMainSwiper();
  initLucide();

  carrossel.addEventListener('click', e => {
    const btn = e.target.closest('.saiba-mais');
    if (!btn) return;

    const slide = btn.closest('.swiper-slide');
    if (!slide) return;

    const projeto = slide.dataset.projeto;
    if (!projeto) return;

    const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
    if (modalContent && modalData && modal) {
      modalContent.innerHTML = modalData.innerHTML;
      modal.classList.remove('hidden');
    }
  });

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      modalContent.innerHTML = '';
    });
  }
}