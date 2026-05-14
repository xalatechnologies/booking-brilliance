import { ArrowUpRight } from "lucide-react";

interface Props {
  suggestions: string[];
  onPick: (text: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ suggestions, onPick, disabled }: Props) {
  if (suggestions.length === 0) return null;
  return (
    <div
      role="group"
      aria-label="Forslag til neste spørsmål"
      className="flex flex-wrap gap-2 px-1"
    >
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onPick(s)}
          className="group inline-flex items-center gap-1.5 border border-hairline-strong bg-paper px-3 py-1.5 rounded-sm text-sm text-ink hover:bg-paper-deep hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{s}</span>
          <ArrowUpRight
            className="h-3 w-3 text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
