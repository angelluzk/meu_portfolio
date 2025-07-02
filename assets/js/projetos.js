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

  // Inicializa swiper e lucide
  initMainSwiper();
  initLucide();

  // Função para abrir modal com animação e carregar galeria do JSON
  async function abrirModal(projeto) {
    const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
    if (!modal || !modalContent || !modalData) return;

    // Copia conteúdo do modal específico
    modalContent.innerHTML = modalData.innerHTML;

    // Remove classe hidden e adiciona animação fadeIn
    modal.classList.remove("hidden");
    modal.classList.remove("animate-fadeOut");
    modal.classList.add("animate-fadeIn");

    // Seleciona container da galeria no modal inserido
    const galeriaContainer = modalContent.querySelector('.galeria-imagens[data-projeto]');
    if (galeriaContainer) {
      try {
        // Busca JSON da galeria daquele projeto
        const res = await fetch(`assets/data/galeria-${projeto}.json`);
        const imagens = await res.json();

        // Limpa a galeria antes de inserir
        galeriaContainer.innerHTML = '';

        // Cria e insere as imagens na galeria
        imagens.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.alt = `Print do projeto ${projeto}`;
          img.className = 'rounded-xl shadow-lg cursor-zoom-in hover:scale-[1.02] transition-transform duration-300';
          galeriaContainer.appendChild(img);
        });

        // Inicializa zoom nas imagens
        inicializarSwiperEZoom(modalContent);

      } catch (error) {
        console.error(`Erro ao carregar galeria do projeto ${projeto}:`, error);
      }
    }

    // Inicializa partículas
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

// Função para inicializar zoom nas imagens
function inicializarSwiperEZoom(modalContent) {
  const imagens = modalContent.querySelectorAll('img');
  if (imagens.length && typeof mediumZoom !== 'undefined') {
    mediumZoom(imagens, {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.9)',
      scrollOffset: 0,
    });
  }
}