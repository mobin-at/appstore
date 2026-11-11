const categoryTitles = {
  trending: 'بازی‌های محبوب این روزها',
  'online-games': 'با هم بازی کنیم',
  'word-puzzle-games': 'جورچین و دنیای کلمات',
  discovery: 'کشف و بازی‌های بیشتر',
};
const categoryId = new URLSearchParams(location.search).get('category');
const categoryTitle = categoryTitles[categoryId] || 'بازی‌های بیشتر';
document.querySelector('#category-page-title').textContent = categoryTitle;
document.title = `${categoryTitle} | کاتینگ اج`;
