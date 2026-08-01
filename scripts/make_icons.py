#!/usr/bin/env python3
"""Generate app icons with no third-party dependencies (stdlib zlib only).

Design: a warm sun->coral gradient rounded square with a white speech bubble
(the "word of the day") and three dots inside it. Regenerate any time with:
    python3 scripts/make_icons.py
"""
import struct, zlib, math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def rounded_alpha(x, y, size, radius):
    # 1 inside rounded square, 0 outside, smooth edge
    cx = min(max(x, radius), size - radius)
    cy = min(max(y, radius), size - radius)
    d = math.hypot(x - cx, y - cy)
    return max(0.0, min(1.0, radius - d + 0.5))

def bubble_alpha(x, y, size):
    # A speech bubble: rounded rect body + a small tail bottom-left.
    s = size
    bx0, by0, bx1, by1 = 0.22*s, 0.24*s, 0.78*s, 0.60*s
    r = 0.10*s
    inside = 0.0
    # body (rounded rect)
    cx = min(max(x, bx0+r), bx1-r)
    cy = min(max(y, by0+r), by1-r)
    if math.hypot(x-cx, y-cy) <= r:
        inside = 1.0
    # tail (triangle-ish blob)
    tx, ty = 0.34*s, 0.72*s
    if math.hypot(x-tx, y-ty) <= 0.09*s and y > by1-2:
        inside = 1.0
    return inside

def make(size, maskable=False):
    top = (255, 207, 92)     # sun
    bot = (255, 138, 92)     # coral
    dot = (124, 108, 240)    # accent purple
    pad = 0 if maskable else 0
    radius = size * (0.30 if not maskable else 0.001)
    rows = bytearray()
    for y in range(size):
        rows.append(0)  # filter byte per scanline
        for x in range(size):
            t = y / (size - 1)
            bg = lerp(top, bot, t)
            a = 1.0 if maskable else rounded_alpha(x, y, size, radius)
            # composite over transparent
            r, g, b = bg
            aa = a
            # speech bubble in white
            ba = bubble_alpha(x, y, size)
            if ba > 0:
                r, g, b = 255, 255, 255
            # three dots inside the bubble
            for i, dx in enumerate((0.36, 0.50, 0.64)):
                if math.hypot(x - dx*size, y - 0.42*size) <= 0.035*size:
                    r, g, b = dot
            rows.extend((r, g, b, int(aa * 255)))
    raw = bytes(rows)
    compressed = zlib.compress(raw, 9)

    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        c += struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)
        return c

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # RGBA
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
    return png

for size in (180, 192, 512):
    with open(os.path.join(OUT, f"icon-{size}.png"), "wb") as f:
        f.write(make(size))
with open(os.path.join(OUT, "icon-512-maskable.png"), "wb") as f:
    f.write(make(512, maskable=True))

print("Icons written to", os.path.abspath(OUT))
