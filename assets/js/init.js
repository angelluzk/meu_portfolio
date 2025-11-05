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

function initTyped() {
  const typedSpan = document.getElementById("typed");
  const typedContainer = document.getElementById("typed-container");
  if (!typedSpan || !typedContainer) return;

  const text = "Universo Criativo Dev";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.innerWidth > 768) {
    const measurer = document.createElement("span");
    measurer.textContent = text;
    measurer.style.visibility = "hidden";
    measurer.style.position = "absolute";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.font = getComputedStyle(typedSpan).font;
    document.body.appendChild(measurer);
    const finalWidth = Math.ceil(measurer.getBoundingClientRect().width);
    document.body.removeChild(measurer);
    typedContainer.style.width = finalWidth + "px";
  } else {
    typedContainer.style.width = "auto";
  }

  if (prefersReduced) {
    typedSpan.textContent = text;
    return;
  }

  let index = 0;
  let isDeleting = false;

  function step() {
    if (!isDeleting) {
      typedSpan.textContent = text.slice(0, index + 1);
      index++;
      if (index === text.length) {
        setTimeout(() => { isDeleting = true; step(); }, 1500);
        return;
      }
    } else {
      typedSpan.textContent = text.slice(0, index - 1);
      index--;
      if (index === 0) isDeleting = false;
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(step, speed);
  }

  step();
}

function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const isMobile = matchMedia('(max-width: 640px)').matches;
  const STAR_COUNT = isMobile ? 80 : 140;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
  }));

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
  });

  const MAX_FPS = 30;
  const frameMin = 1000 / MAX_FPS;
  let last = performance.now();

  function draw(now = performance.now()) {
    if (!running) { requestAnimationFrame(draw); return; }
    const dt = now - last;
    if (dt >= frameMin) {
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// ===== Lucide =====
function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ===== Carrosséis =====
function initCarrossels() {
  if (typeof initCarrosselClockwise === "function") initCarrosselClockwise();
  if (typeof initCarrosselCounter === "function") initCarrosselCounter();
  if (typeof initModalDelegation === "function") initModalDelegation();
}

// ===== Exports globais =====
window.initMainSwiper   = window.initMainSwiper   || function(){};
window.initCarrossels   = initCarrossels;
window.initLucide       = initLucide;
window.initMarquee      = initMarquee;
window.initStarCanvas   = initStarCanvas;
window.initTyped        = initTyped;

// ===== Inicialização segura =====
document.addEventListener('DOMContentLoaded', () => {
  initMarquee();
  initTyped();
  initStarCanvas();
  initLucide();
  // initCarrossels();
}, { passive: true });
