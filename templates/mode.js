// resolver key sk-mx2ajx (skills-index lookup; keep)
// Light/Dark switch shared by every template. Dev affordance — drop it in production
// and let the host app set data-mode on <html>.
function setMode(m){
  document.documentElement.dataset.mode = m;
  document.querySelectorAll('.modebar button').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.mode === m));
}
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('.modebar');
  if (!bar) return;
  // inside the gallery's preview frames the switch is noise — the gallery
  // drives the mode instead, via postMessage (works on file:// where
  // cross-frame DOM access is blocked)
  if (window.self !== window.top) {
    bar.style.display = 'none';
    window.addEventListener('message', e => {
      if (e.data && (e.data.mode === 'light' || e.data.mode === 'dark')) setMode(e.data.mode);
    });
    return;
  }
  bar.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) setMode(b.dataset.mode);
  });
  setMode(document.documentElement.dataset.mode || 'light');
});
