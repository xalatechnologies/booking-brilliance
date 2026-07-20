import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatConversation } from "./ChatConversation";

interface Props {
  controller: ReturnType<typeof useChatbot>;
}

/**
 * The floating chat panel used below `lg` (mobile/tablet) and by the launcher.
 * On desktop the persistent AssistantRail renders the same ChatConversation
 * instead. Positioning + open/close animation live here; the conversation UI
 * is shared.
 */
export function ChatPanel({ controller }: Props) {
  const reduced = useReducedMotion();
  const { state, toggle } = controller;

  return (
    <AnimatePresence>
      {state.open && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggle(false)}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          <motion.aside
            key="chat-panel"
            id="digilist-chatbot-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Digilist-assistenten"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 lg:hidden border border-hairline-strong shadow-2xl rounded-sm overflow-hidden
              inset-x-3 bottom-3 top-10 max-h-[calc(100vh-1rem)]
              md:inset-auto md:right-6 md:bottom-24 md:top-auto md:w-[30rem] md:h-[44rem] md:max-h-[90vh]"
          >
            <ChatConversation controller={controller} onClose={() => toggle(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
