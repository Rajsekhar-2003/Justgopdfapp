(function () {
  try {
    var t = localStorage.getItem('jgp-theme');
    if (!t && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
    document.documentElement.setAttribute('data-bs-theme', t || 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
})();
