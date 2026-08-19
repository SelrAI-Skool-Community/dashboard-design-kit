/* Sets data-mode from the operating system, and remembers a manual override if
   one was ever set. No visible control — a production app follows the machine. */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('mode'); } catch (e) {}
  var apply = function (m) { root.setAttribute('data-mode', m); };
  if (saved === 'light' || saved === 'dark') { apply(saved); return; }
  var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  apply(mq && mq.matches ? 'dark' : 'light');
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) { apply(e.matches ? 'dark' : 'light'); });
  }
})();
