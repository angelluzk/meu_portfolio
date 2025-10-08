let swiperInstance = null;

async function initProjetos() {
    const swiperWrapper = document.querySelector('.swiper-projetos .swiper-wrapper');
    if (!swiperWrapper) return;

    const allProjects = [
        { id: 'projeto-adote-pet', categories: ['destaque', 'backend', 'academico'] },
        { id: 'projeto-reconhecimento-facial', categories: ['destaque', 'backend'] },
        { id: 'projeto-controle-estoque-laravel', categories: ['destaque', 'backend'] },
        { id: 'projeto-controle-estoque-php', categories: ['backend', 'academico'] },
        { id: 'meu-portfolio', categories: ['frontend'] },
        { id: 'landing-page-alta-conversao', categories: ['frontend'] },
        { id: 'crud-completo-php', categories: ['backend', 'academico'] },
        { id: 'projeto-motoxtreme', categories: ['academico'] },
        { id: 'projeto-clinica-odontologica', categories: ['academico'] },
        { id: 'projeto-mypetshow', categories: ['academico'] }
    ];

    const updateCarousel = async (category) => {
        if (swiperInstance) {
            swiperInstance.destroy(true, true);
        }

        swiperWrapper.innerHTML = '';

        const projectsToLoad = allProjects.filter(p => p.categories.includes(category));

        for (let project of projectsToLoad) {
            try {
                const res = await fetch(`projetos/${project.id}.html`);
                const html = await res.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const card = tempDiv.querySelector('.card-projeto');
                if (card) {
                    card.dataset.projeto = project.id;
                    card.classList.add('swiper-slide');
                    swiperWrapper.appendChild(card);
                }
            } catch (error) {
                console.error(`Erro ao carregar ${project.id}:`, error);
            }
        }

        swiperInstance = initMainSwiper(projectsToLoad.length);
    };

    await preloadAllModals(allProjects);

    const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateCarousel(button.dataset.category);
        });
    });

    const initialButton = document.querySelector('#project-filters .filter-btn[data-category="destaque"]');
    if (initialButton) {
        initialButton.classList.add('active');
        await updateCarousel('destaque');
    }

    setupModalEventListeners();
    initLucide();
}

async function preloadAllModals(projects) {
    for (let project of projects) {
        try {

            if (document.querySelector(`.modal-content[data-projeto="${project.id}"]`)) continue;

            const res = await fetch(`projetos/${project.id}.html`);
            const html = await res.text();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const content = tempDiv.querySelector('.modal-content');
            if (content) {
                content.classList.add('hidden');
                content.dataset.projeto = project.id;
                document.body.appendChild(content);
            }
        } catch (e) { }
    }
}

function initMainSwiper(slideCount) {
    const swiperContainer = document.querySelector('.mySwiper-projetos');
    if (!swiperContainer) return null;

    const count = slideCount || swiperContainer.querySelectorAll('.swiper-slide').length;

    // Limpa qualquer Swiper anterior antes de recriar
    if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy(true, true);
    }

    const swiperOptions = {
        spaceBetween: 24,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        speed: 800,
        loop: count > 2, // só ativa loop se houver mais de 2
        centeredSlides: false,
        slidesPerView: 3,
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
        },
    };

    const swiper = new Swiper('.mySwiper-projetos', swiperOptions);

    // 🔹 Centraliza manualmente quando há 1 ou 2 slides
    if (count <= 2) {
        const wrapper = swiperContainer.querySelector('.swiper-wrapper');
        wrapper.style.justifyContent = 'center';
    }

    return swiper;
}


let galeriaState = { imagens: [], paginaAtual: 1, imagensPorPagina: 4 };

function setupModalEventListeners() {
    const swiperContainer = document.querySelector('.swiper-projetos');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');

    if (swiperContainer) {
        swiperContainer.addEventListener('click', e => {
            const btn = e.target.closest('.ver-mais');
            if (btn) {
                const card = btn.closest('.card-projeto');
                if (card && card.dataset.projeto) abrirModal(card.dataset.projeto);
            }
        });
    }

    if (closeModal) closeModal.addEventListener('click', fecharModal);
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });
}

async function abrirModal(projeto) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalData = document.querySelector(`.modal-content[data-projeto="${projeto}"]`);
    if (!modal || !modalContent || !modalData) return;

    modalContent.innerHTML = modalData.innerHTML;
    modal.classList.remove("hidden");
    modal.classList.add("animate-fadeIn");
    document.body.style.overflow = 'hidden';

    const galeriaContainer = modalContent.querySelector('.galeria-imagens');
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
        modalContent.innerHTML = "";
    }, { once: true });
}

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
        img.className = `w-full aspect-video object-cover rounded-2xl shadow-[0_4px_20px_rgba(255,255,255,0.05)] ring-1 ring-yellow-400/10 hover:ring-2 hover:ring-yellow-300 hover:brightness-110 hover:scale-[1.03] transition-all duration-300 ease-in-out cursor-zoom-in`.trim();
        container.appendChild(img);
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