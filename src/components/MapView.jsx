import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { CATEGORIES, PLACES } from '../data/places'
import SerbiaOutline from './SerbiaOutline'

const SERBIA_CENTER = [44.05, 20.9]
const SERBIA_BOUNDS = [
  [39.8, 17.6],
  [47.2, 24.2],
]

function pinIcon(color, { visited, selected }) {
  const cls = ['pin', visited && 'pin--visited', selected && 'pin--selected'].filter(Boolean).join(' ')
  return L.divIcon({
    className: 'pin-wrap',
    html: `<span class="${cls}" style="--c:${color}">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <polygon points="20,3 37,20 20,37 3,20" class="pin-outer"/>
        <polygon points="20,11 29,20 20,29 11,20" class="pin-inner"/>
        <polygon points="20,15.5 24.5,20 20,24.5 15.5,20" class="pin-core"/>
      </svg>
    </span>`,
    iconSize: selected ? [46, 46] : [32, 32],
    iconAnchor: selected ? [23, 23] : [16, 16],
  })
}

// Pomera mapu na izabrano mesto
function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 900
    // Na telefonu donji panel pokriva deo mape, pa tačku pomeramo malo naviše
    const zoom = Math.max(map.getZoom(), 10)
    const point = map.project([target.lat, target.lng], zoom)
    if (isMobile) point.y += window.innerHeight * 0.22
    const center = map.unproject(point, zoom)
    if (reduce) map.setView(center, zoom)
    else map.flyTo(center, zoom, { duration: 1.1 })
  }, [target, map])
  return null
}

// Na početku prikaži celu Srbiju, iznad donjeg panela na telefonu
function InitialFit() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(PLACES.map((p) => [p.lat, p.lng]))
    const mobile = window.innerWidth < 900
    map.fitBounds(bounds, {
      paddingTopLeft: [24, mobile ? 80 : 40],
      paddingBottomRight: [24, mobile ? window.innerHeight * 0.45 + 16 : 40],
      animate: false,
    })
  }, [map])
  return null
}

// Kad korisnik pomera ili dodirne mapu, javljamo da se panel spusti
function MapTouch({ onTouch }) {
  useMapEvents({
    dragstart: () => onTouch?.(),
    click: () => onTouch?.(),
  })
  return null
}

function FitUser({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 9, { duration: 1 })
  }, [position, map])
  return null
}

export default function MapView({ places, visited, selectedId, onSelect, userPosition, onMapTouch }) {
  const selected = useMemo(() => places.find((p) => p.id === selectedId), [places, selectedId])

  return (
    <MapContainer
      center={SERBIA_CENTER}
      zoom={7}
      minZoom={6}
      zoomSnap={0.25}
      maxBounds={SERBIA_BOUNDS}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <SerbiaOutline />

      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(CATEGORIES[p.category].color, {
            visited: !!visited[p.id],
            selected: p.id === selectedId,
          })}
          zIndexOffset={p.id === selectedId ? 1000 : 0}
          title={p.name}
          eventHandlers={{ click: () => onSelect(p.id) }}
        />
      ))}

      {userPosition && (
        <CircleMarker
          center={[userPosition.lat, userPosition.lng]}
          radius={8}
          pathOptions={{ color: '#fff', weight: 3, fillColor: '#2F5675', fillOpacity: 1 }}
        />
      )}

      <InitialFit />
      <MapTouch onTouch={onMapTouch} />
      <FlyTo target={selected} />
      <FitUser position={userPosition} />
    </MapContainer>
  )
}
