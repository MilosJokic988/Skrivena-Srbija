import { CATEGORIES, PLACES } from '../data/places'

const INK = '#1F2B27'
const PAPER = '#EDEEE6'
const RED = '#A3322B'
const OCHRE = '#D9A03C'

function diamond(ctx, cx, cy, r) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.lineTo(cx + r, cy)
  ctx.lineTo(cx, cy + r)
  ctx.lineTo(cx - r, cy)
  ctx.closePath()
}

function motif(ctx, cx, cy, size, color, filled) {
  const r = size / 2
  if (filled) {
    ctx.fillStyle = color
    const k = size * 0.1
    ctx.fillRect(cx - k / 2, cy - r, k, k)
    ctx.fillRect(cx - k / 2, cy + r - k, k, k)
    ctx.fillRect(cx - r, cy - k / 2, k, k)
    ctx.fillRect(cx + r - k, cy - k / 2, k, k)
    diamond(ctx, cx, cy, r * 0.75)
    ctx.fill()
    ctx.fillStyle = INK
    diamond(ctx, cx, cy, r * 0.45)
    ctx.fill()
    ctx.fillStyle = color
    diamond(ctx, cx, cy, r * 0.25)
    ctx.fill()
  } else {
    ctx.strokeStyle = 'rgba(237,238,230,0.22)'
    ctx.lineWidth = 3
    ctx.setLineDash([6, 8])
    diamond(ctx, cx, cy, r * 0.75)
    ctx.stroke()
    ctx.setLineDash([])
  }
}

function band(ctx, y, w, h) {
  ctx.fillStyle = RED
  ctx.fillRect(0, y, w, h)
  const step = h * 2
  for (let x = 0; x < w + step; x += step) {
    ctx.fillStyle = OCHRE
    diamond(ctx, x + h / 2, y + h / 2, h * 0.44)
    ctx.fill()
    ctx.fillStyle = INK
    diamond(ctx, x + h * 1.5, y + h / 2, h * 0.44)
    ctx.fill()
    ctx.fillStyle = PAPER
    diamond(ctx, x + h * 1.5, y + h / 2, h * 0.16)
    ctx.fill()
  }
}

// Pravi sliku 1080×1920 za Instagram/TikTok story
export async function makeShareImage(visited) {
  try {
    await Promise.all([
      document.fonts.load('800 120px Unbounded'),
      document.fonts.load('600 40px Manrope'),
    ])
  } catch {
    /* ako fontovi nisu dostupni, koristimo sistemske */
  }

  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = INK
  ctx.fillRect(0, 0, W, H)
  band(ctx, 0, W, 44)
  band(ctx, H - 44, W, 44)

  const count = PLACES.filter((p) => visited[p.id]).length

  ctx.fillStyle = PAPER
  ctx.textAlign = 'left'
  ctx.font = '600 40px Manrope, sans-serif'
  ctx.fillText('Moj ćilim', 90, 200)

  ctx.font = '800 220px Unbounded, sans-serif'
  ctx.fillStyle = OCHRE
  ctx.fillText(String(count), 80, 430)
  const numW = ctx.measureText(String(count)).width
  ctx.font = '700 64px Unbounded, sans-serif'
  ctx.fillStyle = PAPER
  ctx.fillText(`/${PLACES.length}`, 100 + numW, 430)

  ctx.font = '500 44px Manrope, sans-serif'
  ctx.fillStyle = 'rgba(237,238,230,0.75)'
  ctx.fillText('skrivenih mesta Srbije', 90, 510)
  ctx.fillText('sam obišao. A ti?', 90, 570)

  // Mreža ćilima
  const cols = 6
  const cell = 150
  const gridW = cols * cell
  const x0 = (W - gridW) / 2 + cell / 2
  const y0 = 720
  PLACES.forEach((p, i) => {
    const cx = x0 + (i % cols) * cell
    const cy = y0 + Math.floor(i / cols) * cell
    motif(ctx, cx, cy, cell * 0.92, lighten(CATEGORIES[p.category].color), !!visited[p.id])
  })

  ctx.font = '800 54px Unbounded, sans-serif'
  ctx.fillStyle = PAPER
  ctx.textAlign = 'center'
  ctx.fillText('Skrivena Srbija', W / 2, H - 150)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

// Na tamnoj pozadini boje kategorija treba malo posvetliti
function lighten(hex) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c + (255 - c) * 0.28)
  const r = mix(n >> 16)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `rgb(${r},${g},${b})`
}
