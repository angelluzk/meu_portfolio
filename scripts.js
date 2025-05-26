const canvas = document.getElementById('starCanvas');
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
  speed: Math.random() * 0.3 + 0.1,
  offsetX: 0,
  offsetY: 0
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x + star.offsetX, star.y + star.offsetY, star.radius, 0, 2 * Math.PI);
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

// Lucide
lucide.createIcons();

// Swiper
const swiper = new Swiper('.mySwiper', {
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

// Theme Toggle
const toggle = document.getElementById('themeToggle');
const circle = document.getElementById('toggleCircle');
const leftPos = 4;
const rightPos = toggle.clientWidth - circle.clientWidth - 4;
circle.style.left = leftPos + 'px';

toggle.addEventListener('click', () => {
  circle.style.left = circle.style.left === leftPos + 'px' ? rightPos + 'px' : leftPos + 'px';
});

// Marquee
const marquee1 = document.getElementById("marquee1");
const marquee2 = document.getElementById("marquee2");

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

// Scroll Button
document.addEventListener("DOMContentLoaded", function () {
  const scrollButton = document.getElementById("scrollButton");
  const sectionOrder = ["sobre", "mapa", "projetos", "laboratorio", "estudio", "contato"];

  window.addEventListener("scroll", () => {
    const sobreSection = document.getElementById("sobre");
    const contatoSection = document.getElementById("contato");

    const currentScroll = window.scrollY;
    const isBelowSobre = currentScroll >= sobreSection.offsetTop - 50;
    const isInContato = currentScroll + window.innerHeight >= contatoSection.offsetTop + contatoSection.offsetHeight / 2;

    if (isBelowSobre) {
      scrollButton.classList.remove("hidden");
      scrollButton.innerHTML = isInContato ?
        '<i class="fa-solid fa-arrow-up text-xl" aria-hidden="true"></i>' :
        '<i class="fa-solid fa-arrow-down text-xl" aria-hidden="true"></i>';
      scrollButton.setAttribute("aria-label", isInContato ? "Voltar para o topo" : "Ir para a próxima seção");
    } else {
      scrollButton.classList.add("hidden");
    }
  });

  scrollButton.addEventListener("click", () => {
    const currentScroll = window.scrollY;
    const contatoSection = document.getElementById("contato");
    const isInContato = currentScroll + window.innerHeight >= contatoSection.offsetTop + contatoSection.offsetHeight / 2;

    if (isInContato) {
      document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
    } else {
      for (let i = 0; i < sectionOrder.length; i++) {
        const currentSection = document.getElementById(sectionOrder[i]);
        const nextSection = document.getElementById(sectionOrder[i + 1]);
        const top = currentSection.offsetTop;
        const bottom = top + currentSection.offsetHeight;

        if (currentScroll >= top - 50 && currentScroll < bottom - 50) {
          if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
    }
  });
});

// Typed Text
document.addEventListener("DOMContentLoaded", function () {
  const text = "Universo Criativo Dev";
  const typedSpan = document.getElementById("typed");
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
});
