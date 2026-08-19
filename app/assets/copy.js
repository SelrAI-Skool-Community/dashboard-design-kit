/* One job: put a prompt on the clipboard. No framework, no dependency.

   The async clipboard API is blocked in more places than you would think —
   an iframe, a page opened straight off the filesystem, a browser that has
   not been granted permission. Every one of those paths falls through to the
   old textarea trick, and the button tells the truth either way. A silent
   no-op here would break the one interaction this whole dashboard is built
   around. */
(function () {
  function flash(btn, ok) {
    var row = btn.closest('.prompt__row') || btn.parentNode;
    var note = row.querySelector('.copied');
    if (note) note.textContent = ok ? 'Copied' : 'Press Cmd+C to copy';
    row.classList.add('is-copied');
    setTimeout(function () { row.classList.remove('is-copied'); }, 2400);
  }

  function fallback(text) {
    var t = document.createElement('textarea');
    t.value = text;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.top = '-1000px';
    document.body.appendChild(t);
    t.select();
    t.setSelectionRange(0, t.value.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(t);
    return ok;
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-copy'));
    if (!el) return;
    var text = el.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flash(b, true); },
        function () { flash(b, fallback(text)); }
      );
      return;
    }
    flash(b, fallback(text));
  });
})();
