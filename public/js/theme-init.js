// Runs synchronously in <head> so the first paint uses the right theme.
(function () {
  try {
    var s = JSON.parse(localStorage.getItem('pf5.settings') || '{}');
    var t = s.theme === 'dark' || (s.theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  } catch (e) { document.documentElement.dataset.theme = 'light'; }
})();
