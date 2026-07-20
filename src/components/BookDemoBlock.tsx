import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  EditorialHeading,
  EditorialCard,
  EditorialButton,
  TrustBadge,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { openChatbot } from "@/lib/chatbot/open";

type FormState = {
  name: string;
  email: string;
  organization: string;
  phone: string;
  role: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  role: "",
  message: "",
};

const ROLE_OPTIONS = [
  { value: "kommune", label: "Kommune" },
  { value: "selskapslokale", label: "Selskapslokale / utleier" },
  { value: "idrett", label: "Idrettsanlegg" },
  { value: "kulturhus", label: "Kulturhus / scene" },
  { value: "kontor", label: "Kontor / coworking" },
  { value: "annet", label: "Annet" },
];

const HVA_FAAR_DU = [
  "30–45 minutters demo, tilpasset ditt bruksområde",
  "Gjennomgang av booking, betaling, sesongleie og fakturering",
  "Spørsmål og svar: vi pakker ikke inn standarddemoen vår",
  "Et notat med konkrete neste steg dersom dere vurderer pilot",
];

const HVA_VI_TRENGER = [
  "Type virksomhet og typisk bookingvolum",
  "Eventuelle krav fra anskaffelser eller intern compliance",
  "Hvilke roller som skal se demoen (administrasjon, drift, økonomi)",
];

type Props = {
  /** Source label sent with the inquiry — e.g. "book-demo" or "homepage-kontakt" */
  source: string;
  /** Show the Ibrahim byline (used on the /book-demo page, hidden on homepage) */
  showByline?: boolean;
  /** Heading level for the "Book en demo." title. Use h1 on /book-demo where
   *  it's the primary heading; default h2 keeps the homepage's hero h1 dominant. */
  headingAs?: "h1" | "h2";
  /** Render the visible "Book en demo." display heading. Set false on the
   *  homepage, where a "BOOK EN DEMO" section eyebrow labels it instead (an
   *  sr-only heading keeps the document outline intact). */
  heading?: boolean;
};

