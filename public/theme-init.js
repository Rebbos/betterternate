// Applies the saved theme before first paint (no flash). Key shared with src/hooks/useTheme.ts.
// A file instead of an inline script so the CSP can forbid all inline scripts.
try {
  var t = localStorage.getItem('bt-theme')
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t
} catch (e) {}
