import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  retrieve,
  answerFrom,
  followUpSuggestions,
  FALLBACK_NO_MATCH,
  buildLLMContext,
} from "@/lib/chatbot/rag";
import { getSearchCorpus, searchCorpus } from "@/lib/search/corpus";
import type {
  ChatMessage,
  ChatState,
  InquiryDraft,
  Mode,
  Persona,
} from "@/lib/chatbot/types";
import { summarizeInquiry } from "@/lib/chatbot/inquiry";

const STORAGE_KEY = "digilist-chat-v1";

const emptyDraft: InquiryDraft = {
  persona: null,
  topic: "",
  organization: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  contextSummary: "",
};

const initialState = (): ChatState => ({
  open: false,
  mode: "chat",
  messages: [],
  inquiry: { ...emptyDraft },
  thinking: false,
  error: null,
});

type Action =
  | { type: "TOGGLE_OPEN"; value?: boolean }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "SET_THINKING"; value: boolean }
  | { type: "SET_DRAFT"; patch: Partial<InquiryDraft> }
  | { type: "RESET" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "HYDRATE"; state: ChatState };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, open: action.value ?? !state.open };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_THINKING":
      return { ...state, thinking: action.value };
    case "SET_DRAFT":
      return { ...state, inquiry: { ...state.inquiry, ...action.patch } };
    case "RESET":
      return initialState();
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "HYDRATE":
      return { ...action.state, open: false, thinking: false };
    default:
      return state;
  }
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function buildContextSummary(messages: ChatMessage[]): string {
  return messages
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Bruker" : "Bot"}: ${m.text}`)
    .join("\n");
}

// Both endpoints are served by the digilist-api Node service on the VPS,
// reverse-proxied by nginx at /api/*. Same origin, so no CORS handshake.
const CHAT_ENDPOINT = "/api/chat";
const INQUIRY_ENDPOINT = "/api/inquiry";

export function useChatbot() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Persist + hydrate inquiry draft (not conversation) across reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted = JSON.parse(raw) as { inquiry: InquiryDraft };
        if (persisted.inquiry) {
          dispatch({ type: "SET_DRAFT", patch: persisted.inquiry });
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ inquiry: state.inquiry }),
      );
    } catch {
      // private mode etc
    }
  }, [state.inquiry]);

  // Lock body scroll while open on mobile
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (state.open && window.innerWidth < 768) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [state.open]);

  const toggle = useCallback((value?: boolean) => {
    dispatch({ type: "TOGGLE_OPEN", value });
  }, []);

  const setMode = useCallback((mode: Mode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatMessage = {
        id: cryptoId(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: userMsg });
      dispatch({ type: "SET_THINKING", value: true });
      dispatch({ type: "SET_ERROR", error: null });

      const hits = retrieve(trimmed, 3);
      // Whole-site intelligent search — shown as clickable cards under the reply
      // and fed to the LLM so it can cite pages/blog, not just FAQ.
      const results = searchCorpus(trimmed, getSearchCorpus()).slice(0, 6);

      // Path A — call the digilist-api /api/chat endpoint (Anthropic proxy).
      // Falls through to local FAQ retrieval if the service is unreachable
      // (e.g. before the VPS handler is deployed, or transient network issues).
      try {
        const history = state.messages
          .filter((m) => m.role !== "system")
          .slice(-8)
          .map((m) => ({ role: m.role, text: m.text }));
        const ctx = buildLLMContext(trimmed, hits, history, results);
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: ctx.system,
            messages: ctx.messages,
            hits,
          }),
        });
        if (res.ok) {
          const payload = (await res.json()) as { text?: string };
          if (payload?.text) {
            const assistantMsg: ChatMessage = {
              id: cryptoId(),
              role: "assistant",
              text: payload.text,
              sourceQ: hits[0]?.q,
              suggestions: followUpSuggestions(hits[0]),
              showInquiryCta: hits.length === 0,
              results,
              timestamp: Date.now(),
            };
            dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
            dispatch({ type: "SET_THINKING", value: false });
            return;
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn(
            "[chatbot] /api/chat unavailable, falling back to local FAQ:",
            err,
          );
        }
      }

      // Path B — local FAQ retrieval only
      const top = hits[0];
      let assistantMsg: ChatMessage;
      if (top && top.score >= 2) {
        const lead =
          top.score >= 5
            ? ""
            : "Basert på det jeg vet: ";
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: `${lead}${answerFrom(top)}`,
          sourceQ: top.q,
          suggestions: followUpSuggestions(top),
          results,
          timestamp: Date.now(),
        };
      } else {
        const fallback =
          FALLBACK_NO_MATCH[
            Math.floor(Math.random() * FALLBACK_NO_MATCH.length)
          ];
        assistantMsg = {
          id: cryptoId(),
          role: "assistant",
          text: fallback,
          suggestions: ["Send forespørsel", "Book demo"],
          showInquiryCta: true,
          showDemoCta: true,
          results,
          timestamp: Date.now(),
        };
      }
      // Tiny artificial latency makes streaming feel less janky
      setTimeout(() => {
        dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
        dispatch({ type: "SET_THINKING", value: false });
      }, 250);
    },
    [state.messages],
  );

  const startInquiry = useCallback(() => {
    dispatch({
      type: "SET_DRAFT",
      patch: { contextSummary: buildContextSummary(state.messages) },
    });
    dispatch({ type: "SET_MODE", mode: "inquiry-persona" });
  }, [state.messages]);

  const setPersona = useCallback((p: Persona) => {
    dispatch({ type: "SET_DRAFT", patch: { persona: p } });
    dispatch({ type: "SET_MODE", mode: "inquiry-topic" });
  }, []);

  const setTopic = useCallback((topic: string) => {
    dispatch({ type: "SET_DRAFT", patch: { topic } });
    dispatch({ type: "SET_MODE", mode: "inquiry-contact" });
  }, []);

  const updateDraft = useCallback((patch: Partial<InquiryDraft>) => {
    dispatch({ type: "SET_DRAFT", patch });
  }, []);

  const submitInquiry = useCallback(async () => {
    dispatch({ type: "SET_THINKING", value: true });
    dispatch({ type: "SET_ERROR", error: null });
    const payload = {
      ...state.inquiry,
      summary: summarizeInquiry(state.inquiry),
      source: "chatbot",
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({ type: "SET_MODE", mode: "inquiry-success" });
    } catch (err) {
      console.error("[chatbot] /api/inquiry failed:", err);
      dispatch({ type: "SET_THINKING", value: false });
      dispatch({
        type: "SET_ERROR",
        error:
          "Vi fikk ikke sendt forespørselen. Prøv igjen, eller send e-post direkte til kontakt@digilist.no.",
      });
    }
  }, [state.inquiry]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Both endpoints are Supabase edge functions invoked via the supabase
  // client. The hook tries them first and falls back gracefully — there's
  // no longer a build-time toggle.
  const isConfigured = useMemo(() => ({ llm: true, inquiry: true }), []);

  return {
    state,
    toggle,
    send,
    setMode,
    startInquiry,
    setPersona,
    setTopic,
    updateDraft,
    submitInquiry,
    reset,
    isConfigured,
  };
}
