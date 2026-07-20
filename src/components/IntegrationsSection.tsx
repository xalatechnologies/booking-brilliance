import {
  SectionRule,
  EditorialHeading,
  IntegrationLogo,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

interface IntegrationRow {
  name: string;
  category: string;
  status: "AKTIV" | "PILOT" | "PLANLAGT";
  version?: string;
}

const integrations: IntegrationRow[] = [
  { name: "Vipps", category: "Betaling", status: "AKTIV", version: "mobile + web" },
  { name: "Stripe Connect", category: "Betaling", status: "AKTIV", version: "Express" },
  { name: "BankID", category: "Autentisering", status: "AKTIV", version: "Signicat" },
  { name: "ID-porten", category: "Autentisering", status: "AKTIV" },
  { name: "Altinn", category: "Offentlig", status: "AKTIV" },
  { name: "EHF / Peppol", category: "Fakturering", status: "AKTIV" },
  { name: "Visma eAccounting", category: "Regnskap", status: "AKTIV" },
  { name: "RCO booking", category: "Booking-import", status: "AKTIV", version: "migrasjon" },
  { name: "Tripletex", category: "Regnskap", status: "AKTIV" },
  { name: "Fiken", category: "Regnskap", status: "AKTIV" },
  { name: "PowerOffice", category: "Regnskap", status: "AKTIV" },
  { name: "DNB Regnskap", category: "Regnskap", status: "AKTIV" },
  { name: "Microsoft 365 / Outlook", category: "Kalender", status: "AKTIV" },
  { name: "Salto KS", category: "Adgangskontroll", status: "PILOT" },
  { name: "ISO 27001 & 27701", category: "Samsvar", status: "AKTIV" },
  { name: "GDPR", category: "Samsvar", status: "AKTIV" },
  { name: "WCAG 2.0 AA", category: "Universell utforming", status: "AKTIV" },
];

const IntegrationsSection = () => {
  return (
    <section
      id="integrasjoner"
      className="py-14 lg:py-20 bg-paper"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="INTEGRASJONER" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-16">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Tilkoblet det{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                norske
              </em>{" "}
              landskapet.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Betaling, autentisering, regnskap og samsvar, bygget for norske
              utleiere fra første dag.
            </p>
          </div>
        </div>

        <ul
          role="list"
          aria-label="Integrasjoner og samsvar"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule"
        >
          {integrations.map((row) => (
            <li
              key={row.name}
              className="bg-paper p-6 lg:p-7 flex items-start gap-5"
            >
              <IntegrationLogo brand={row.name} size="lg" iconOnly />
              <div className="min-w-0 flex-1">
                <h3
                  className="font-sans text-lg font-medium text-ink leading-tight truncate"
                  title={row.name}
                >
                  {row.name}
                </h3>
                <p className="mt-1 text-sm text-ink-soft leading-snug">
                  {row.category}
                  {row.version && (
                    <>
                      <span className="text-ink-faint"> · </span>
                      <span className="font-mono text-xs text-ink-faint">
                        {row.version}
                      </span>
                    </>
                  )}
                </p>
                <span
                  className={`mt-3 inline-block font-mono text-[0.7rem] tracking-widest ${
                    row.status === "AKTIV"
                      ? "text-accent-text"
                      : row.status === "PILOT"
                      ? "text-ochre"
                      : "text-ink-faint"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default IntegrationsSection;
