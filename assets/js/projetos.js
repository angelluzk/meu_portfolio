let swiperInstance = null;
let lastFocusedEl = null;

async function initProjetos() {
  const swiperWrapper = document.querySelector('.swiper-projetos .swiper-wrapper');
  if (!swiperWrapper) return;

  const allProjects = [
    { id: 'projeto-adote-pet',              categories: ['destaque', 'backend', 'academico'] },
    { id: 'projeto-reconhecimento-facial',  categories: ['destaque', 'backend'] },
    { id: 'projeto-controle-estoque-laravel', categories: ['destaque', 'backend'] },
    { id: 'projeto-controle-estoque-php',   categories: ['backend', 'academico'] },
    { id: 'meu-portfolio',                  categories: ['frontend'] },
    { id: 'landing-page-alta-conversao',    categories: ['frontend'] },
    { id: 'crud-completo-php',              categories: ['backend', 'academico'] },
    { id: 'projeto-motoxtreme',             categories: ['academico'] },
    { id: 'projeto-clinica-odontologica',   categories: ['academico'] },
    { id: 'projeto-mypetshow',              categories: ['academico'] }
  ];

  const updateCarousel = async (category) => {
    if (swiperInstance) { try { swiperInstance.destroy(true, true); } catch (e) {} swiperInstance = null; }
    swiperWrapper.innerHTML = '';

    const projectsToLoad = allProjects.filter(p => p.categories.includes(category));

    for (let project of projectsToLoad) {
      try {
        const res  = await fetch(`projetos/${project.id}.html`, { cache: 'force-cache' });
        const html = await res.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const card = tempDiv.querySelector('.card-projeto');
        if (card) {
          card.dataset.projeto = project.id;
          card.classList.add('swiper-slide');

          // imagens dos cards -> lazy/async
          card.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading'))  img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
          });

          swiperWrapper.appendChild(card);
        }
      } catch (err) {
        console.error(`Erro ao carregar ${project.id}:`, err);
      }
    }

    swiperInstance = initMainSwiper(projectsToLoad.length);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  };

  await preloadAllModals(allProjects);

  const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('is-active', 'active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');            // compat c/ CSS novo
      button.classList.add('active');               // compat c/ CSS antigo
      button.setAttribute('aria-selected', 'true');
      updateCarousel(button.dataset.category);
    });
  });

  const initialButton = document.querySelector('#project-filters .filter-btn[data-category="destaque"]');
  if (initialButton) {
    initialButton.classList.add('is-active', 'active');
    initialButton.setAttribute('aria-selected', 'true');
    await updateCarousel('destaque');
  }

  setupModalEventListeners();
  initLucide();
}

async function preloadAllModals(projects) {
  for (let project of projects) {
    try {
      if (document.querySelector(`.modal-content[data-projeto="${project.id}"]`)) continue;

      const res  = await fetch(`projetos/${project.id}.html`, { cache: 'force-cache' });
      const html = await res.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const content = tempDiv.querySelector('.modal-content');
      if (content) {
        content.classList.add('hidden');
        content.dataset.projeto = project.id;

        content.querySelectorAll('img').forEach(img => {
          if (!img.hasAttribute('loading'))  img.setAttribute('loading', 'lazy');
          if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });

        document.body.appendChild(content);
      }
    } catch (e) {}
  }
}

function initMainSwiper(slideCount) {
  const swiperContainer = document.querySelector('.mySwiper-projetos');
  if (!swiperContainer) return null;

  const count = slideCount || swiperContainer.querySelectorAll('.swiper-slide').length;

  if (swiperContainer.swiper) {
    try { swiperContainer.swiper.destroy(true, true); } catch (e) {}
  }

  const swiperOptions = {
    spaceBetween: 24,
    grabCursor: true,
    watchOverflow: true,
    preloadImages: false,
    lazy: true,
    a11y: { enabled: true },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: count > 1 ? { delay: 4500, disableOnInteraction: false } : false,
    speed: 800,
    loop: count > 3,                        // só loopa quando tem 4+
    centeredSlides: false,
    slidesPerView: 3,                        // base
    breakpoints: {
      320:  { slidesPerView: 1,   spaceBetween: 18 },
      640:  { slidesPerView: 1.5, spaceBetween: 20 },
      768:  { slidesPerView: 2,   spaceBetween: 22 },
      1280: { slidesPerView: 3,   spaceBetween: 24 },   // xl
      1536: { slidesPerView: 4,   spaceBetween: 24 },   // 2xl: preenche mais a tela
    },
  };

  const swiper = new Swiper('.mySwiper-projetos', swiperOptions);

  // Centraliza quando houver poucos slides
  const wrapper = swiperContainer.querySelector('.swiper-wrapper');
  if (wrapper) {
    if (count <= 2) wrapper.style.justifyContent = 'center';
    else wrapper.style.justifyContent = '';
  }

  return swiper;
}

