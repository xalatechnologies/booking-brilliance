import { ImageIcon } from "lucide-react";

/**
 * Placeholder for an editorial photo. Renders a framed area (dashed while
 * empty) ready to be swapped for a real <img> later. Pass `src` (+ `alt`)
 * once the photo exists and it renders the image instead — no layout change.
 * `aspect` is any CSS aspect-ratio string ("21 / 9", "16 / 9", "4 / 3").
 */
export function ImagePlaceholder({
  label = "Foto",
  caption = "Bilde legges inn her",
  src,
  alt,
  aspect = "16 / 9",
  className = "",
}: {
  label?: string;
  caption?: string;
  src?: string;
  alt?: string;
  aspect?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-sm border border-rule bg-paper-deep ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt ?? caption}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative w-full overflow-hidden rounded-sm border border-dashed border-rule-strong bg-paper-deep/40 flex flex-col items-center justify-center text-center gap-3 ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`${label}: ${caption}`}
    >
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-rule-strong bg-paper text-accent-text">
        <ImageIcon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="editorial-mono-caption text-ink-faint">{label}</span>
      <span className="text-sm text-ink-soft">{caption}</span>
    </div>
  );
}

export default ImagePlaceholder;
