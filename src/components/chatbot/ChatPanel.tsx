import { useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  RotateCcw,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { MessageBubble } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";
import { InquiryFlow } from "./InquiryFlow";
import { getFraunces } from "@/lib/fonts";

interface Props {
  controller: ReturnType<typeof useChatbot>;
}

export function ChatPanel({ controller }: Props) {
  const reduced = useReducedMotion();
  const {
    state,
    toggle,
    send,
    startInquiry,
    setMode,
    setPersona,
    setTopic,
    updateDraft,
    submitInquiry,
    reset,
  } = controller;

  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (state.open && state.mode === "chat") {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [state.open, state.mode]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [state.messages.length, state.thinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await send(text);
  };

  const isInquiry = state.mode.startsWith("inquiry-");
  const lastAssistant = [...state.messages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <AnimatePresence>
      {state.open && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 1 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggle(false)}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          <motion.aside
            key="chat-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Digilist-assistenten"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 bg-paper border border-hairline-strong shadow-2xl rounded-sm flex flex-col overflow-hidden
              inset-x-3 bottom-3 top-10 max-h-[calc(100vh-1rem)]
              md:inset-auto md:right-6 md:bottom-24 md:top-auto md:w-[30rem] md:h-[44rem] md:max-h-[90vh]"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-rule bg-paper-deep/40">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-9 h-9 bg-navy text-on-navy rounded-sm shrink-0"
                >
                  <MessageSquare className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p
                    className="font-serif text-lg text-ink leading-none"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Digilist-assistent
                  </p>
                  <p className="editorial-mono-caption text-ink-faint mt-1">
                    {isInquiry ? "FORESPØRSEL · 3 STEG" : "AI + FAQ · NORSK"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {state.messages.length > 1 && state.mode === "chat" && (
                  <button
                    type="button"
                    aria-label="Start ny samtale"
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-ink-faint hover:text-ink hover:bg-paper-deep transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Lukk samtale"
                  onClick={() => toggle(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-ink hover:bg-paper-deep transition-colors"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Body */}
            {isInquiry ? (
              <div className="flex-1 overflow-y-auto">
                <InquiryFlow
                  mode={state.mode}
                  draft={state.inquiry}
                  thinking={state.thinking}
                  error={state.error}
                  onSetPersona={setPersona}
                  onSetTopic={setTopic}
                  onUpdate={updateDraft}
                  onBack={() => {
                    if (state.mode === "inquiry-contact")
                      setMode("inquiry-topic");
                    else if (state.mode === "inquiry-topic")
                      setMode("inquiry-persona");
                    else setMode("chat");
                  }}
                  onSubmit={submitInquiry}
                  onClose={() => {
                    setMode("chat");
                    toggle(false);
                  }}
                />
              </div>
            ) : (
              <>
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                  aria-live="polite"
                >
                  {state.messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  {state.thinking && (
                    <div className="flex items-center gap-2 px-1 editorial-mono-caption text-ink-faint">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-text animate-pulse" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-text animate-pulse [animation-delay:.18s]" />
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-text animate-pulse [animation-delay:.36s]" />
                      <span className="ml-1">SKRIVER</span>
                    </div>
                  )}
                  {lastAssistant?.suggestions &&
                    !state.thinking && (
                      <QuickReplies
                        suggestions={lastAssistant.suggestions}
                        onPick={(s) => {
                          if (
                            s.toLowerCase().includes("rådgiver") ||
                            s.toLowerCase().includes("forespørsel")
                          ) {
                            startInquiry();
                          } else {
                            void send(s);
                          }
                        }}
                      />
                    )}
                  {lastAssistant?.showInquiryCta && !state.thinking && (
                    <button
                      type="button"
                      onClick={startInquiry}
                      className="group flex items-center gap-2 px-3 py-2 bg-navy text-on-navy rounded-sm hover:bg-navy/90 transition-colors"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span className="font-serif text-sm">
                        Send forespørsel til oss
                      </span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>

                {/* Input row */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                  }}
                  className="border-t border-rule p-3 bg-paper-deep/40"
                >
                  <div className="flex items-end gap-2">
                    <label htmlFor="chat-input" className="sr-only">
                      Skriv din melding
                    </label>
                    <textarea
                      ref={inputRef}
                      id="chat-input"
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                      placeholder="Spør om Digilist …"
                      disabled={state.thinking}
                      className="flex-1 resize-none border border-hairline-strong bg-paper px-3 py-2.5 rounded-sm text-sm text-ink focus:outline-none focus:border-ink max-h-32 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      aria-label="Send melding"
                      disabled={!input.trim() || state.thinking}
                      className="inline-flex items-center justify-center w-10 h-10 bg-navy text-on-navy rounded-sm hover:bg-navy/90 disabled:opacity-40 transition-colors shrink-0"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="editorial-mono-caption text-ink-faint mt-2 px-1">
                    SVAR ER BASERT PÅ DIGILISTS FAQ. FOR PERSONLIGE TILBUD,
                    SEND FORESPØRSEL.
                  </p>
                </form>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
