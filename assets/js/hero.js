// Direction is local to the track; Persian slide content keeps its RTL layout.
const hero = document.querySelector('.hero');
const track = hero.querySelector('.hero-track');
const slides = [...hero.querySelectorAll('.hero-slide')];
const dots = [...hero.querySelectorAll('.hero-dot')];
const autoplay = hero.querySelector('.hero-autoplay');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let timer;
let paused = reducedMotion.matches;
let hovered = false;
let visible = true;
let pointerStart = null;

function schedule() {
  clearTimeout(timer);
  if (paused || hovered || !visible || document.hidden || hero.contains(document.activeElement)) return;
  timer = setTimeout(() => showSlide(current + 1), 5500);
}
function showSlide(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
  dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  schedule();
}
function updatePlayback() {
  autoplay.setAttribute('aria-pressed', String(paused));
  autoplay.setAttribute('aria-label', paused ? 'شروع پخش خودکار' : 'توقف پخش خودکار');
  autoplay.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  schedule();
}
hero.querySelector('.hero-next').addEventListener('click', () => showSlide(current - 1));
hero.querySelector('.hero-prev').addEventListener('click', () => showSlide(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
autoplay.addEventListener('click', () => { paused = !paused; updatePlayback(); });
hero.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
hero.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
hero.addEventListener('pointerleave', () => { hovered = false; schedule(); });
hero.addEventListener('focusin', schedule);
hero.addEventListener('focusout', () => setTimeout(schedule, 0));
const viewport = hero.querySelector('.hero-viewport');
viewport.addEventListener('pointerdown', event => {
  if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  clearTimeout(timer);
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener('pointerup', event => {
  if (!pointerStart || pointerStart.id !== event.pointerId) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showSlide(current + (dx < 0 ? 1 : -1));
  else schedule();
});
viewport.addEventListener('pointercancel', () => { pointerStart = null; schedule(); });
document.addEventListener('visibilitychange', schedule);
reducedMotion.addEventListener('change', event => { paused = event.matches; updatePlayback(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0.25 }).observe(hero);
}
updatePlayback();
