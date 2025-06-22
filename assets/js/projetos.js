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

  // Carrega os cards e conteúdos dos modais
  for (let projeto of projetos) {
    try {
      const res = await fetch(`projetos/${projeto}.html`);
      const html = await res.text();

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const card = tempDiv.querySelector('.card-projeto');
      if (card) {
        card.dataset.projeto = projeto;
        card.classList.add('swiper-slide');
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

  // Inicializa swiper e lucide (suponho que já existem essas funções)
  initMainSwiper();
  initLucide();

  // Função para abrir modal com animação
  function abrirModal(projeto) {
    const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
    if (!modal || !modalContent || !modalData) return;

    // Copia conteúdo do modal específico
    modalContent.innerHTML = modalData.innerHTML;

    // Remove classe hidden e adiciona animação fadeIn
    modal.classList.remove("hidden");
    modal.classList.remove("animate-fadeOut");
    modal.classList.add("animate-fadeIn");

    // Inicializa partículas (se quiser reiniciar ao abrir)
    iniciarParticulas();
  }

  // Função para fechar modal com animação
  function fecharModal() {
    if (!modal) return;
    modal.classList.remove("animate-fadeIn");
    modal.classList.add("animate-fadeOut");

    modal.addEventListener("animationend", () => {
      modal.classList.add("hidden");
      modal.classList.remove("animate-fadeOut");
      modalContent.innerHTML = "";
    }, { once: true });
  }

  // Evento para abrir modal ao clicar no "Ver mais"
  carrossel.addEventListener('click', e => {
    const btn = e.target.closest('.ver-mais');
    if (!btn) return;

    const card = btn.closest('.card-projeto');
    if (!card) return;

    const projeto = card.dataset.projeto;
    if (!projeto) return;

    abrirModal(projeto);
  });

  // Evento para fechar modal (botão fechar)
  if (closeModal) {
    closeModal.addEventListener('click', fecharModal);
  }

  // Fecha modal clicando fora do conteúdo
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        fecharModal();
      }
    });
  }
}
