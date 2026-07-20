/**
 * Serif display variable-axis presets (Newsreader).
 * opsz (optical size)  — 6..72
 * wght (weight)        — 300..800
 *
 * getFraunces / FrauncesSize keep their legacy names for call-site stability
 * across ~60 files; the presets themselves now target Newsreader (the site's
 * serif since the Fraunces → Newsreader switch). No SOFT/WONK axes exist on
 * Newsreader, so those are intentionally absent.
 */

export type FrauncesSize =
  | "hero"
  | "display"
  | "section"
  | "sub"
  | "quote"
  | "dropcap"
  | "body-italic";

// Newsreader voice. Variable axes: opsz (6..72) + wght (300..800) — no
// SOFT/WONK (that was Fraunces). opsz is set to the display end (72) for large
// headings and lower for small ones; wght gives the hierarchy, with small
// headings carrying the most weight so they don't read as anemic.
const PRESETS: Record<FrauncesSize, string> = {
  hero: '"opsz" 72, "wght" 500',
  display: '"opsz" 72, "wght" 500',
  section: '"opsz" 60, "wght" 540',
  sub: '"opsz" 30, "wght" 580',
  quote: '"opsz" 44, "wght" 440',
  dropcap: '"opsz" 72, "wght" 620',
  "body-italic": '"opsz" 18, "wght" 480',
};

export function getFraunces(size: FrauncesSize): string {
  return PRESETS[size];
}
