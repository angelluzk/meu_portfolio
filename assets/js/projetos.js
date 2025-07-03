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

  let galeriaState = {
    imagens: [],
    paginaAtual: 1,
    imagensPorPagina: 4,
  };

  function atualizarGaleria(modalContent) {
    const container = modalContent.querySelector('.galeria-imagens');
    const pagina = galeriaState.paginaAtual;
    const inicio = (pagina - 1) * galeriaState.imagensPorPagina;
    const fim = inicio + galeriaState.imagensPorPagina;
    const imagensPagina = galeriaState.imagens.slice(inicio, fim);

    container.innerHTML = '';

    imagensPagina.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Print do projeto';
      img.className = `
      w-full aspect-video object-cover
      rounded-2xl shadow-[0_4px_20px_rgba(255,255,255,0.05)]
      ring-1 ring-yellow-400/10 hover:ring-2 hover:ring-yellow-300
      hover:brightness-110 hover:scale-[1.03]
      transition-all duration-300 ease-in-out cursor-zoom-in
    `.trim();
      container.appendChild(img);
    });

    const pageDisplay = modalContent.querySelector('.galeria-page');
    if (pageDisplay) {
      const totalPaginas = Math.ceil(galeriaState.imagens.length / galeriaState.imagensPorPagina);
      pageDisplay.textContent = `Página ${pagina} de ${totalPaginas}`;
    }

    inicializarSwiperEZoom(modalContent);
  }

  // Função para abrir modal com animação e carregar galeria do JSON
  async function abrirModal(projeto) {
    const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
    if (!modal || !modalContent || !modalData) return;

    modalContent.innerHTML = modalData.innerHTML;

    modal.classList.remove("hidden");
    modal.classList.remove("animate-fadeOut");
    modal.classList.add("animate-fadeIn");

    const galeriaContainer = modalContent.querySelector('.galeria-imagens[data-projeto]');
    if (galeriaContainer) {
      try {
        const res = await fetch(`assets/data/galeria-${projeto}.json`);
        const imagens = await res.json();

        galeriaState.imagens = imagens;
        galeriaState.paginaAtual = 1;

        atualizarGaleria(modalContent);

        const btnPrev = modalContent.querySelector('.galeria-prev');
        const btnNext = modalContent.querySelector('.galeria-next');

        if (btnPrev && btnNext) {
          btnPrev.onclick = () => {
            if (galeriaState.paginaAtual > 1) {
              galeriaState.paginaAtual--;
              atualizarGaleria(modalContent);
            }
          };

          btnNext.onclick = () => {
            const maxPagina = Math.ceil(galeriaState.imagens.length / galeriaState.imagensPorPagina);
            if (galeriaState.paginaAtual < maxPagina) {
              galeriaState.paginaAtual++;
              atualizarGaleria(modalContent);
            }
          };
        }

      } catch (error) {
        console.error(`Erro ao carregar galeria do projeto ${projeto}:`, error);
      }
    }

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
  const imagens = modalContent.querySelectorAll('.galeria-imagens img');
  if (imagens.length && typeof mediumZoom !== 'undefined') {
    mediumZoom(imagens, {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.9)',
      scrollOffset: 0,
    });
  }
}