export function BookDemoBlock({
  source,
  showByline = false,
  headingAs = "h2",
  heading = true,
}: Props) {
  // Section sub-headings sit exactly one level below the main heading so the
  // outline never skips: H1→H2 on /book-demo (headingAs="h1"), H2→H3 on the
  // homepage (headingAs="h2"). Previously hardcoded <h3> → H1→H3 skip.
  const SubHeading = headingAs === "h1" ? "h2" : "h3";
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const roleLabel =
        ROLE_OPTIONS.find((r) => r.value === form.role)?.label ?? form.role;
      const payload = {
        name: form.name,
        email: form.email,
        organization: form.organization,
        phone: form.phone,
        persona: form.role || "ukjent",
        topic: "Demo-forespørsel",
        message: form.message,
        summary: `Demo-forespørsel: ${form.organization} (${roleLabel})`,
        source,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Inquiry endpoint returned ${res.status}`);

      setSubmitted(true);
    } catch (err) {
      console.error("[book-demo-block] /api/inquiry failed:", err);
      setError(
        "Vi fikk ikke sendt forespørselen. Prøv igjen, eller send e-post direkte til kontakt@digilist.no.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.organization.trim() &&
    form.role &&
    !submitting;

  const inputClass =
    "block w-full border-0 border-b border-hairline-strong rounded-none bg-transparent px-0 py-3 font-sans text-base text-ink placeholder:text-ink-faint focus:outline-none focus:border-navy focus:ring-0 transition-colors duration-quick ease-editorial";
  const labelClass = "editorial-mono-caption text-ink-soft mb-1 block";

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter mt-10 lg:mt-14">
      {/* Left: editorial copy */}
      <div className="lg:col-span-5">
        {heading ? (
          <EditorialHeading as={headingAs} size="display" className="mb-6">
            Book en{" "}
            <em
              className="italic"
              style={{ fontVariationSettings: getFraunces("display") }}
            >
              demo
            </em>
            .
          </EditorialHeading>
        ) : (
          <h2 className="sr-only">Book en demo</h2>
        )}
        <p
          className="text-xl text-ink-soft italic measure leading-relaxed mb-10"
          style={{ fontVariationSettings: getFraunces("sub") }}
        >
          Vi pakker ikke inn en standarddemo. Fortell oss kort hva dere driver
          med, så viser vi delene som faktisk angår dere.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="space-y-10"
        >
          <motion.div variants={staggerChild}>
            <SubHeading className="editorial-mono-caption text-ink-soft mb-4">
              HVA DU FÅR
            </SubHeading>
            <ul className="space-y-3">
              {HVA_FAAR_DU.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-ink leading-relaxed"
                >
                  <CheckCircle2
                    className="h-4 w-4 mt-1 text-accent-text shrink-0"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerChild}>
            <SubHeading className="editorial-mono-caption text-ink-soft mb-4">
              HVA VI TRENGER FRA DEG
            </SubHeading>
            <ul className="space-y-3">
              {HVA_VI_TRENGER.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-ink leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 mt-2.5 rounded-full bg-accent-text shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={staggerChild}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <TrustBadge>Ingen forpliktelser</TrustBadge>
            <TrustBadge>Rask respons</TrustBadge>
            <TrustBadge>Personlig gjennomgang</TrustBadge>
          </motion.div>

          <motion.div variants={staggerChild} className="pt-2">
            <p className="text-base text-ink-soft leading-relaxed measure">
              Foretrekker du en uformell prat først?{" "}
              <button
                type="button"
                onClick={() => openChatbot({ mode: "chat" })}
                className="underline underline-offset-4 decoration-[0.5px] text-accent-text hover:text-ink transition-colors"
              >
                Snakk med oss
              </button>{" "}
              og få svar i chat på under et minutt i kontortid.
            </p>
          </motion.div>

          {showByline && (
            <Byline
              author="Ibrahim Rahmani"
              role="Xala Technologies AS · CTO"
              date="Oslo · 2026"
            />
          )}
        </motion.div>
      </div>

      {/* Right: form card */}
      <div className="lg:col-span-7">
        <EditorialCard className="p-8 lg:p-12">
          {submitted ? (
            <div className="text-center py-12 lg:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-hairline-strong rounded-sm mb-6">
                <CheckCircle2
                  className="h-8 w-8 text-accent-text"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </div>
              <SubHeading
                className="font-serif text-3xl lg:text-4xl text-ink mb-4"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                }}
              >
                Takk, vi tar kontakt.
              </SubHeading>
              <p className="text-lg text-ink-soft measure mx-auto leading-relaxed mb-8">
                Forespørselen er sendt til{" "}
                <span className="font-mono text-sm">admin@digilist.no</span>. En av oss
                svarer innen 24 timer på hverdager, som regel raskere.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <EditorialButton variant="primary" size="md" href="/">
                  Tilbake til forsiden
                </EditorialButton>
                <EditorialButton
                  variant="outline"
                  size="md"
                  onClick={() => openChatbot({ mode: "chat" })}
                >
                  Snakk med oss imens
                </EditorialButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <header className="pb-6 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text">
                  DEMO-FORESPØRSEL
                </span>
                <SubHeading
                  className="font-serif text-2xl lg:text-3xl text-ink mt-2"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                    lineHeight: 1.15,
                  }}
                >
                  Send oss noen detaljer.
                </SubHeading>
              </header>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={`${source}-name`} className={labelClass}>
                    Navn *
                  </label>
                  <input
                    id={`${source}-name`}
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Ola Nordmann"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-email`} className={labelClass}>
                    E-post *
                  </label>
                  <input
                    id={`${source}-email`}
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="ola@kommune.no"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-org`} className={labelClass}>
                    Organisasjon *
                  </label>
                  <input
                    id={`${source}-org`}
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.organization}
                    onChange={handleChange("organization")}
                    placeholder="Skien kommune"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${source}-phone`} className={labelClass}>
                    Telefon (valgfritt)
                  </label>
                  <input
                    id={`${source}-phone`}
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+47 ..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${source}-role`} className={labelClass}>
                  Hvilken type virksomhet? *
                </label>
                <select
                  id={`${source}-role`}
                  required
                  value={form.role}
                  onChange={handleChange("role")}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Velg …
                  </option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${source}-message`} className={labelClass}>
                  Hva er viktig for dere? (valgfritt)
                </label>
                <textarea
                  id={`${source}-message`}
                  rows={4}
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Sesongleie, ID-porten, EHF, antall anlegg, krav fra anskaffelse …"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="border-l-2 border-navy bg-paper-deep/60 px-4 py-3 text-sm text-ink"
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6">
                <EditorialButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!canSubmit}
                  icon={
                    submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    )
                  }
                >
                  {submitting ? "Sender …" : "Send forespørsel"}
                </EditorialButton>
                <p className="text-xs text-ink-faint leading-relaxed">
                  Vi følger{" "}
                  <Link
                    to="/personvern"
                    className="underline underline-offset-2 decoration-[0.5px] hover:text-ink"
                  >
                    personvernerklæringen
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </EditorialCard>
      </div>
    </div>
  );
}
