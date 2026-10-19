import { useCallback, useEffect, useState } from 'react'

const KEY = 'skrivena-srbija:posetio'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Pamti koja mesta je korisnik posetio (čuva se u telefonu, bez naloga)
export function useVisited() {
  const [visited, setVisited] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(visited))
    } catch {
      /* privatni režim pregledača: samo ne pamtimo */
    }
  }, [visited])

  const toggle = useCallback((id) => {
    setVisited((v) => {
      const next = { ...v }
      if (next[id]) delete next[id]
      else next[id] = new Date().toISOString()
      return next
    })
  }, [])

  return { visited, toggle }
}
