document.addEventListener('DOMContentLoaded', function () {
    // Carrossel 1: sentido horário
    new Swiper('.carousel-clockwise', {
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
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 }
        }
    });

    // Carrossel 2: sentido anti-horário
    new Swiper('.carousel-counter', {
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
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 }
        }
    });

    // Carrossel 3
    new Swiper('.carousel-clockwise:last-of-type', {
        loop: true,
        autoplay: {
            delay: 2200,
            disableOnInteraction: false
        },
        speed: 1000,
        slidesPerView: 3,
        spaceBetween: 30,
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 2, spaceBetween: 20 }
        }
    });
});


function openModal(img) {
    document.getElementById("zoomImage").src = img.src;
    document.getElementById("zoomModal").classList.remove("hidden");
}
function closeModal() {
    document.getElementById("zoomModal").classList.add("hidden");
}