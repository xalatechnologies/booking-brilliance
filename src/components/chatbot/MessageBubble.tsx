import type { ChatMessage } from "@/lib/chatbot/types";
import { getFraunces } from "@/lib/fonts";
import { ResultCards } from "./ResultCards";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-1`}
      role="article"
      aria-label={isUser ? "Din melding" : "Svar fra Digilist-assistenten"}
    >
      <div
        className={`max-w-[85%] rounded-sm border ${
          isUser
            ? "bg-navy text-on-navy border-navy"
            : "bg-paper text-ink border-hairline-strong"
        } px-4 py-3`}
      >
        <p
          className={`whitespace-pre-wrap leading-relaxed ${
            isUser ? "text-sm" : "text-base"
          }`}
          style={
            isUser
              ? undefined
              : {
                  fontFamily: '"Newsreader", Georgia, serif',
                  fontVariationSettings: getFraunces("sub"),
                  letterSpacing: "-0.005em",
                }
          }
        >
          {message.text}
        </p>
        {message.sourceQ && !isUser && (
          <p className="mt-2 pt-2 border-t border-rule editorial-mono-caption text-ink-faint">
            Kilde: {message.sourceQ}
          </p>
        )}
        {!isUser && message.results && message.results.length > 0 && (
          <ResultCards results={message.results} />
        )}
      </div>
    </div>
  );
}
