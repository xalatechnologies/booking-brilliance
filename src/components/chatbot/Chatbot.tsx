import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatPanel } from "./ChatPanel";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chatbot/open";

// Use localStorage with a versioned key. Only the explicit × dismisses
// the teaser long-term; reloading the page brings it back so users who
// missed it the first time get another chance.
const TEASER_DISMISSED_KEY = "digilist-chat-teaser-dismissed-v2";
const TEASER_DELAY_MS = 4500;

const TEASER_SUGGESTIONS = [
  "Hva er Digilist?",
  "SSA-L 2026",
  "Book demo",
  "Pris for kommuner",
];

export function Chatbot() {
  const reduced = useReducedMotion();
  const controller = useChatbot();
  const { state, toggle, setMode, startInquiry, send } = controller;

  const [showTeaser, setShowTeaser] = useState(false);

  // Show the teaser balloon a few seconds after mount on every page load,
  // unless the user has explicitly dismissed it via the × button.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(TEASER_DISMISSED_KEY) === "1") return;
    } catch {
      // private mode etc.
    }
    const t = window.setTimeout(() => setShowTeaser(true), TEASER_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  // If the user opens the chat (via any other path), hide the teaser
  // for this view — but do NOT persist; teaser returns on next reload.
  useEffect(() => {
    if (state.open) setShowTeaser(false);
  }, [state.open]);

  // Listen for global "open chatbot" events fired from CTAs anywhere on site.
  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenChatDetail>).detail ?? {};
      toggle(true);
      if (detail.mode === "inquiry-persona") {
        // Defer so the panel mounts before mode swap.
        setTimeout(() => startInquiry(), 80);
      } else if (detail.mode === "chat") {
        setMode("chat");
      }
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [toggle, setMode, startInquiry]);

  const dismissTeaser = (persist: boolean) => {
    setShowTeaser(false);
    if (!persist) return;
    try {
      localStorage.setItem(TEASER_DISMISSED_KEY, "1");
    } catch {
      // private mode etc.
    }
  };

  const pickSuggestion = (q: string) => {
    dismissTeaser(false); // chip-picked → close balloon, but allow return on next reload
    toggle(true);
    setMode("chat");
    // Defer slightly so the chat panel mounts and the input ref is ready.
    setTimeout(() => {
      void send(q);
    }, 120);
  };

  return (
    <>
      {/* Teaser balloon — appears a few seconds after page load */}
      <AnimatePresence>
        {showTeaser && !state.open && (
          <motion.div
            key="chat-teaser"
            role="dialog"
            aria-label="Digilist-assistenten, forslag"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-4 lg:bottom-24 lg:right-6 z-40 w-[min(20rem,calc(100vw-2rem))] bg-paper border border-hairline-strong rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 border-b border-rule bg-paper-deep/40 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="font-serif text-lg text-ink leading-snug"
                  style={{
                    fontVariationSettings:
                      '"opsz" 48, "wght" 460, "SOFT" 30',
                    letterSpacing: "-0.015em",
                  }}
                >
                  Hei, lurer du på noe?
                </p>
                <p className="editorial-mono-caption text-ink-faint mt-1">
                  DIGILIST-ASSISTENT · NORSK
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismissTeaser(true)}
                aria-label="Lukk forslag"
                className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-ink-faint hover:text-ink hover:bg-paper-deep transition-colors shrink-0"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-ink-soft leading-relaxed">
                Velg et raskt forslag, eller åpne chat for å spørre fritt.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {TEASER_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => pickSuggestion(q)}
                    className="font-sans text-xs px-3 py-1.5 border border-rule rounded-full text-ink hover:bg-navy hover:text-on-navy hover:border-navy transition-colors duration-quick ease-editorial"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  dismissTeaser(false);
                  toggle(true);
                  setMode("chat");
                }}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-navy text-on-navy rounded-sm py-2.5 text-sm font-medium hover:bg-navy/90 transition-colors"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Snakk med oss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={state.open ? "Lukk Digilist-assistenten" : "Åpne Digilist-assistenten"}
        aria-expanded={state.open}
        aria-controls="digilist-chatbot-panel"
        onClick={() => toggle()}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={`fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40 inline-flex items-center gap-2 bg-navy text-on-navy rounded-full pl-4 pr-5 py-3 shadow-2xl border border-navy/30 hover:bg-navy/95 transition-all duration-quick ease-editorial ${
          state.open ? "scale-95" : ""
        }`}
      >
        {state.open ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="font-serif text-base leading-none">
          {state.open ? "Lukk" : "Snakk med oss"}
        </span>
      </motion.button>

      <ChatPanel controller={controller} />
    </>
  );
}
