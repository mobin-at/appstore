const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
menuButton.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  menuButton.setAttribute('aria-expanded', String(!menu.hidden));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}));
const search = document.querySelector('.search-panel');
const input = search.querySelector('input');
document.querySelector('.search-button').addEventListener('click', () => {
  search.hidden = !search.hidden;
  if (!search.hidden) input.focus();
});
search.addEventListener('submit', event => event.preventDefault());
function filterGames() {
  let count = 0;
  document.querySelectorAll('.feed-card').forEach(card => {
    card.hidden = !card.dataset.name.includes(input.value.trim().toLowerCase());
    if (!card.hidden) count++;
  });
  document.querySelector('.empty').hidden = count > 0;
}
input.addEventListener('input', filterGames);
document.querySelector('.cancel-search').addEventListener('click', () => {
  input.value = '';
  filterGames();
  search.hidden = true;
});
document.querySelector('#appearance').addEventListener('click', () => document.body.classList.toggle('dark'));
