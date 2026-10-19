import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, PLACES } from './data/places'
import { distanceKm, mestaWord } from './utils/geo'
import { useVisited } from './hooks/useVisited'
import { useLocation } from './hooks/useLocation'
import MapView from './components/MapView'
import PlaceCard from './components/PlaceCard'
import PlaceDetail from './components/PlaceDetail'
import Collection from './components/Collection'
import { KilimBand, Motif } from './components/Motif'

const TABS = [
  { id: 'mapa', label: 'Mesta' },
  { id: 'blizu', label: 'Blizu mene' },
  { id: 'cilim', label: 'Moj ćilim' },
]

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'dj')
}

export default function App() {
  const { visited, toggle } = useVisited()
  const { position, status, request } = useLocation()
  const [tab, setTab] = useState('mapa')
  const [category, setCategory] = useState('sve')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(() => {
    const hash = window.location.hash.slice(1)
    return PLACES.some((p) => p.id === hash) ? hash : null
  })
  // Donji panel na telefonu ima tri položaja: min (samo zaglavlje), mid i full
  const [sheet, setSheet] = useState(selectedId ? 'full' : 'mid')
  const scrollRef = useRef(null)
  const panelRef = useRef(null)
  const drag = useRef(null)

  // Svaki novi prikaz počinje od vrha
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [selectedId, tab])

  // Link sa #id otvara to mesto (koristi se pri deljenju)
  useEffect(() => {
    const url = selectedId ? `#${selectedId}` : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [selectedId])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return PLACES.filter(
      (p) =>
        (category === 'sve' || p.category === category) &&
        (!q || normalize(`${p.name} ${p.region}`).includes(q))
    )
  }, [category, query])

  const withDistance = useMemo(() => {
    if (!position) return null
    return PLACES.map((p) => ({ place: p, km: distanceKm(position, p) })).sort((a, b) => a.km - b.km)
  }, [position])

  const selected = PLACES.find((p) => p.id === selectedId)
  const visitedCount = PLACES.filter((p) => visited[p.id]).length
  const dist = (p) => (position ? distanceKm(position, p) : null)

  function open(id) {
    setSelectedId(id)
    setSheet('full')
  }

  // Povlačenje panela prstom (samo na telefonu)
  const isMobile = () => window.innerWidth < 900
  const snapHeights = () => {
    const panel = panelRef.current
    const min =
      panel.querySelector('.brand').offsetHeight + panel.querySelector('.tabs').offsetHeight
    return { min, mid: window.innerHeight * 0.45, full: window.innerHeight * 0.88 }
  }

  function onDragStart(e) {
    if (!isMobile()) return
    drag.current = { y: e.clientY, h: panelRef.current.offsetHeight, moved: false, id: e.pointerId }
  }

  function onDragMove(e) {
    const d = drag.current
    if (!d) return
    const dy = e.clientY - d.y
    if (!d.moved && Math.abs(dy) < 6) return
    if (!d.moved) {
      d.moved = true
      e.currentTarget.setPointerCapture(d.id)
      panelRef.current.style.transition = 'none'
    }
    const { min, full } = snapHeights()
    panelRef.current.style.height = `${Math.min(full, Math.max(min, d.h - dy))}px`
  }

  function onDragEnd(e) {
    const d = drag.current
    drag.current = null
    if (!d || !d.moved) return
    const panel = panelRef.current
    const h = panel.offsetHeight
    const dy = e.clientY - d.y
    const snaps = snapHeights()
    // Brz potez gore ili dole pomera za jedan položaj, inače bira najbliži
    let next
    if (Math.abs(dy) > 60) {
      const order = ['min', 'mid', 'full']
      const nearestStart = order.reduce((a, b) => (Math.abs(snaps[b] - d.h) < Math.abs(snaps[a] - d.h) ? b : a))
      const i = order.indexOf(nearestStart) + (dy < 0 ? 1 : -1)
      next = order[Math.max(0, Math.min(2, i))]
      if (Math.abs(snaps[next] - h) > Math.abs(snaps[nearestStart] - h) && Math.abs(dy) < 120) next = nearestStart
    } else {
      next = Object.keys(snaps).reduce((a, b) => (Math.abs(snaps[b] - h) < Math.abs(snaps[a] - h) ? b : a))
    }
    panel.style.transition = ''
    panel.style.height = ''
    setSheet(next)
  }

  function cycleSheet() {
    setSheet((s) => (s === 'min' ? 'mid' : s === 'mid' ? 'full' : 'min'))
  }

  function surprise() {
    const pool = filtered.filter((p) => !visited[p.id] && p.id !== selectedId)
    const from = pool.length ? pool : filtered
    if (!from.length) return
    open(from[Math.floor(Math.random() * from.length)].id)
  }

  function goTab(id) {
    setTab(id)
    setSelectedId(null)
    setSheet((s) => (s === 'min' ? 'mid' : s))
    if (id === 'blizu' && status === 'idle') request()
  }

  return (
    <div className={`app sheet-${sheet}`}>
      <aside className="panel" aria-label="Lista mesta" ref={panelRef}>
        <KilimBand className="panel__band" />
        <header
          className="brand"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <button
            className="brand__handle"
            onClick={cycleSheet}
            aria-label={sheet === 'full' ? 'Spusti panel' : 'Podigni panel'}
          />
          <div className="brand__row">
            <h1 className="brand__name">
              <span>Skrivena</span> <span>Srbija</span>
            </h1>
            <button className="brand__count" onClick={() => goTab('cilim')}>
              <Motif color="var(--ochre)" size={22} />
              <span>
                <b>{visitedCount}</b>/{PLACES.length}
              </span>
            </button>
          </div>
          <p className="brand__lede">
            {PLACES.length} mesta za koja verovatno nisi čuo, a vredi da sedneš u kola zbog njih.
          </p>
        </header>

        <nav className="tabs" aria-label="Pregled">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tabs__btn ${tab === t.id && !selected ? 'is-active' : ''}`}
              onClick={() => goTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="panel__scroll" ref={scrollRef}>
          {selected ? (
            <PlaceDetail
              key={selected.id}
              place={selected}
              visited={!!visited[selected.id]}
              distance={dist(selected)}
              onToggleVisited={toggle}
              onBack={() => setSelectedId(null)}
            />
          ) : tab === 'mapa' ? (
            <>
              <div className="filters">
                <label className="search">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="sr-only">Pretraži mesta</span>
                  <input
                    type="search"
                    placeholder="Pretraži mesto ili kraj"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="chips" role="group" aria-label="Kategorije">
                  <button
                    className={`chip ${category === 'sve' ? 'is-active' : ''}`}
                    onClick={() => setCategory('sve')}
                  >
                    Sve
                  </button>
                  {Object.entries(CATEGORIES).map(([key, c]) => (
                    <button
                      key={key}
                      className={`chip ${category === key ? 'is-active' : ''}`}
                      style={{ '--c': c.color }}
                      onClick={() => setCategory(key)}
                    >
                      <i className="chip__dot" />
                      {c.short}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length ? (
                <ul className="list">
                  {filtered.map((p) => (
                    <PlaceCard key={p.id} place={p} visited={!!visited[p.id]} distance={dist(p)} onOpen={open} />
                  ))}
                </ul>
              ) : (
                <div className="empty">
                  <p>Nijedno mesto ne odgovara pretrazi „{query}".</p>
                  <button className="btn btn--ghost" onClick={() => { setQuery(''); setCategory('sve') }}>
                    Prikaži sva mesta
                  </button>
                </div>
              )}
            </>
          ) : tab === 'blizu' ? (
            <NearMe status={status} request={request} items={withDistance} visited={visited} onOpen={open} />
          ) : (
            <Collection visited={visited} onOpen={open} />
          )}
        </div>
      </aside>

      <main className="stage">
        <MapView
          places={tab === 'mapa' ? filtered : PLACES}
          visited={visited}
          selectedId={selectedId}
          onSelect={open}
          userPosition={position}
          onMapTouch={() => isMobile() && setSheet('min')}
        />
        <button className="surprise" onClick={surprise}>
          <Motif color="var(--ochre)" size={20} />
          Iznenadi me
        </button>
      </main>
    </div>
  )
}

function NearMe({ status, request, items, visited, onOpen }) {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="empty">
        <p>Tražim tvoju lokaciju…</p>
      </div>
    )
  }
  if (status === 'denied' || status === 'unavailable') {
    return (
      <div className="empty">
        <p>
          {status === 'denied'
            ? 'Pristup lokaciji je isključen. Uključi ga u podešavanjima pregledača za ovaj sajt, pa pokušaj ponovo.'
            : 'Lokacija trenutno nije dostupna. Proveri da li je GPS uključen.'}
        </p>
        <button className="btn btn--ghost" onClick={request}>
          Pokušaj ponovo
        </button>
      </div>
    )
  }
  const close = items.filter((i) => i.km <= 100)
  const shown = close.length >= 3 ? close : items.slice(0, 6)
  return (
    <>
      <p className="near__note">
        {close.length >= 3
          ? `${close.length} ${mestaWord(close.length)} na manje od 100 km od tebe.`
          : 'U krugu od 100 km nema mnogo mesta, evo najbližih.'}
      </p>
      <ul className="list">
        {shown.map(({ place, km }) => (
          <PlaceCard key={place.id} place={place} visited={!!visited[place.id]} distance={km} onOpen={onOpen} />
        ))}
      </ul>
    </>
  )
}
