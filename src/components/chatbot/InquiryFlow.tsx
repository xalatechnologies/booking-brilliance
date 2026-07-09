import { useMemo, useState, FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";
import { PERSONA_OPTIONS, topicSuggestionsFor } from "@/lib/chatbot/inquiry";
import type { InquiryDraft, Mode, Persona } from "@/lib/chatbot/types";
import { getFraunces } from "@/lib/fonts";

interface Props {
  mode: Mode;
  draft: InquiryDraft;
  thinking: boolean;
  error: string | null;
  onSetPersona: (p: Persona) => void;
  onSetTopic: (topic: string) => void;
  onUpdate: (patch: Partial<InquiryDraft>) => void;
  onBack: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function InquiryFlow({
  mode,
  draft,
  thinking,
  error,
  onSetPersona,
  onSetTopic,
  onUpdate,
  onBack,
  onSubmit,
  onClose,
}: Props) {
  const topics = useMemo(
    () => topicSuggestionsFor(draft.persona),
    [draft.persona],
  );
  const [customTopic, setCustomTopic] = useState("");

  if (mode === "inquiry-success") {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-start gap-5">
        <span className="inline-flex items-center justify-center w-14 h-14 border border-hairline-strong rounded-sm text-accent-text">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h3
          className="font-serif text-2xl lg:text-3xl text-ink"
          style={{
            fontVariationSettings: getFraunces("sub"),
            letterSpacing: "-0.015em",
          }}
        >
          Takk, vi er på{" "}
          <em
            className="italic"
            style={{
              fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60',
            }}
          >
            saken.
          </em>
        </h3>
        <p className="text-base text-ink-soft leading-relaxed">
          Vi har mottatt forespørselen din og svarer normalt innen én
          arbeidsdag. Hold gjerne et øye med innboksen din.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 inline-flex items-center gap-2 border border-hairline-strong bg-paper px-4 py-2 rounded-sm text-sm text-ink hover:bg-paper-deep hover:border-ink transition-colors"
        >
          Lukk
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Header with step indicator + back */}
      <div className="flex items-baseline justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 editorial-mono-caption text-ink-faint hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Tilbake
        </button>
        <span className="editorial-mono-caption text-accent-text">
          {mode === "inquiry-persona"
            ? "STEG 1 / 3"
            : mode === "inquiry-topic"
              ? "STEG 2 / 3"
              : "STEG 3 / 3"}
        </span>
      </div>

      {/* Step 1: Persona */}
      {mode === "inquiry-persona" && (
        <fieldset className="flex flex-col gap-4">
          <legend
            className="font-serif text-2xl lg:text-3xl text-ink mb-3"
            style={{
              fontVariationSettings: getFraunces("sub"),
              letterSpacing: "-0.015em",
            }}
          >
            Hvem{" "}
            <em
              className="italic"
              style={{
                fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60',
              }}
            >
              spør
            </em>
            ?
          </legend>
          <div className="grid gap-3">
            {PERSONA_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onSetPersona(p.value)}
                className="group flex items-center justify-between text-left border border-hairline-strong bg-paper p-4 rounded-sm hover:bg-paper-deep hover:border-ink transition-colors"
              >
                <div>
                  <div
                    className="font-serif text-lg text-ink"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                    }}
                  >
                    {p.label}
                  </div>
                  <div className="text-xs text-ink-faint mt-0.5">
                    {p.hint}
                  </div>
                </div>
                <ArrowRight
                  className="h-4 w-4 text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Step 2: Topic */}
      {mode === "inquiry-topic" && (
        <div className="flex flex-col gap-4">
          <h3
            className="font-serif text-2xl lg:text-3xl text-ink"
            style={{
              fontVariationSettings: getFraunces("sub"),
              letterSpacing: "-0.015em",
            }}
          >
            Hva trenger du{" "}
            <em
              className="italic"
              style={{
                fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60',
              }}
            >
              hjelp med
            </em>
            ?
          </h3>
          <div className="grid gap-2.5">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSetTopic(t)}
                className="group flex items-center justify-between text-left border border-hairline-strong bg-paper px-4 py-2.5 rounded-sm hover:bg-paper-deep hover:border-ink transition-colors"
              >
                <span className="text-sm lg:text-base text-ink">{t}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          <div className="border-t border-rule pt-4">
            <label
              htmlFor="chat-custom-topic"
              className="editorial-mono-caption text-ink-faint mb-2 block"
            >
              ELLER SKRIV DITT EGET
            </label>
            <div className="flex gap-2">
              <input
                id="chat-custom-topic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Hva trenger du hjelp med?"
                className="flex-1 border border-hairline-strong bg-paper px-3 py-2 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
              />
              <button
                type="button"
                disabled={!customTopic.trim()}
                onClick={() => onSetTopic(customTopic.trim())}
                className="inline-flex items-center justify-center px-3 py-2 bg-navy text-on-navy rounded-sm hover:bg-navy/90 transition-colors disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {mode === "inquiry-contact" && (
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
          noValidate
        >
          <h3
            className="font-serif text-2xl lg:text-3xl text-ink"
            style={{
              fontVariationSettings: getFraunces("sub"),
              letterSpacing: "-0.015em",
            }}
          >
            Hvor kan vi nå{" "}
            <em
              className="italic"
              style={{
                fontVariationSettings: '"opsz" 36, "wght" 420, "SOFT" 60',
              }}
            >
              deg
            </em>
            ?
          </h3>
          <p className="editorial-mono-caption text-ink-faint">
            {draft.persona === "kommune"
              ? "KOMMUNE-FORESPØRSEL"
              : draft.persona === "utleier"
                ? "UTLEIER-FORESPØRSEL"
                : "GENERELL FORESPØRSEL"}{" "}
            · {draft.topic}
          </p>

          <Field
            label="Organisasjon eller kommune"
            id="chat-org"
            required
            value={draft.organization}
            onChange={(v) => onUpdate({ organization: v })}
            placeholder={
              draft.persona === "kommune"
                ? "F.eks. Nordre Follo kommune"
                : "F.eks. Rønningen Selskapslokale"
            }
            autoComplete="organization"
          />
          <Field
            label="Navn"
            id="chat-name"
            required
            value={draft.name}
            onChange={(v) => onUpdate({ name: v })}
            autoComplete="name"
          />
          <Field
            label="E-post"
            id="chat-email"
            type="email"
            required
            value={draft.email}
            onChange={(v) => onUpdate({ email: v })}
            autoComplete="email"
          />
          <Field
            label="Telefon (valgfritt)"
            id="chat-phone"
            type="tel"
            value={draft.phone}
            onChange={(v) => onUpdate({ phone: v })}
            autoComplete="tel"
          />
          <div>
            <label
              htmlFor="chat-message"
              className="editorial-mono-caption text-ink-faint mb-1.5 block"
            >
              MELDING (VALGFRITT)
            </label>
            <textarea
              id="chat-message"
              rows={3}
              value={draft.message}
              onChange={(e) => onUpdate({ message: e.target.value })}
              placeholder="Detaljer om behov, tidslinje eller spørsmål…"
              className="w-full border border-hairline-strong bg-paper px-3 py-2 rounded-sm text-sm text-ink focus:outline-none focus:border-ink resize-y"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="border border-hairline-strong bg-paper-deep px-3 py-2 rounded-sm text-sm text-ink"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              thinking ||
              !draft.organization.trim() ||
              !draft.name.trim() ||
              !draft.email.trim()
            }
            className="inline-flex items-center justify-center gap-2 bg-navy text-on-navy px-5 py-3 rounded-sm font-serif text-base disabled:opacity-50"
            style={{ fontVariationSettings: getFraunces("sub") }}
          >
            {thinking ? (
              <span>Sender …</span>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>Send forespørsel</span>
              </>
            )}
          </button>
          <p className="editorial-mono-caption text-ink-faint">
            VED Å SENDE GODTAR DU{" "}
            <a
              href="/personvern"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              PERSONVERN­ERKLÆRINGEN
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="editorial-mono-caption text-ink-faint mb-1.5 block"
      >
        {label.toUpperCase()}
        {required && <span className="text-accent-text ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-hairline-strong bg-paper px-3 py-2 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
      />
    </div>
  );
}
