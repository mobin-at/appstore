// Preview-only theme editor. Alpha applies to colors, never the whole element.
(() => {
  const storageKey = 'appstore-theme-lab-v1';
  const defaults = {
    surface: ['#111111', 100, '--surface'],
    onSurface: ['#ffffff', 100, '--on-surface'],
    background: ['#ffffff', 100, '--background'],
    text: ['#111111', 100, '--text'],
    muted: ['#111111', 100, '--muted'],
    buttons: ['#111111', 100, '--header-button'],
    buttonText: ['#ffffff', 100, '--header-icon'],
    primary: ['#171717', 100, '--primary'],
    line: ['#111111', 100, '--line'],
    heroShade: ['#000000', 100, '--hero-shade'],
  };
  const target = document.querySelector('#theme-target');
  const color = document.querySelector('#theme-color');
  const hex = document.querySelector('#theme-hex');
  const opacity = document.querySelector('#theme-opacity');
  const output = document.querySelector('#theme-opacity-value');
  const status = document.querySelector('#theme-status');
  const settings = document.querySelector('#theme-settings');
  const linkHeader = document.querySelector('#theme-link-header');
  let state = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { color: value[0], opacity: value[1] }]));
  const validColor = value => /^#[0-9a-f]{6}$/i.test(value);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    for (const key of Object.keys(defaults)) {
      const value = saved?.[key];
      if (value && validColor(value.color) && Number.isFinite(value.opacity) && value.opacity >= 0 && value.opacity <= 100) state[key] = value;
    }
  } catch { /* Storage can be unavailable in private browsers. */ }
  function rgba(value) {
    const rgb = [1, 3, 5].map(start => parseInt(value.color.slice(start, start + 2), 16));
    return `rgba(${rgb.join(', ')}, ${value.opacity / 100})`;
  }
  function apply() {
    for (const key of Object.keys(defaults)) document.body.style.setProperty(defaults[key][2], rgba(state[key]));
    settings.value = JSON.stringify(state, null, 2);
  }
  function syncControls() {
    const value = state[target.value];
    color.value = value.color;
    hex.value = value.color;
    hex.setCustomValidity('');
    opacity.value = value.opacity;
    output.value = `${value.opacity.toLocaleString('fa-IR')}٪`;
  }
  function linkHeaderColors() {
    if (!linkHeader.checked) return;
    if (target.value === 'surface') state.buttons = { ...state.surface };
    if (target.value === 'onSurface') state.buttonText = { ...state.onSurface };
    if (target.value === 'buttons') state.surface = { ...state.buttons };
    if (target.value === 'buttonText') state.onSurface = { ...state.buttonText };
  }
  linkHeader.addEventListener('change', () => { if (linkHeader.checked) { linkHeaderColors(); save(); } });
  function save() {
    linkHeaderColors();
    apply();
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { status.textContent = 'تغییرات فعال است؛ ذخیره در این مرورگر امکان‌پذیر نیست.'; }
  }
  target.addEventListener('change', syncControls);
  color.addEventListener('input', () => { state[target.value].color = color.value; hex.value = color.value; hex.setCustomValidity(''); save(); });
  hex.addEventListener('input', () => {
    if (!validColor(hex.value)) { hex.setCustomValidity('کد کامل رنگ مانند #111111 وارد کن.'); return; }
    hex.setCustomValidity('');
    state[target.value].color = hex.value.toLowerCase(); color.value = hex.value; save();
  });
  hex.addEventListener('blur', () => { if (!validColor(hex.value)) syncControls(); });
  opacity.addEventListener('input', () => {
    state[target.value].opacity = Number(opacity.value);
    output.value = `${Number(opacity.value).toLocaleString('fa-IR')}٪`;
    save();
  });
  document.querySelector('#theme-reset').addEventListener('click', () => {
    state = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, { color: value[0], opacity: value[1] }]));
    save(); syncControls(); status.textContent = 'همهٔ رنگ‌ها و شفافیت‌ها به طرح اصلی برگشتند.';
  });
  document.querySelector('#theme-export').addEventListener('click', () => {
    settings.hidden = !settings.hidden;
    if (!settings.hidden) { settings.focus(); settings.select(); }
  });
  // Keep the existing light/dark switch in sync with the editor's displayed values.
  document.querySelector('#appearance').addEventListener('click', () => {
    const dark = document.body.classList.contains('dark');
    for (const [key, value] of Object.entries({ background: dark ? '#17191a' : '#ffffff', text: dark ? '#ffffff' : '#111111', muted: dark ? '#ffffff' : '#111111' })) state[key] = { color: value, opacity: 100 };
    save(); syncControls();
  });
  apply(); syncControls();
})();
