// Global open helper for the Digilist chatbot.
//
// The Chatbot component lives once at the root in App.tsx with its own state
// (useChatbot). Anywhere in the tree — buttons, blog post links, markdown
// anchors — can request the chatbot to open by dispatching this event.
// The Chatbot listens for it and flips `state.open`.

export const OPEN_CHAT_EVENT = "digilist:open-chatbot";

export type OpenChatDetail = {
  mode?: "chat" | "inquiry-persona";
  seed?: string;
};

export function openChatbot(detail: OpenChatDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail }));
}
