// ⭐ Inicialização do Swiper principal (.mySwiper)
function initMainSwiper() {
    const swiperContainer = document.querySelector('.mySwiper');
    if (!swiperContainer) return;

    new Swiper('.mySwiper', {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 1,
        centeredSlides: true,
        grabCursor: true,
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet bg-yellow-400 opacity-80',
            bulletActiveClass: 'swiper-pagination-bullet-active bg-yellow-600',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

// ⭐ Inicialização dos carrosséis no Laboratório Criativo
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

// ⭐ Inicialização do Marquee
function initMarquee() {
    const marquee1 = document.getElementById("marquee1");
    const marquee2 = document.getElementById("marquee2");
    if (!marquee1 || !marquee2) return;

    let pos1 = 0;
    let pos2 = marquee1.offsetWidth;
    const speed = 1.2;

    function animateMarquee() {
        pos1 -= speed;
        pos2 -= speed;

        if (pos1 <= -marquee1.offsetWidth) pos1 = pos2 + marquee2.offsetWidth;
        if (pos2 <= -marquee2.offsetWidth) pos2 = pos1 + marquee1.offsetWidth;

        marquee1.style.transform = `translateX(${pos1}px)`;
        marquee2.style.transform = `translateX(${pos2}px)`;

        requestAnimationFrame(animateMarquee);
    }

    animateMarquee();
}

// ⭐ Inicialização do Typed Text
function initTyped() {
    const typedSpan = document.getElementById("typed");
    if (!typedSpan) return;

    const text = "Universo Criativo Dev";
    let index = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!isDeleting) {
            typedSpan.textContent = text.substring(0, index + 1);
            index++;
            if (index === text.length) {
                setTimeout(() => { isDeleting = true; typeEffect(); }, 1500);
                return;
            }
        } else {
            typedSpan.textContent = text.substring(0, index - 1);
            index--;
            if (index === 0) isDeleting = false;
        }
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }

    typeEffect();
}

// ⭐ Inicialização do Star Canvas
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1
    }));

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();
}

// ⭐ Reexecução dos ícones do Lucide após carregar parciais
function initLucide() {
    lucide.createIcons();
}

// ⭐ Inicialização consolidada de todos os carrosséis
function initCarrossels() {
    initCarrosselClockwise();
    initCarrosselCounter();
}