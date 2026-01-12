function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
// ---------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.video-slider');
  if (!slider) return;

  const track = slider.querySelector('.vs-track');
  const slides = Array.from(track.querySelectorAll('.vs-slide'));
  const prevBtn = slider.querySelector('.vs-btn.prev');
  const nextBtn = slider.querySelector('.vs-btn.next');
  const dotsContainer = slider.querySelector('.vs-dots');
  const autoplay = slider.dataset.autoplay === 'true';

  let current = 0;
  let timer = null;

  // build dots
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'vs-dot';
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(btn);
  });

  const dots = Array.from(dotsContainer.children);

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function playCurrent() {
    slides.forEach((s, i) => {
      const v = s.querySelector('video');
      if (!v) return;
      if (i === current) {
        v.play().catch(() => {});
      } else {
        v.pause();
        try { v.currentTime = 0; } catch (e) {}
      }
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    track.style.transition = 'transform 0.5s ease';
    updateDots();
    playCurrent();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // autoplay
  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), 4000);
  }
  function stopAutoplay() { if (timer) { clearInterval(timer); timer = null; } }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // init
  // ensure track is flex and slides take 100%
  track.style.display = 'flex';
  slides.forEach(s => { s.style.flex = '0 0 100%'; });
  goTo(0);
  startAutoplay();
});
