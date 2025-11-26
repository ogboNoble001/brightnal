document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-url]');
  if (!el) return;
  const url = el.dataset.url;
  window.location.href = `/${url}`;
});