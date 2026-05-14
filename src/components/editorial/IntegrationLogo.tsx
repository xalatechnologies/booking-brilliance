import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface IntegrationLogoProps {
  brand: string;
  className?: string;
  size?: Size;
  /** When true, render only the mark without the wordmark next to it. */
  iconOnly?: boolean;
}

const FRAME: Record<Size, string> = {
  sm: "w-7 h-7",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};
const ICON: Record<Size, string> = {
  sm: "h-[18px] w-[18px]",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * Editorial brand marks for Digilist integrations.
 * Each brand gets a hand-tuned monochrome SVG mark + wordmark.
 * Treatment is deliberately uniform (Navy on Paper) so the section reads
 * as a list of *departments*, not a logo soup.
 */
export function IntegrationLogo({
  brand,
  className,
  size = "sm",
  iconOnly = false,
}: IntegrationLogoProps) {
  const slug = brand
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div
      className={cn(
        "flex items-center text-ink",
        iconOnly ? "" : "gap-3",
        className,
      )}
    >
      <span
        className={cn(
          "text-accent-text shrink-0 inline-flex items-center justify-center rounded-sm border border-rule bg-paper",
          FRAME[size],
        )}
      >
        {renderMark(slug, ICON[size])}
      </span>
      {!iconOnly && (
        <span className="font-sans text-base font-medium leading-tight">
          {brand}
        </span>
      )}
    </div>
  );
}

function renderMark(slug: string, cls: string) {

  switch (slug) {
    case "vipps":
    case "vipps-mobilepay":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.4.3 2.7.8 3.9.4-.6 1.1-1 1.9-1 1.3 0 2.3 1 2.3 2.3 0 .4-.1.8-.3 1.2C8.5 20.3 10.2 21 12 21c5.5 0 10-4.5 10-10S17.5 2 12 2zm-2 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5 4.5c-.9 2-2.9 3.5-5.5 3.5-2.3 0-4.4-1.4-5.3-3.5-.3-.7.5-1.3 1.1-.9 1 .7 2.5 1.4 4.2 1.4 1.6 0 3.2-.6 4.4-1.4.6-.4 1.4.2 1.1.9z" />
        </svg>
      );
    case "bankid":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h2c1 0 2 .5 2 1.5S10 12 9 12H7V9zm0 3h2.5c1 0 2 .5 2 1.5S10.5 15 9.5 15H7v-3zM14 9v6m3-6v6" strokeLinecap="round" />
        </svg>
      );
    case "stripe":
    case "stripe-connect":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
          <path d="M13.5 9.3c0-.7.6-1 1.6-1 1.4 0 3.2.4 4.6 1.2V5.6c-1.5-.6-3-.9-4.6-.9-3.8 0-6.3 2-6.3 5.3 0 5.2 7.1 4.4 7.1 6.6 0 .8-.7 1.1-1.8 1.1-1.5 0-3.5-.6-5.1-1.4v4c1.7.7 3.5 1.1 5.1 1.1 3.9 0 6.5-1.9 6.5-5.3 0-5.6-7.1-4.6-7.1-6.7z" />
        </svg>
      );
    case "id-porten":
    case "idporten":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
        </svg>
      );
    case "signicat":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 12l3 3 4-4M13 12l3 3 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "altinn":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
          <path d="M3 20V8l9-5 9 5v12h-6v-7h-6v7H3z" />
        </svg>
      );
    case "ehf-peppol":
    case "ehf":
    case "peppol":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M8 9h8M8 13h6M8 17h4" strokeLinecap="round" />
        </svg>
      );
    case "bronnoysund":
    case "brnnysund":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 9l9-5 9 5M5 9v11h14V9" strokeLinejoin="round" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );
    case "visma":
    case "visma-eaccounting":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
          <path d="M3 6h4l3 10h.1l3-10h4l-5 14h-4.2L3 6z" />
        </svg>
      );
    case "rco":
    case "rco-booking":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9c1.5 0 2 .5 2 1.5S8.5 12 7 12V9zm0 3l3 3M14 9v6m0-3h3M19 12c0 1.5-1 3-2.5 3" strokeLinecap="round" />
        </svg>
      );
    case "tripletex":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 6h16M12 6v14M7 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "fiken":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 10v4l3-2-3-2zM14 9v6" strokeLinecap="round" />
        </svg>
      );
    case "poweroffice":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z" strokeLinejoin="round" />
        </svg>
      );
    case "microsoft-365":
    case "microsoft":
    case "microsoft365":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" opacity="0.7" />
          <rect x="3" y="13" width="8" height="8" opacity="0.85" />
          <rect x="13" y="13" width="8" height="8" opacity="0.55" />
        </svg>
      );
    case "outlook":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="6" width="18" height="13" rx="1" />
          <path d="M3 8l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "salto-ks":
    case "salto":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15" r="1" fill="currentColor" />
        </svg>
      );
    case "iso-27001-27701":
    case "iso-27001":
    case "iso":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "gdpr":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3l8 4v6c0 4-3 7-8 8-5-1-8-4-8-8V7l8-4z" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 14v3" strokeLinecap="round" />
        </svg>
      );
    case "wcag-2-0-aa":
    case "wcag":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
  }
}
