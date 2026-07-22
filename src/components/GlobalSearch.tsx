import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import {
  getSearchCorpus,
  searchCorpus,
  KIND_LABEL,
  type SearchItem,
} from "@/lib/search/corpus";
import { openChatbot } from "@/lib/chatbot/open";
import { cn } from "@/lib/utils";

/**
 * Editorial global search — mirrors @digilist/ds SmartSearchBox interaction:
 * inline input + ⌘K hint + dropdown panel with tip chips (empty) or scored
 * results (typing) + keyboard navigation (↑/↓/↵/Esc).
 */

type Tip = { id: string; label: string; href?: string; action?: () => void };

const TIP_GROUPS: Array<{ id: string; label: string; tips: Tip[] }> = [
  {
    id: "snarveier",
    label: "Snarveier",
    tips: [
      { id: "t-demo", label: "Book demo", href: "/book-demo" },
      { id: "t-chat", label: "Snakk med oss", action: () => openChatbot({ mode: "chat" }) },
      { id: "t-blogg", label: "Blogg", href: "/blogg" },
      { id: "t-faq", label: "FAQ", href: "/faq" },
    ],
  },
  {
    id: "populare-sok",
    label: "Populære søk",
    tips: [
      { id: "p-sesongleie", label: "Sesongleie" },
      { id: "p-vipps", label: "Vipps" },
      { id: "p-ssa-l", label: "SSA-L 2026" },
      { id: "p-bankid", label: "BankID" },
      { id: "p-ehf", label: "EHF" },
      { id: "p-kommune", label: "Kommune" },
    ],
  },
];

export function GlobalSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Deferred until the user actually opens search — every page mounts this
  // component (it's in the Navbar), so building the ~150-item corpus (blog
  // posts + FAQ entries) up front cost hydration time on every page view
  // for a feature most visits never use.
  const corpus = useMemo(() => (open ? getSearchCorpus() : []), [open]);
  const results = useMemo(
    () => (query.trim() ? searchCorpus(query, corpus) : []),
    [query, corpus],
  );

  // Click outside → close
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // ⌘K / Ctrl-K → open + focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const selectItem = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    if (item.action === "open-chatbot") {
      openChatbot({ mode: "chat" });
      return;
    }
    if (item.isAnchor) {
      // In-page anchor — only meaningful on homepage
      if (location.pathname === "/") {
        const el = document.querySelector(item.href);
        if (el)
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", item.href);
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(item.href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
      return;
    }
    navigate(item.href);
  };

  const onTip = (tip: Tip) => {
    setOpen(false);
    if (tip.action) {
      tip.action();
      return;
    }
    if (tip.href) {
      navigate(tip.href);
      return;
    }
    // Pure search seed — keep the panel open but populate query
    setQuery(tip.label);
    setOpen(true);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[selectedIdx];
      if (item) selectItem(item);
    }
  };

  const showTips = !query.trim();

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] xl:max-w-[480px]"
    >
      <div
        className={cn(
          "flex items-center gap-2.5 border border-hairline-strong rounded-sm bg-paper px-3 py-2 transition-colors duration-quick ease-editorial",
          open ? "border-navy" : "hover:border-ink",
        )}
      >
        <Search
          className="h-4 w-4 text-ink-faint shrink-0"
          aria-hidden="true"
          strokeWidth={1.5}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Søk i Digilist…"
          aria-label="Søk i Digilist"
          className="flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none min-w-0"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Tøm søk"
            className="text-ink-faint hover:text-ink text-lg leading-none px-1"
          >
            ×
          </button>
        ) : (
          <kbd
            className="hidden lg:inline-flex items-center font-mono text-[0.65rem] tracking-widest text-ink-faint border border-rule rounded-sm px-1.5 py-0.5"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-label="Søkeresultater"
          className="absolute left-0 right-0 mt-2 bg-paper border border-hairline-strong rounded-sm shadow-2xl max-h-[70vh] overflow-y-auto z-50"
        >
          {showTips ? (
            <div className="p-4 space-y-5">
              {TIP_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="editorial-mono-caption text-ink-faint mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tips.map((tip) => (
                      <button
                        key={tip.id}
                        type="button"
                        onClick={() => onTip(tip)}
                        className="font-sans text-xs px-3 py-1.5 border border-rule rounded-full text-ink hover:bg-paper-deep hover:border-ink transition-colors duration-quick ease-editorial"
                      >
                        {tip.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <p className="editorial-mono-caption text-ink-faint pt-2 border-t border-rule">
                <span className="font-mono">↑↓</span> bla ·{" "}
                <span className="font-mono">↵</span> velg ·{" "}
                <span className="font-mono">esc</span> lukk
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-base text-ink-soft">
                Ingen treff for «{query}».
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  openChatbot({ mode: "chat" });
                }}
                className="mt-3 inline-block font-sans text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                Spør oss direkte i chat ↗
              </button>
            </div>
          ) : (
            <ul role="listbox" className="py-1">
              {results.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    aria-selected={i === selectedIdx}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-start gap-4 transition-colors duration-quick ease-editorial",
                      i === selectedIdx
                        ? "bg-paper-deep"
                        : "hover:bg-paper-deep/60",
                    )}
                  >
                    <span className="font-mono text-[0.65rem] tracking-widest text-accent-text mt-0.5 min-w-[60px]">
                      {KIND_LABEL[item.kind]}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-sans text-base text-ink leading-snug truncate">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="block text-sm text-ink-soft leading-snug mt-0.5 line-clamp-2">
                          {item.subtitle}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
