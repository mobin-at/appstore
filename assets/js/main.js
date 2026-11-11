const search = document.querySelector('.search-panel');
const input = search.querySelector('input');
const searchButton = document.querySelector('.search-button');

function openSearch() {
  search.hidden = false;
  searchButton.setAttribute('aria-expanded', 'true');
  search.scrollIntoView({ block: 'center' });
  input.focus({ preventScroll: true });
}
searchButton.addEventListener('click', () => search.hidden ? openSearch() : closeSearch());
document.querySelector('.nav-search').addEventListener('click', openSearch);
search.addEventListener('submit', event => event.preventDefault());

// Match Persian and Arabic letter variants, spaces, and English titles.
function normalize(value) {
  return value.toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک')
    .replace(/[\u064b-\u065f\u0670]/g, '').replace(/[\s\u200c]+/g, ' ').trim();
}
function filterGames() {
  const query = normalize(input.value);
  let count = 0;
  document.querySelectorAll('.feed-card').forEach(card => {
    card.hidden = !normalize(`${card.dataset.name} ${card.dataset.tags}`).includes(query);
    if (!card.hidden) count++;
  });
  document.querySelector('.empty').hidden = count > 0;
  document.querySelector('.search-status').textContent = query
    ? `${count.toLocaleString('fa-IR')} بازی پیدا شد` : '';
}
input.addEventListener('input', filterGames);
function closeSearch() {
  input.value = '';
  filterGames();
  search.hidden = true;
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.focus({ preventScroll: true });
}
document.querySelector('.cancel-search').addEventListener('click', closeSearch);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
      if (!search.hidden) closeSearch();
  }
});
const account = document.querySelector('#account');
document.querySelectorAll('[data-account]').forEach(button => {
  button.addEventListener('click', () => account.showModal());
});
account.querySelectorAll('.close, .dialog-done').forEach(button => {
  button.addEventListener('click', () => account.close());
});
