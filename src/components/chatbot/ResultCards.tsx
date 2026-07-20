import { useNavigate, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { KIND_LABEL, type SearchItem } from "@/lib/search/corpus";

/**
 * Renders whole-site intelligent-search hits as clickable navigation cards under
 * a chat reply. Reuses the corpus + the same navigation behaviour as
 * GlobalSearch (in-page anchors scroll, routes navigate). The rail stays open
 * across navigations since it's mounted at the app root.
 */
export function ResultCards({ results }: { results: SearchItem[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (!results.length) return null;

  const select = (item: SearchItem) => {
    if (item.action === "open-chatbot") return; // already in the chat
    if (item.isAnchor) {
      const id = (item.href.includes("#") ? item.href.slice(item.href.indexOf("#") + 1) : "").trim();
      const scroll = () => {
        const el = id ? document.getElementById(id) : null;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(scroll, 120);
      } else {
        scroll();
      }
      return;
    }
    navigate(item.href);
  };

  return (
    <div className="mt-3 space-y-1.5" aria-label="Søketreff">
      {results.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => select(r)}
          className="group w-full text-left flex items-start gap-2 rounded-sm border border-rule bg-paper px-3 py-2 hover:border-accent-text/40 hover:bg-paper-deep/40 transition-colors"
        >
          <div className="min-w-0 flex-1">
            <div className="editorial-mono-caption text-ink-faint mb-0.5">{KIND_LABEL[r.kind]}</div>
            <div className="text-sm text-ink font-medium leading-snug">{r.title}</div>
            {r.subtitle && (
              <div className="text-xs text-ink-soft leading-snug line-clamp-1">{r.subtitle}</div>
            )}
          </div>
          <ArrowUpRight
            className="h-3.5 w-3.5 text-ink-faint group-hover:text-accent-text shrink-0 mt-0.5 transition-colors"
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

export default ResultCards;
