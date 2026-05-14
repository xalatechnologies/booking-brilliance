import { MessageSquare, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatPanel } from "./ChatPanel";

export function Chatbot() {
  const reduced = useReducedMotion();
  const controller = useChatbot();
  const { state, toggle } = controller;

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
