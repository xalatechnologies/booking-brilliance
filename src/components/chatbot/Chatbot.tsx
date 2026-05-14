import { useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatPanel } from "./ChatPanel";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chatbot/open";

export function Chatbot() {
  const reduced = useReducedMotion();
  const controller = useChatbot();
  const { state, toggle, setMode, startInquiry } = controller;

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

  return (
    <>
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