let galeriaState = { imagens: [], paginaAtual: 1, imagensPorPagina: 4 };

function setupModalEventListeners() {
  const swiperContainer = document.querySelector('.swiper-projetos');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (swiperContainer) {
    swiperContainer.addEventListener('click', e => {
      const btn = e.target.closest('.ver-mais');
      if (btn) {
        const card = btn.closest('.card-projeto');
        if (card && card.dataset.projeto) abrirModal(card.dataset.projeto, btn);
      }
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', fecharModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

  document.addEventListener('keydown', (e) => {
    const visible = modal && !modal.classList.contains('hidden');
    if (visible && e.key === 'Escape') fecharModal();
  });
}

async function abrirModal(projeto, triggerEl) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
  if (!modal || !modalContent || !modalData) return;

  lastFocusedEl = triggerEl || document.activeElement;

  modalContent.innerHTML = modalData.innerHTML;

  modal.classList.remove("hidden");
  modal.classList.add("animate-fadeIn");
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) { try { closeBtn.focus(); } catch (e) {} }

  const galeriaContainer = modalContent.querySelector('.galeria-imagens');
  if (galeriaContainer) {
    try {
      const res = await fetch(`assets/data/galeria-${projeto}.json`, { cache: 'force-cache' });
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

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try { window.lucide.createIcons(); } catch (e) {}
  }
}

function fecharModal() {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  if (!modal) return;

  modal.classList.remove("animate-fadeIn");
  modal.classList.add("animate-fadeOut");
  document.body.style.overflow = 'auto';

  modal.addEventListener("animationend", () => {
    modal.classList.add("hidden");
    modal.classList.remove("animate-fadeOut");
    if (modalContent) modalContent.innerHTML = "";

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      try { lastFocusedEl.focus(); } catch (e) {}
    }
  }, { once: true });
}

function atualizarGaleria(modalContent) {
  const container = modalContent.querySelector('.galeria-imagens');
  if (!container) return;

  const pagina = galeriaState.paginaAtual;
  const inicio = (pagina - 1) * galeriaState.imagensPorPagina;
  const fim = inicio + galeriaState.imagensPorPagina;
  const imagensPagina = galeriaState.imagens.slice(inicio, fim);

  container.innerHTML = '';

  imagensPagina.forEach(src => {
    const avif = src.replace(/\.(png|jpg|jpeg|webp)$/i, '.avif');
    const webp = src.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');

    const picture = document.createElement('picture');

    const sAvif = document.createElement('source');
    sAvif.type = 'image/avif';
    sAvif.srcset = avif;

    const sWebp = document.createElement('source');
    sWebp.type = 'image/webp';
    sWebp.srcset = webp;

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Print do projeto';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className =
      'w-full aspect-video object-cover rounded-2xl shadow-[0_4px_20px_rgba(255,255,255,0.05)] ring-1 ring-yellow-400/10 hover:ring-2 hover:ring-yellow-300 hover:brightness-110 hover:scale-[1.03] transition-all duration-300 ease-in-out cursor-zoom-in';

    picture.appendChild(sAvif);
    picture.appendChild(sWebp);
    picture.appendChild(img);
    container.appendChild(picture);
  });

  const pageDisplay = modalContent.querySelector('.galeria-page');
  if (pageDisplay) {
    const totalPaginas = Math.ceil(galeriaState.imagens.length / galeriaState.imagensPorPagina);
    pageDisplay.textContent = `Página ${pagina} de ${totalPaginas}`;
  }

  inicializarSwiperEZoom(modalContent);
}

function inicializarSwiperEZoom(modalContent) {
  const imagens = modalContent.querySelectorAll('.galeria-imagens img');
  if (imagens.length && typeof mediumZoom !== 'undefined') {
    mediumZoom(imagens, { margin: 24, background: 'rgba(0, 0, 0, 0.9)', scrollOffset: 0 });
  }
}

// export p/ bootstrap externo
window.initProjetos = initProjetos;
