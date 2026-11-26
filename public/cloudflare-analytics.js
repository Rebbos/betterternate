;(() => {
  // Production hosts only (Vercel primary, Netlify backup): no analytics on previews or localhost.
  const hosts = ['betterternate.vercel.app', 'betterternate.netlify.app']
  if (!hosts.includes(window.location.hostname)) return

  const beacon = document.createElement('script')
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  beacon.defer = true
  beacon.dataset.cfBeacon = '{"token": "337ba07a2c53416da72bb0999536d3b2"}'
  document.head.append(beacon)
})()
