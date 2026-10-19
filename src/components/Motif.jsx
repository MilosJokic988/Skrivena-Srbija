// Romb iz pirotskog ćilima. Koristi se kao ikonica mesta, marker i polje u „Mom ćilimu".
export function Motif({ color = 'currentColor', filled = true, size = 40, className = '' }) {
  const bg = 'var(--paper)'
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      {filled ? (
        <>
          {/* kukice na vrhovima romba */}
          <rect x="18" y="0" width="4" height="4" fill={color} />
          <rect x="18" y="36" width="4" height="4" fill={color} />
          <rect x="0" y="18" width="4" height="4" fill={color} />
          <rect x="36" y="18" width="4" height="4" fill={color} />
          <polygon points="20,5 35,20 20,35 5,20" fill={color} />
          <polygon points="20,11 29,20 20,29 11,20" fill={bg} />
          <polygon points="20,15 25,20 20,25 15,20" fill={color} />
        </>
      ) : (
        <>
          <polygon
            points="20,5 35,20 20,35 5,20"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          <polygon points="20,17 23,20 20,23 17,20" fill={color} opacity="0.5" />
        </>
      )}
    </svg>
  )
}

// Traka sa ćilimskim šarama, kao ivica tkanine
export function KilimBand({ height = 18, className = '' }) {
  return (
    <svg className={className} width="100%" height={height} aria-hidden="true">
      <defs>
        <pattern id="kilim-band" width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill="var(--red)" />
          <polygon points="9,1 17,9 9,17 1,9" fill="var(--ochre)" />
          <polygon points="9,5 13,9 9,13 5,9" fill="var(--red)" />
          <polygon points="27,1 35,9 27,17 19,9" fill="var(--ink)" />
          <polygon points="27,6 30,9 27,12 24,9" fill="var(--paper)" />
          <rect x="17" y="8" width="2" height="2" fill="var(--paper)" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill="url(#kilim-band)" />
    </svg>
  )
}
