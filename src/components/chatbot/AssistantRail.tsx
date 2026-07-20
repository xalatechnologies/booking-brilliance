import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useChatbotContext } from "./ChatbotProvider";
import { ChatConversation } from "./ChatConversation";

/**
 * The persistent right rail (desktop, `lg+` only). Always mounted; expand /
 * collapse is driven by `railExpanded` in the ChatbotProvider. It publishes the
 * reserved width as the `--rail-w` CSS variable on <html>, which both the
 * ContentShell padding and the Navbar's right edge read — so the navbar and the
 * page body stay aligned to the same content box. Sub-desktop uses the floating
 * Chatbot instead (this is `hidden lg:*`); on unmount (e.g. /admin) the variable
 * resets to 0 so those layouts reclaim full width.
 */
export function AssistantRail() {
  const { controller, railExpanded, setRailExpanded } = useChatbotContext();

  useEffect(() => {
    const el = document.documentElement;
    el.style.setProperty("--rail-w", railExpanded ? "22rem" : "0px");
    return () => el.style.setProperty("--rail-w", "0px");
  }, [railExpanded]);

  return (
    <>
      <aside
        aria-label="Digilist-assistenten"
        className={`hidden lg:flex flex-col fixed top-0 right-0 bottom-0 w-[22rem] z-30 border-l border-rule bg-paper transition-transform duration-300 ease-out ${
          railExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ChatConversation
          controller={controller}
          onClose={() => setRailExpanded(false)}
          closeVariant="collapse"
        />
      </aside>

      {/* Reopen button — shown only when the rail is collapsed */}
      <button
        type="button"
        onClick={() => setRailExpanded(true)}
        aria-label="Vis Digilist-assistenten"
        className={`hidden lg:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2 bg-navy text-on-navy rounded-full pl-4 pr-5 py-3 shadow-2xl border border-navy/30 hover:bg-navy/95 transition-all duration-quick ease-editorial ${
          railExpanded ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"
        }`}
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span className="font-serif text-base leading-none">Assistent</span>
      </button>
    </>
  );
}

export default AssistantRail;
