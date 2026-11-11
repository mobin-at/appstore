// Design preview: repeat the five supplied games in asynchronously appended batches.
(() => {
  const sourceCards = [...document.querySelectorAll('#trending .category-card')];
  const grid = document.querySelector('.discovery-grid');
  const sentinel = document.querySelector('.discovery-sentinel');
  const loading = document.querySelector('.discovery-loading');
  const more = document.querySelector('.load-more-games');
  const count = document.querySelector('.discovery-count');
  const empty = document.querySelector('.discovery-empty');
  const searchInput = document.querySelector('#game-search');
  const batchSize = 12;
  let total = 0;
  let busy = false;

  function filterDiscovery() {
    const query = normalize(searchInput.value);
    let visible = 0;
    grid.querySelectorAll('.discovery-card').forEach(card => {
      card.hidden = !normalize(`${card.dataset.name} ${card.dataset.tags}`).includes(query);
      if (!card.hidden) visible++;
    });
    empty.hidden = visible > 0;
  }
  function appendBatch() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < batchSize; i++) {
      const card = sourceCards[(total + i) % sourceCards.length].cloneNode(true);
      card.classList.add('discovery-card');
      card.querySelector('img').draggable = false;
      fragment.append(card);
    }
    grid.append(fragment);
    total += batchSize;
    count.textContent = `${total.toLocaleString('fa-IR')} بازی بارگذاری شده`;
    filterDiscovery();
  }
  async function loadMore() {
    if (busy || !sourceCards.length) return;
    busy = true;
    loading.hidden = false;
    more.disabled = true;
    grid.setAttribute('aria-busy', 'true');
    // A short simulated request makes the loading state inspectable in this preview.
    await new Promise(resolve => setTimeout(resolve, 850));
    appendBatch();
    busy = false;
    loading.hidden = true;
    more.disabled = false;
    grid.setAttribute('aria-busy', 'false');
  }
  more.addEventListener('click', loadMore);
  searchInput.addEventListener('input', filterDiscovery);
  document.querySelector('.cancel-search').addEventListener('click', filterDiscovery);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') filterDiscovery(); });
  appendBatch();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !searchInput.value.trim()) loadMore();
    }, { rootMargin: '0px 0px 80px 0px' }).observe(sentinel);
  }
})();
