import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidenoteProps {
  marker?: string | number;
  children: ReactNode;
  className?: string;
}

export function Sidenote({ marker, children, className }: SidenoteProps) {
  return (
    <div
      className={cn(
        "mt-6 py-4 pl-5 lg:pl-6 border-l-2 border-accent-text/60",
        "text-lg lg:text-xl text-ink-soft leading-relaxed",
        className
      )}
    >
      {marker !== undefined && (
        <span className="inline-flex items-center justify-center w-7 h-7 mr-3 align-middle bg-navy text-on-navy rounded-full font-mono text-xs tabular-nums">
          {marker}
        </span>
      )}
      {children}
    </div>
  );
}
