// Touch and trackpad scrolling stay native; mouse users can also grab the rail.
document.querySelectorAll('.game-rail').forEach(rail => {
  let drag = null;
  rail.querySelectorAll('img').forEach(image => { image.draggable = false; });
  rail.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, scroll: rail.scrollLeft, moved: false };
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId || !(event.buttons & 1)) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    rail.scrollLeft = drag.scroll - distance;
  });
  function finish(event) {
    if (!drag || drag.id !== event.pointerId) return;
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    drag = null;
    rail.classList.remove('is-dragging');
  }
  rail.addEventListener('pointerup', finish);
  rail.addEventListener('pointercancel', finish);
  rail.addEventListener('lostpointercapture', () => { drag = null; rail.classList.remove('is-dragging'); });
  rail.addEventListener('pointerleave', event => { if (drag && !drag.moved) finish(event); });
  rail.addEventListener('dragstart', event => event.preventDefault());
  rail.addEventListener('selectstart', event => { if (drag) event.preventDefault(); });
});
