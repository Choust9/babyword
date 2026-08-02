#!/usr/bin/env python3
"""Generate Babblr's app icons with no third-party dependencies (stdlib zlib).

Design: a soft cream->sand gradient rounded square holding a baby's head (circle
plus a curl of hair) with a speech bubble rising from it, three dots inside the
bubble standing for the babble/word of the day.

The same artwork is drawn as inline SVG in the app's onboarding screen, so the
icon and the in-app logo match.

Regenerate with:  npm run icons   (or: python3 scripts/make_icons.py)
"""
import struct, zlib, math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)

# Brand swatches: cream at the top fading into sand, with the babble dots in
# the deep caramel so they stay legible against the white bubble.
TOP = (246, 226, 190)    # cream
BOT = (201, 170, 124)    # sand
DOT = (150, 114, 63)     # caramel
WHITE = (255, 254, 242)  # ivory


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def rounded_alpha(x, y, size, radius):
    """Coverage of a rounded square, with a soft edge."""
    cx = min(max(x, radius), size - radius)
    cy = min(max(y, radius), size - radius)
    d = math.hypot(x - cx, y - cy)
    return max(0.0, min(1.0, radius - d + 0.5))


def disc(x, y, cx, cy, r):
    return math.hypot(x - cx, y - cy) <= r


def rounded_rect(x, y, x0, y0, x1, y1, r):
    if not (x0 <= x <= x1 and y0 <= y <= y1):
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return math.hypot(x - cx, y - cy) <= r


def triangle(px, py, a, b, c):
    """Point-in-triangle via consistent edge signs."""
    def side(p, q, r):
        return (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1])
    d1 = side((px, py), a, b)
    d2 = side((px, py), b, c)
    d3 = side((px, py), c, a)
    neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    pos = (d1 > 0) or (d2 > 0) or (d3 > 0)
    return not (neg and pos)


def artwork(u, v):
    """Return a colour for normalised coords (0..1), or None for background."""
    # Speech bubble body
    if rounded_rect(u, v, 0.42, 0.13, 0.90, 0.47, 0.11):
        for dx in (0.55, 0.66, 0.77):
            if disc(u, v, dx, 0.30, 0.037):
                return DOT
        return WHITE
    # Bubble tail, pointing down-left towards the baby
    if triangle(u, v, (0.50, 0.44), (0.46, 0.55), (0.60, 0.46)):
        return WHITE
    # Baby's head: a circle, a centred tuft of hair, and an ear. All solid
    # discs that merge into one silhouette — a stroked arc would punch a hole
    # of background colour through the head where the two shapes overlap.
    if disc(u, v, 0.32, 0.715, 0.165):     # head
        return WHITE
    if disc(u, v, 0.325, 0.552, 0.049):    # curl of hair
        return WHITE
    if disc(u, v, 0.158, 0.722, 0.050):    # ear
        return WHITE
    return None


def make(size, maskable=False):
    # Maskable icons must keep their artwork inside a ~80% safe zone.
    scale = 0.78 if maskable else 1.0
    radius = size * (0.0 if maskable else 0.30)

    rows = bytearray()
    for y in range(size):
        rows.append(0)  # PNG filter byte per scanline
        for x in range(size):
            t = y / (size - 1)
            r, g, b = lerp(TOP, BOT, t)
            a = 1.0 if maskable else rounded_alpha(x, y, size, radius)

            # Normalised coords, scaled about the centre for maskable icons.
            u = ((x + 0.5) / size - 0.5) / scale + 0.5
            v = ((y + 0.5) / size - 0.5) / scale + 0.5
            paint = artwork(u, v) if 0.0 <= u <= 1.0 and 0.0 <= v <= 1.0 else None
            if paint:
                r, g, b = paint

            rows.extend((r, g, b, int(a * 255)))

    compressed = zlib.compress(bytes(rows), 9)

    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        return c + struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # 8-bit RGBA
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")


for size in (180, 192, 512):
    with open(os.path.join(OUT, f"icon-{size}.png"), "wb") as f:
        f.write(make(size))
with open(os.path.join(OUT, "icon-512-maskable.png"), "wb") as f:
    f.write(make(512, maskable=True))

print("Icons written to", os.path.abspath(OUT))
