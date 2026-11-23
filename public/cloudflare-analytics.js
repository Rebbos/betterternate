;(() => {
  if (window.location.hostname !== 'betterternate.netlify.app') return

  const beacon = document.createElement('script')
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  beacon.defer = true
  beacon.dataset.cfBeacon = '{"token": "337ba07a2c53416da72bb0999536d3b2"}'
  document.head.append(beacon)
})()
