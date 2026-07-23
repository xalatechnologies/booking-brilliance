import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "link" | "inverted";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode | boolean;
  children: ReactNode;
  className?: string;
}

type ButtonOnly = ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps & { href?: undefined };
type AnchorOnly = AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & { href: string };

type EditorialButtonProps = ButtonOnly | AnchorOnly;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-navy text-on-navy border border-navy shadow-[inset_0_1px_0_hsl(0_0%_100%/0.22),inset_0_-2px_5px_hsl(207_100%_9%/0.45),0_2px_5px_-1px_hsl(207_100%_12%/0.45),0_11px_24px_-8px_hsl(207_100%_17%/0.55)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_hsl(0_0%_100%/0.26),inset_0_-2px_5px_hsl(207_100%_9%/0.5),0_6px_14px_-3px_hsl(207_100%_12%/0.5),0_20px_38px_-10px_hsl(207_100%_17%/0.65)] active:translate-y-0 active:shadow-[inset_0_2px_5px_hsl(207_100%_8%/0.55)]",
  outline:
    "text-ink border border-hairline-strong bg-gradient-to-b from-paper to-paper-deep/60 shadow-[0_1px_2px_rgba(10,18,40,0.08),0_6px_16px_-10px_rgba(10,18,40,0.25)] hover:-translate-y-0.5 hover:border-accent-text/40 hover:shadow-[0_10px_24px_-10px_rgba(10,18,40,0.34)] active:translate-y-0",
  inverted:
    "bg-paper text-ink border border-paper shadow-[0_2px_6px_-1px_rgba(10,18,40,0.16),0_10px_24px_-12px_rgba(10,18,40,0.3)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(10,18,40,0.4)] active:translate-y-0",
  link:
    "bg-transparent text-ink border-0 px-0 hover:underline underline-offset-8 decoration-[0.5px]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-xs px-4 py-2 gap-2",
  md: "text-sm px-5 py-3 gap-2.5",
  lg: "text-sm px-6 py-4 gap-3",
};

const BASE =
  "group inline-flex items-center justify-center rounded-md font-sans uppercase tracking-widest font-medium transition-all duration-quick ease-editorial focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export const EditorialButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  EditorialButtonProps
>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    icon = true,
    children,
    className,
    ...rest
  } = props;

  const showIcon = icon === true || (icon && icon !== false);
  const iconNode =
    icon === true || icon === undefined ? (
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    ) : (
      icon
    );

  const classes = cn(
    BASE,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span>{children}</span>
        {showIcon && iconNode}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span>{children}</span>
      {showIcon && iconNode}
    </button>
  );
});

EditorialButton.displayName = "EditorialButton";
