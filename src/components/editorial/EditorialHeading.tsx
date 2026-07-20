import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getFraunces, FrauncesSize } from "@/lib/fonts";

interface EditorialHeadingProps {
  as?: ElementType;
  size?: "hero" | "display" | "section" | "sub";
  children: ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<EditorialHeadingProps["size"]>, string> = {
  hero: "text-5xl md:text-7xl lg:text-8xl tracking-tight",
  display: "text-4xl md:text-6xl lg:text-7xl tracking-tight",
  section: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  sub: "text-xl md:text-2xl",
};

const SIZE_TO_FRAUNCES: Record<NonNullable<EditorialHeadingProps["size"]>, FrauncesSize> = {
  hero: "hero",
  display: "display",
  section: "section",
  sub: "sub",
};

export function EditorialHeading({
  as: Tag = "h2",
  size = "section",
  children,
  className,
}: EditorialHeadingProps) {
  const variation = getFraunces(SIZE_TO_FRAUNCES[size]);

  return (
    <Tag
      className={cn(
        "font-serif text-ink",
        SIZE_CLASSES[size],
        size === "sub" && "italic",
        className
      )}
      style={{
        fontVariationSettings: variation,
        lineHeight: size === "hero" ? 0.95 : size === "display" ? 0.98 : 1.05,
        letterSpacing: size === "hero" ? "-0.025em" : "-0.015em",
      }}
    >
      {children}
    </Tag>
  );
}
