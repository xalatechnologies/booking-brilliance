import { useMemo } from "react";
import type { ChatMessage } from "@/lib/chatbot/types";
import { getFraunces } from "@/lib/fonts";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const time = useMemo(
    () =>
      new Date(message.timestamp).toLocaleTimeString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [message.timestamp],
  );
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
        {!isUser && (
          <div className="editorial-mono-caption text-accent-text mb-1.5">
            DIGILIST-ASSISTENT
          </div>
        )}
        <p
          className={`whitespace-pre-wrap leading-relaxed ${
            isUser ? "text-sm" : "text-base"
          }`}
          style={
            isUser
              ? undefined
              : {
                  fontFamily: '"Fraunces", Georgia, serif',
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
        <div
          className={`mt-2 text-[10px] tracking-widest tabular-nums font-mono ${
            isUser ? "text-on-navy/70" : "text-ink-faint"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
