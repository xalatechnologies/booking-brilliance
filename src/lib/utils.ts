import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Client logos with a generated WebP sibling (see
// scripts/optimize-images.mjs optimizeClientLogo). Other .png logos have no
// -webp variant on disk, so pointing a <picture> <source> at one would just
// 404 before the browser falls back to the <img> — only emit the source for
// logos actually in this set.
const LOGOS_WITH_WEBP = new Set(["/clients/ronning.png"]);

export function logoWebpSrc(src?: string): string | undefined {
  return src && LOGOS_WITH_WEBP.has(src) ? src.replace(/\.png$/, ".webp") : undefined;
}
