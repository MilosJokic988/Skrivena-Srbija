import { useState } from 'react'
import { CATEGORIES, PLACES } from '../data/places'
import { mestaWord } from '../utils/geo'
import { Motif } from './Motif'
import { makeShareImage } from '../utils/shareImage'

export default function Collection({ visited, onOpen }) {
  const count = PLACES.filter((p) => visited[p.id]).length
  const total = PLACES.length
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function shareCard() {
    setBusy(true)
    try {
      const blob = await makeShareImage(visited)
      const file = new File([blob], 'moj-cilim-skrivena-srbija.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Moj ćilim',
          text: `Posetio sam ${count} od ${total} skrivenih mesta Srbije. A ti?`,
        })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        a.click()
        setTimeout(() => URL.revokeObjectURL(a.href), 2000)
        setMsg('Slika je sačuvana')
        setTimeout(() => setMsg(''), 2500)
      }
    } catch {
      /* deljenje otkazano */
    } finally {
      setBusy(false)
    }
  }

  const byCat = Object.entries(CATEGORIES).map(([key, c]) => {
    const all = PLACES.filter((p) => p.category === key)
    return { key, ...c, done: all.filter((p) => visited[p.id]).length, all: all.length }
  })

  return (
    <section className="collection">
      <div className="collection__head">
        <h2>Moj ćilim</h2>
        <p>
          {count === 0
            ? 'Svako mesto koje obiđeš utka se u tvoj ćilim. Otvori neko mesto i označi „Bio sam ovde".'
            : `Posetio si ${count} od ${total} ${mestaWord(total)}. ${
                count === total ? 'Ćilim je gotov. Svaka čast.' : `Još ${total - count} do punog ćilima.`
              }`}
        </p>
      </div>

      <div className="loom" role="list">
        {PLACES.map((p) => {
          const on = !!visited[p.id]
          return (
            <button
              key={p.id}
              role="listitem"
              className={`loom__cell ${on ? 'is-on' : ''}`}
              onClick={() => onOpen(p.id)}
              title={p.name}
              aria-label={`${p.name}${on ? ', posećeno' : ''}`}
            >
              <Motif color={on ? CATEGORIES[p.category].color : 'var(--line-strong)'} filled={on} size={48} />
            </button>
          )
        })}
      </div>

      <ul className="tally">
        {byCat.map((c) => (
          <li key={c.key} style={{ '--c': c.color }}>
            <span className="tally__name">{c.label}</span>
            <span className="tally__bar">
              <i style={{ width: `${(c.done / c.all) * 100}%` }} />
            </span>
            <span className="tally__num">
              {c.done}/{c.all}
            </span>
          </li>
        ))}
      </ul>

      <button className="btn btn--visit is-on collection__share" onClick={shareCard} disabled={busy}>
        {busy ? 'Pravim sliku…' : msg || 'Podeli svoj ćilim'}
      </button>
      <p className="collection__hint">Napravićemo sliku za story, spremnu za Instagram i TikTok.</p>
    </section>
  )
}
