import { useState } from 'react'
import { CATEGORIES, DIFFICULTY } from '../data/places'
import { formatKm, mapsLink } from '../utils/geo'
import { Motif } from './Motif'

export default function PlaceDetail({ place, visited, distance, onToggleVisited, onBack }) {
  const cat = CATEGORIES[place.category]
  const [shareMsg, setShareMsg] = useState('')

  async function share() {
    const text = `${place.name}: ${place.teaser}`
    const url = window.location.origin + '/#' + place.id
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setShareMsg('Link je kopiran')
        setTimeout(() => setShareMsg(''), 2200)
      }
    } catch {
      /* korisnik je zatvorio meni za deljenje */
    }
  }

  return (
    <article className="detail" style={{ '--c': cat.color }}>
      <header className="detail__hero">
        <button className="detail__back" onClick={onBack} aria-label="Nazad na listu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="detail__weave" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <Motif key={i} color="rgba(255,255,255,0.16)" size={56} />
          ))}
        </div>
        <span className="detail__cat">{cat.label}</span>
        <h2 className="detail__title">{place.name}</h2>
        <p className="detail__region">
          {place.region}
          {distance != null && <>, {formatKm(distance)} od tebe</>}
        </p>
      </header>

      <div className="detail__content">
        <p className="detail__teaser">{place.teaser}</p>
        <p className="detail__story">{place.story}</p>

        <dl className="facts">
          <div>
            <dt>Pristup</dt>
            <dd>
              <span className="dots" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                  <i key={n} className={n <= place.difficulty ? 'on' : ''} />
                ))}
              </span>
              {DIFFICULTY[place.difficulty]}
            </dd>
          </div>
          <div>
            <dt>Kada ići</dt>
            <dd>{place.season}</dd>
          </div>
          <div>
            <dt>Kako stići</dt>
            <dd>{place.howTo}</dd>
          </div>
        </dl>

        <div className="actions">
          <button
            className={`btn btn--visit ${visited ? 'is-on' : ''}`}
            onClick={() => onToggleVisited(place.id)}
            aria-pressed={visited}
          >
            <Motif color="currentColor" size={22} filled={visited} />
            {visited ? 'Posetio si ovo mesto' : 'Bio sam ovde'}
          </button>
          <div className="actions__row">
            <a className="btn btn--ghost" href={mapsLink(place)} target="_blank" rel="noreferrer">
              Navigacija
            </a>
            <button className="btn btn--ghost" onClick={share}>
              {shareMsg || 'Podeli'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
