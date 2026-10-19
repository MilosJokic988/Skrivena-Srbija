// Udaljenost između dve tačke u kilometrima (haversine formula)
export function distanceKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatKm(km) {
  if (km < 1) return 'manje od 1 km'
  if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`
  return `${Math.round(km)} km`
}

// Link koji otvara Google mape i traži mesto po imenu
export function mapsLink(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query || place.name)}`
}

// Ispravan oblik reči „mesto" za srpske brojeve: 1 mesto, 2 mesta, 5 mesta
export function mestaWord(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'mesto'
  return 'mesta'
}
