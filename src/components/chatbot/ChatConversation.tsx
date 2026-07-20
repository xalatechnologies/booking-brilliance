import { useEffect, useRef, useState } from "react";
import { X, Send, RotateCcw, MessageSquare, ArrowRight, PanelRightClose } from "lucide-react";
import { useChatbot } from "@/hooks/useChatbot";
import { MessageBubble } from "./MessageBubble";
import { QuickReplies } from "./QuickReplies";
import { InquiryFlow } from "./InquiryFlow";
import { getFraunces } from "@/lib/fonts";

const STARTER_SUGGESTIONS = [
  "Finn selskapslokale",
  "Hva koster det å leie et lokale?",
  "Bookingsystem for kommuner",
  "Sesongtildeling",
  "Book demo",
];

interface Props {
  controller: ReturnType<typeof useChatbot>;
  /** Header close/collapse action. Mobile panel closes; the rail collapses. */
  onClose: () => void;
  /** Rail uses a collapse icon + label instead of an X. */
  closeVariant?: "close" | "collapse";
}

/**
 * The shared conversation UI (header + message list + input, or the inquiry
 * flow) — with no positioning of its own. Rendered inside the floating panel
 * (mobile) and inside the persistent right rail (desktop). Fills its parent
 * (flex column, h-full).
 */
export function ChatConversation({ controller, onClose, closeVariant = "close" }: Props) {
  const {
    state,
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
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [state.open, state.mode]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [state.messages.length, state.thinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await send(text);
  };

  const isInquiry = state.mode.startsWith("inquiry-");
  const lastAssistant = [...state.messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex flex-col h-full min-h-0 bg-paper">
      {/* Header — in the rail, pinned to the navbar's height so the bottom
          borders line up across the top of the page. */}
      <header
        className={`flex items-center justify-between gap-3 px-5 border-b border-rule bg-paper-deep/40 shrink-0 ${
          closeVariant === "collapse" ? "h-[76px] py-0" : "py-4"
        }`}
      >
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
              style={{ fontVariationSettings: getFraunces("sub"), letterSpacing: "-0.015em" }}
            >
              Digilist-assistent
            </p>
            {isInquiry && (
              <p className="editorial-mono-caption text-ink-faint mt-1">FORESPØRSEL · 3 STEG</p>
            )}
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
            aria-label={closeVariant === "collapse" ? "Skjul assistenten" : "Lukk samtale"}
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-ink hover:bg-paper-deep transition-colors"
          >
            {closeVariant === "collapse" ? (
              <PanelRightClose className="h-4 w-4" aria-hidden="true" />
            ) : (
              <X className="h-4 w-4" aria-hidden="true" />
            )}
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
              if (state.mode === "inquiry-contact") setMode("inquiry-topic");
              else if (state.mode === "inquiry-topic") setMode("inquiry-persona");
              else setMode("chat");
            }}
            onSubmit={submitInquiry}
            onClose={() => {
              setMode("chat");
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
            {state.messages.length === 0 && !state.thinking && (
              <div className="pt-1">
                <p className="text-base text-ink-soft leading-relaxed mb-4">
                  Søk etter et lokale, eller spør om Digilist.
                </p>
                <QuickReplies suggestions={STARTER_SUGGESTIONS} onPick={(s) => void send(s)} />
              </div>
            )}
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
            {lastAssistant?.suggestions && !state.thinking && (
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
                <span className="font-serif text-sm">Send forespørsel til oss</span>
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
            className="border-t border-rule p-3 bg-paper-deep/40 shrink-0"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Søk eller skriv din melding
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
                placeholder="Søk eller spør om Digilist …"
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
          </form>
        </>
      )}
    </div>
  );
}

export default ChatConversation;
