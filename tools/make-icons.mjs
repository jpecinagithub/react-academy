// Generates PWA icons with a tiny pure-Node PNG writer (zlib is built-in).
// Draws an atom-ish logo on a dark rounded square.
import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function writePng(path, size, draw) {
  const px = Buffer.alloc(size * size * 4)
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 4
    // simple alpha-over on transparent
    const sa = a / 255
    const da = px[i + 3] / 255
    const out = sa + da * (1 - sa)
    if (out === 0) return
    px[i] = Math.round((r * sa + px[i] * da * (1 - sa)) / out)
    px[i + 1] = Math.round((g * sa + px[i + 1] * da * (1 - sa)) / out)
    px[i + 2] = Math.round((b * sa + px[i + 2] * da * (1 - sa)) / out)
    px[i + 3] = Math.round(out * 255)
  }
  const disc = (cx, cy, rad, r, g, b, a = 255) => {
    for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++)
      for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) set(x, y, r, g, b, a)
  }
  const ellipse = (cx, cy, rx, ry, angle, r, g, b, width) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const steps = Math.max(64, Math.floor((rx + ry) * 2))
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2
      const ex = rx * Math.cos(t)
      const ey = ry * Math.sin(t)
      const x = cx + ex * cos - ey * sin
      const y = cy + ex * sin + ey * cos
      disc(x, y, width / 2, r, g, b)
    }
  }
  draw({ size, set, disc, ellipse })

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr.writeUInt8(8, 8) // bit depth
  ihdr.writeUInt8(6, 9) // RGBA
  const raw = Buffer.alloc(size * (1 + size * 4))
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0 // filter type 0
    px.copy(raw, y * (1 + size * 4) + 1, y * size * 4, (y + 1) * size * 4)
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync(path, png)
  console.log('wrote', path, `${(png.length / 1024).toFixed(1)} KB`)
}

function atomLogo({ size, disc, ellipse }) {
  const c = size / 2
  const R = size * 0.30
  const accent = [0x61, 0xda, 0xfb] // React blue #61dafb
  // nucleus
  disc(c, c, size * 0.045, ...accent)
  // three electron orbits
  ellipse(c, c, R, R * 0.36, 0, ...accent, size * 0.022)
  ellipse(c, c, R, R * 0.36, Math.PI / 3, ...accent, size * 0.022)
  ellipse(c, c, R, R * 0.36, -Math.PI / 3, ...accent, size * 0.022)
  // electrons on the orbits
  const spots = [
    [c + R, c, 0],
    [c + R * Math.cos(Math.PI / 3), c + R * Math.sin(Math.PI / 3), Math.PI / 3],
    [c + R * Math.cos(-Math.PI / 3), c + R * Math.sin(-Math.PI / 3), -Math.PI / 3],
  ]
  for (const [x, y] of spots) disc(x, y, size * 0.028, ...accent)
}

function drawWithRadius(radiusFrac) {
  return ({ size, set, disc, ellipse }) => {
    const radius = size * radiusFrac
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const cx = Math.min(Math.max(x, radius), size - radius)
        const cy = Math.min(Math.max(y, radius), size - radius)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= radius * radius)
          set(x, y, 0x0b, 0x0e, 0x11)
      }
    atomLogo({ size, disc, ellipse })
  }
}

writePng(join(outDir, 'icon-192.png'), 192, drawWithRadius(0.22))
writePng(join(outDir, 'icon-512.png'), 512, drawWithRadius(0.22))
writePng(join(outDir, 'icon-maskable-512.png'), 512, drawWithRadius(0.06))

// apple touch icon (180)
writePng(join(outDir, 'apple-touch-180.png'), 180, drawWithRadius(0.22))
console.log('done')
