// ⭐ Inicialização dos carrosséis do Laboratório Criativo
function initCarrosselClockwise() {
    const containers = document.querySelectorAll('.carousel-clockwise');
    if (!containers.length) return;

    containers.forEach(container => {
        new Swiper(container, {
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false
            },
            speed: 1000,
            slidesPerView: 3,
            spaceBetween: 30,
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 2, spaceBetween: 30 }
            }
        });
    });
}

function initCarrosselCounter() {
    const containers = document.querySelectorAll('.carousel-counter');
    if (!containers.length) return;

    containers.forEach(container => {
        new Swiper(container, {
            loop: true,
            autoplay: {
                delay: 2500,
                reverseDirection: true,
                disableOnInteraction: false
            },
            speed: 1000,
            slidesPerView: 3,
            spaceBetween: 30,
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
            }
        });
    });
}

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
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('cursor-zoom-in')) {
            openModal(e.target);
        }
    });
}