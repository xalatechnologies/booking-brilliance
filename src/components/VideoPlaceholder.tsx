import { Play } from "lucide-react";

/**
 * Placeholder for a short advertisement/explainer video. Renders a 16:9
 * editorial frame ready to be swapped for a real <video> once the clip exists.
 *
 * Pass `src` (mp4) and/or `srcWebm` (preferred, smaller) plus an optional
 * `poster`, and it renders the video instead of the placeholder — no layout
 * change. By default it plays as a muted, looping, autoplaying ad reel (the
 * pattern for web hero/feature clips); pass `controls` for a click-to-play
 * explainer with the native player instead.
 */
export function VideoPlaceholder({
  label = "Reklamefilm",
  caption = "Videoen legges inn her",
  src,
  srcWebm,
  poster,
  controls = false,
}: {
  label?: string;
  caption?: string;
  src?: string;
  srcWebm?: string;
  poster?: string;
  controls?: boolean;
}) {
  if (src || srcWebm) {
    const playback = controls
      ? { controls: true as const, preload: "metadata" as const }
      : { autoPlay: true as const, loop: true as const, muted: true as const, preload: "auto" as const };
    return (
      <div className="relative w-full overflow-hidden rounded-sm border border-rule bg-paper-deep" style={{ aspectRatio: "16 / 9" }}>
        <video
          key={controls ? "controls" : "ad"}
          className="h-full w-full object-cover"
          poster={poster}
          playsInline
          aria-label={`${label}: ${caption}`}
          {...playback}
        >
          {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
          {src ? <source src={src} type="video/mp4" /> : null}
        </video>
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
