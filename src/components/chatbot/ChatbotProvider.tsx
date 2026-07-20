import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useChatbot } from "@/hooks/useChatbot";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chatbot/open";

type Controller = ReturnType<typeof useChatbot>;

interface ChatbotContextValue {
  controller: Controller;
  /** Desktop-only: whether the persistent right rail is expanded (vs collapsed). */
  railExpanded: boolean;
  setRailExpanded: (v: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

const RAIL_KEY = "digilist-rail-expanded-v1";

function initialRailExpanded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(RAIL_KEY) !== "0";
  } catch {
    return true;
  }
}

/**
 * Single chatbot store for the whole app, shared by the desktop AssistantRail
 * and the sub-desktop floating Chatbot. Also owns the rail's expand/collapse
 * state and handles global `openChatbot` events fired from CTAs across the site.
 */
export function ChatbotProvider({ children }: { children: ReactNode }) {
  const controller = useChatbot();
  const { toggle, setMode, startInquiry, send } = controller;
  const [railExpanded, setRailExpandedState] = useState(initialRailExpanded);

  const setRailExpanded = (v: boolean) => {
    setRailExpandedState(v);
    try {
      localStorage.setItem(RAIL_KEY, v ? "1" : "0");
    } catch {
      /* private mode */
    }
  };

  // Global "open chatbot" events from CTAs anywhere on the site. On desktop this
  // also re-expands the rail; on sub-desktop it opens the floating panel.
  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenChatDetail>).detail ?? {};
      toggle(true);
      setRailExpanded(true);
      if (detail.mode === "inquiry-persona") setTimeout(() => startInquiry(), 80);
      else if (detail.mode === "chat") setMode("chat");
      if (detail.seed) setTimeout(() => void send(detail.seed as string), 120);
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle, setMode, startInquiry, send]);

  return (
    <ChatbotContext.Provider value={{ controller, railExpanded, setRailExpanded }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext(): ChatbotContextValue {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbotContext must be used within ChatbotProvider");
  return ctx;
}
