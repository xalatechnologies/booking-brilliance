import { Play } from "lucide-react";

/**
 * Placeholder for a short advertisement/explainer video. Renders a 16:9
 * editorial frame ready to be swapped for a real <video> or embed later.
 * Pass `src` (mp4/webm) + optional `poster` once the clip exists, and it
 * renders the video instead of the placeholder — no layout change.
 */
export function VideoPlaceholder({
  label = "Reklamefilm",
  caption = "Videoen legges inn her",
  src,
  poster,
}: {
  label?: string;
  caption?: string;
  src?: string;
  poster?: string;
}) {
  if (src) {
    return (
      <div className="relative w-full overflow-hidden rounded-sm border border-rule bg-paper-deep" style={{ aspectRatio: "16 / 9" }}>
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    );
  }
  return (
    <div
      className="relative w-full overflow-hidden rounded-sm border border-dashed border-rule-strong bg-paper-deep/40 flex flex-col items-center justify-center text-center gap-3"
      style={{ aspectRatio: "16 / 9" }}
      role="img"
      aria-label={`${label}: ${caption}`}
    >
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-rule-strong bg-paper text-accent-text">
        <Play className="h-5 w-5 translate-x-0.5" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="editorial-mono-caption text-ink-faint">{label}</span>
      <span className="text-sm text-ink-soft">{caption}</span>
    </div>
  );
}

export default VideoPlaceholder;
