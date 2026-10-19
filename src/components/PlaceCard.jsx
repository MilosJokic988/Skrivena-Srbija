import { CATEGORIES } from '../data/places'
import { formatKm } from '../utils/geo'
import { Motif } from './Motif'

export default function PlaceCard({ place, visited, distance, onOpen }) {
  const cat = CATEGORIES[place.category]
  return (
    <li>
      <button className="card" onClick={() => onOpen(place.id)} style={{ '--c': cat.color }}>
        <Motif color={cat.color} size={44} className="card__motif" />
        <span className="card__body">
          <span className="card__name">{place.name}</span>
          <span className="card__meta">
            {place.region}
            {distance != null && <strong className="card__km">{formatKm(distance)}</strong>}
          </span>
          <span className="card__teaser">{place.teaser}</span>
        </span>
        {visited && (
          <span className="card__badge" title="Posetio si ovo mesto">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 10.5l3.2 3.2L15 6.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">Posećeno</span>
          </span>
        )}
      </button>
    </li>
  )
}
