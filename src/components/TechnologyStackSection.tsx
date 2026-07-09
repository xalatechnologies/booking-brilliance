import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  Database,
  RefreshCw,
  ScrollText,
  Lock,
  Eye,
  Users,
  FileCheck,
  Building2,
  Layers,
  Server,
  ShieldCheck,
} from "lucide-react";
import {
  SectionRule,
  EditorialHeading,
  EditorialCard,
  SpecRow,
} from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const stacks = [
  {
    id: "01",
    Icon: Layers,
    category: "Frontend",
    tagline:
      "Reaktivt React-grensesnitt med Digdir Designsystemet og tilgjengelig komponentbibliotek.",
    items: [
      { name: "React", value: "19" },
      { name: "React Router", value: "7" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Tailwind CSS", value: "3.x" },
      { name: "Vite", value: "5.x" },
      { name: "Digdir Designsystemet", value: "latest" },
      { name: "Framer Motion", value: "11.x" },
      { name: "React Native", value: "0.74 (mobil)" },
    ],
  },
  {
    id: "02",
    Icon: Server,
    category: "Backend",
    tagline:
      "Reaktiv runtime med transaksjonell hendelseslogg, RBAC og auditspor på hver mutasjon.",
    items: [
      { name: "Convex", value: "self-hosted" },
      { name: "Node.js", value: "20 LTS" },
      { name: "TypeScript", value: "5.x strict" },
      { name: "Zod", value: "skjemavalidering" },
      { name: "Outbox event bus", value: "transaksjonell" },
      { name: "Audit log", value: "per mutasjon" },
      { name: "RBAC", value: "5-nivå hierarki" },
      { name: "Cron + scheduler", value: "22 jobber" },
    ],
  },
  {
    id: "03",
    Icon: Database,
    category: "Data & integrasjon",
    tagline:
      "PostgreSQL i EU, sanntid via Convex, integrasjoner mot Vipps, BankID og regnskap.",
    items: [
      { name: "PostgreSQL", value: "16" },
      { name: "Datalokasjon", value: "Norge / EU" },
      { name: "Backup", value: "RPO 15 min" },
      { name: "Vipps + Stripe Connect", value: "betaling" },
      { name: "BankID + ID-porten", value: "innlogging" },
      { name: "EHF / Peppol", value: "fakturering" },
      { name: "Regnskap (Visma · Tripletex · Fiken · …)", value: "6 leverandører" },
      { name: "Salto KS digital nøkkel", value: "adgang" },
    ],
  },
  {
    id: "04",
    Icon: ShieldCheck,
    category: "Sikkerhet & etterlevelse",
    tagline:
      "Bygget for norske krav — ISO-sertifisert, GDPR-kompatibel, WCAG-testet og pentestet årlig.",
    items: [
      { name: "ISO 27001", value: "sertifisert" },
      { name: "ISO 27701", value: "sertifisert" },
      { name: "GDPR", value: "kompatibel" },
      { name: "WCAG 2.1 AA", value: "implementert" },
      { name: "TLS 1.3 + AES-256-GCM", value: "påkrevd" },
      { name: "Penetrasjonstest", value: "årlig (3.-part)" },
      { name: "OWASP Top 10", value: "mitigering" },
      { name: "Step-up MFA", value: "sensitive ops" },
    ],
  },
];

const reliabilityPillars = [
  {
    Icon: Activity,
    eyebrow: "Overvåking",
    title: "24/7 driftsovervåking",
    body:
      "Helsesjekker hvert 30. sekund. Avvik som overskrider terskel sender automatisk varsel til vakt — på SMS, e-post og dashbord. Statusside oppdateres uten manuell innsats.",
    spec: [
      { label: "Sjekkfrekvens", value: "30 s" },
      { label: "Alarm kanaler", value: "SMS · e-post · Slack" },
    ],
  },
  {
    Icon: Database,
    eyebrow: "Backup",
    title: "Backup hvert 15. minutt",
    body:
      "Point-in-time recovery med 35 dagers oppbevaring. Backup ligger i samme EU-region som primær. Restoreøvelse hvert kvartal med dokumentert prosedyre.",
    spec: [
      { label: "RPO", value: "15 min" },
      { label: "RTO", value: "≤ 4 t" },
    ],
  },
  {
    Icon: RefreshCw,
    eyebrow: "Failover",
    title: "Multi-sone redundans",
    body:
      "Drift kjører i to soner i samme EU-region. Failover er automatisk og uten varsel ved infrastruktursvikt. Ingen data forlater EØS.",
    spec: [
      { label: "Soner", value: "2 × EU" },
      { label: "DNS TTL", value: "60 s" },
    ],
  },
  {
    Icon: Shield,
    eyebrow: "Sikkerhet",
    title: "Defense-in-depth",
    body:
      "WAF, rate-limit, RBAC, audit, kryptert databasekolonner og step-up-autentisering for sensitive operasjoner. Penetrasjonstest minst årlig av tredjepart.",
    spec: [
      { label: "Pentest", value: "årlig (3.-part)" },
      { label: "Hemmeligheter", value: "AES-256-GCM + AAD" },
    ],
  },
  {
    Icon: ScrollText,
    eyebrow: "Revisjon",
    title: "Audit-spor på hver mutasjon",
    body:
      "Hver booking, godkjenning, prisendring og slettehandling skrives uforanderlig til audit-loggen. Eksport til kommunens systemer ved kontroll.",
    spec: [
      { label: "Logg-retensjon", value: "7 år" },
      { label: "Eksport", value: "JSON · CSV" },
    ],
  },
  {
    Icon: Lock,
    eyebrow: "Datalokasjon",
    title: "Lagret i Norge og EU",
    body:
      "Alle persondata og forretningsdata ligger i EU. Ingen kryssjurisdiksjon, ingen amerikansk CLOUD Act-eksponering. Standard databehandleravtale inkludert.",
    spec: [
      { label: "Datalokasjon", value: "EU · NO" },
      { label: "Underleverandører", value: "EØS-godkjente" },
    ],
  },
];

const complianceGroups = [
  {
    Icon: Eye,
    eyebrow: "Universell utforming",
    title: "WCAG 2.1 AA",
    body: "Pliktig etter Likestillings- og diskrimineringsloven § 17a og forskrift om universell utforming av IKT.",
    items: [
      { label: "WCAG 2.1 AA", status: "Implementert" },
      { label: "WCAG 2.2 AA-kriterier", status: "Pågående" },
      { label: "Tilgjengelighetserklæring (Digdir)", status: "Publisert" },
      { label: "Axe-core automatiserte tester", status: "Per deploy" },
      { label: "Skjermleser-testing (NVDA, VoiceOver)", status: "Manuell QA" },
      { label: "Tastaturnavigasjon", status: "Fullstendig" },
    ],
  },
  {
    Icon: Lock,
    eyebrow: "Informasjonssikkerhet",
    title: "ISO 27001 + OWASP",
    body: "Sertifisert informasjonssikkerhetsstyring med årlig tredjepartsrevisjon og kontinuerlig penetrasjonstesting.",
    items: [
      { label: "ISO 27001 sertifisert", status: "Aktiv" },
      { label: "OWASP Top 10-mitigering", status: "Implementert" },
      { label: "Penetrasjonstest (3.-part)", status: "Årlig" },
      { label: "TLS 1.3 + AES-256-GCM", status: "Påkrevd" },
      { label: "Step-up autentisering", status: "Implementert" },
      { label: "Rate limiting + WAF", status: "Aktiv" },
    ],
  },
  {
    Icon: Users,
    eyebrow: "Personvern",
    title: "GDPR + ISO 27701",
    body: "Personvernforordningen, ISO 27701-sertifisering, standard databehandleravtale og dokumentert behandlingsregister.",
    items: [
      { label: "ISO 27701 sertifisert", status: "Aktiv" },
      { label: "GDPR-kompatibel", status: "Verifisert" },
      { label: "DPIA per modul", status: "Dokumentert" },
      { label: "Rett til sletting + innsyn", status: "Implementert" },
      { label: "Databehandleravtale (DPA)", status: "Standard" },
      { label: "Datalokasjon EU/Norge", status: "Garantert" },
    ],
  },
  {
    Icon: Building2,
    eyebrow: "Offentlig sektor",
    title: "DigDir + Anskaffelse",
    body: "Bygget for norsk forvaltning — ID-porten, Altinn, EHF, BRREG og SSA-L 2026-kontraktsmal.",
    items: [
      { label: "ID-porten / BankID (eIDAS)", status: "Implementert" },
      { label: "EHF / Peppol-fakturering", status: "Implementert" },
      { label: "BRREG-verifisering", status: "Aktiv" },
      { label: "Digdir Designsystemet", status: "Brukes" },
      { label: "Arkivverdig hendelseslogg", status: "Innebygd" },
      { label: "SSA-L 2026-bilag", status: "Klar" },
    ],
  },
];

const slaStats = [
  { value: "99,9", unit: "%", label: "Oppetid SLA" },
  { value: "<200", unit: "ms", label: "API p95" },
  { value: "15", unit: "min", label: "RPO backup" },
  { value: "≤4", unit: "t", label: "RTO gjenoppretting" },
  { value: "AA", unit: "", label: "WCAG 2.0" },
  { value: "100", unit: "%", label: "TypeScript strict" },
];

const TechnologyStackSection = () => {
  return (
    <section id="teknologi" className="py-14 lg:py-20 bg-paper-deep/40">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="VI. TEKNOLOGI" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Bygget for{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings:
                    '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                pålitelighet.
              </em>
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Teknologivalg som er etterprøvbare i drift, dokumentasjon
              og kontrakt.
            </p>
          </div>
        </div>

        {/* Six reliability pillars — render eagerly to avoid empty viewport */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule mb-16 lg:mb-20">
          {reliabilityPillars.map(({ Icon, eyebrow, title, body, spec }) => (
            <article
              key={title}
              className="group bg-paper p-7 lg:p-9 flex flex-col h-full transition-colors duration-quick ease-editorial hover:bg-paper-deep/40"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center justify-center w-9 h-9 border border-hairline-strong rounded-sm text-accent-text">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="editorial-mono-caption text-accent-text">
                  {eyebrow}
                </span>
              </div>
              <h3
                className="font-serif text-2xl text-ink mb-3"
                style={{
                  fontVariationSettings: getFraunces("sub"),
                  lineHeight: 1.15,
                }}
              >
                {title}
              </h3>
              <p className="text-sm lg:text-base text-ink-soft leading-relaxed flex-1">
                {body}
              </p>
              <dl className="mt-6 pt-5 border-t border-rule space-y-2">
                {spec.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-3 editorial-mono-caption"
                  >
                    <dt className="text-ink-faint">{row.label}</dt>
                    <dd className="text-ink tabular-nums">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        {/* Editorial pull-quote — driftsprinsipp */}
        <figure
          aria-labelledby="driftsprinsipp"
          className="my-16 lg:my-24 relative isolate"
        >
          <span
            aria-hidden="true"
            className="absolute -top-6 lg:-top-10 left-4 lg:left-10 font-serif text-[10rem] lg:text-[16rem] leading-none text-accent-text/15 select-none pointer-events-none"
            style={{
              fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 60',
            }}
          >
            &ldquo;
          </span>
          <div className="rule-h bg-rule" />
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-16">
            <div className="lg:col-span-2 hidden lg:flex items-start">
              <span className="editorial-mono-caption text-accent-text">
                DRIFTSPRINSIPP
              </span>
            </div>
            <div className="lg:col-span-9">
              <blockquote
                id="driftsprinsipp"
                className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-[3.5rem] text-ink leading-[1.18]"
                style={{
                  fontVariationSettings:
                    '"opsz" 96, "wght" 380, "SOFT" 40, "WONK" 0',
                  letterSpacing: "-0.018em",
                }}
              >
                Hver teknologi plattformen bygger på må kunne{" "}
                <em className="italic">dokumenteres</em>,{" "}
                <em className="italic">sertifiseres</em> og{" "}
                <em className="italic">forsvares</em>.{" "}
                <span className="font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight">
                  Postgres
                </span>{" "}
                for data,{" "}
                <span className="font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight">
                  Convex
                </span>{" "}
                for sanntid,{" "}
                <span className="font-mono text-2xl md:text-3xl lg:text-4xl text-accent-text tracking-tight">
                  ID-porten
                </span>{" "}
                for innbyggertilgang — valg som holder gjennom drift,
                revisjon og kontrakt.
              </blockquote>
              <figcaption className="mt-8 lg:mt-10 flex items-center gap-3 editorial-mono-caption">
                <span className="inline-block w-8 h-px bg-accent-text" />
                <span className="text-ink">Ibrahim Rahmani</span>
                <span className="text-ink-faint">·</span>
                <span className="text-ink-faint">CTO, Xala Technologies</span>
              </figcaption>
            </div>
          </div>
          <div className="rule-h bg-rule" />
        </figure>

        {/* Regulatory + compliance grid */}
        <div className="mb-16 lg:mb-20">
          <div className="flex items-baseline justify-between mb-6 lg:mb-8 border-b border-rule pb-3">
            <span className="editorial-mono-caption text-accent-text">
              KRAV · SAMSVAR · SERTIFISERINGER
            </span>
            <span className="editorial-mono-caption text-ink-faint">
              REV. 2026.05
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
            <div className="lg:col-span-7">
              <h3
                className="font-serif text-3xl lg:text-5xl text-ink"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.08,
                }}
              >
                Krav vi{" "}
                <em
                  className="italic"
                  style={{
                    fontVariationSettings:
                      '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                  }}
                >
                  oppfyller
                </em>
                .
              </h3>
            </div>
            <div className="lg:col-span-5 flex items-end">
              <p className="text-base lg:text-lg text-ink-soft measure leading-relaxed">
                Plattformen oppfyller norsk og europeisk regelverk for offentlig
                sektor — universell utforming, informasjonssikkerhet, personvern
                og digital forvaltning. Hver kategori er dokumentert og kan
                etterprøves i tilbudsfasen.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
            {complianceGroups.map(({ Icon, eyebrow, title, body, items }) => (
              <article
                key={title}
                className="bg-paper p-7 lg:p-10 flex flex-col"
              >
                <header className="mb-6 pb-5 border-b border-rule">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-accent-text">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="editorial-mono-caption text-accent-text">
                      {eyebrow}
                    </span>
                  </div>
                  <h4
                    className="font-serif text-2xl lg:text-3xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      lineHeight: 1.15,
                    }}
                  >
                    {title}
                  </h4>
                  <p className="text-sm lg:text-base text-ink-soft leading-relaxed measure">
                    {body}
                  </p>
                </header>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-baseline justify-between gap-3 py-1 border-b border-rule/40"
                    >
                      <span className="flex items-baseline gap-2 text-sm lg:text-base text-ink">
                        <FileCheck
                          className="h-3.5 w-3.5 text-accent-text translate-y-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </span>
                      <span className="editorial-mono-caption text-ink-faint whitespace-nowrap">
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-6 editorial-mono-caption text-ink-faint">
            Sertifikater og revisjonsrapporter utleveres ved tilbudsforespørsel
            under NDA.
          </p>
        </div>

        {/* Stack tables — four pillars */}
        <div className="mb-16 lg:mb-20">
          <div className="flex items-baseline justify-between mb-6 lg:mb-8 border-b border-rule pb-3">
            <span className="editorial-mono-caption text-accent-text">
              TEKNOLOGISTABEL · FULL OVERSIKT
            </span>
            <span className="editorial-mono-caption text-ink-faint">
              {stacks.reduce((sum, s) => sum + s.items.length, 0)} VALG
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
            {stacks.map((s) => {
              const Icon = s.Icon;
              return (
                <article
                  key={s.category}
                  className="group relative bg-paper p-7 lg:p-10 flex flex-col transition-colors duration-quick ease-editorial hover:bg-paper-deep/40"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-px bg-accent-text scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-normal ease-editorial"
                  />
                  <header className="mb-6 pb-5 border-b border-rule">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-mono text-xs text-ink-faint tracking-widest tabular-nums">
                        {s.id} / 04
                      </span>
                      <span className="editorial-mono-caption text-ink-faint">
                        {s.items.length} valg
                      </span>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3
                        className="font-serif text-2xl lg:text-3xl text-ink"
                        style={{
                          fontVariationSettings: getFraunces("section"),
                          letterSpacing: "-0.015em",
                          lineHeight: 1.1,
                        }}
                      >
                        {s.category}
                      </h3>
                    </div>
                    <p className="text-sm lg:text-base text-ink-soft leading-relaxed measure">
                      {s.tagline}
                    </p>
                  </header>
                  <dl className="space-y-2.5">
                    {s.items.map((it) => (
                      <div
                        key={it.name}
                        className="flex items-baseline gap-3 py-1.5 border-b border-rule/50 last:border-b-0"
                      >
                        <dt className="shrink-0 font-mono text-xs uppercase tracking-widest text-ink-faint">
                          {it.name}
                        </dt>
                        <span
                          aria-hidden="true"
                          className="flex-1 border-b border-dotted border-rule translate-y-[-3px]"
                        />
                        <dd className="shrink-0 font-mono text-sm text-accent-text tabular-nums whitespace-nowrap">
                          {it.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>

        {/* SLA stat ribbon */}
        <div>
          <div className="flex items-baseline justify-between mb-5 border-b border-rule pb-3">
            <span className="editorial-mono-caption text-accent-text">
              KLAUSULER · MÅLBARE
            </span>
            <span className="editorial-mono-caption text-ink-faint">
              SLA 2026.05
            </span>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-rule border border-rule overflow-hidden"
          >
            {slaStats.map((s) => (
              <motion.div
                key={s.label}
                variants={staggerChild}
                className="group relative bg-paper px-5 lg:px-6 py-9 lg:py-12 flex flex-col items-start gap-4 transition-colors duration-quick ease-editorial hover:bg-paper-deep/50"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-0 bg-accent-text group-hover:w-full transition-[width] duration-slow ease-editorial"
                />
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span
                    className="font-serif text-4xl lg:text-5xl xl:text-6xl text-accent-text tabular-nums"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.03em",
                      lineHeight: 0.95,
                    }}
                  >
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="font-mono text-base lg:text-lg text-ink-faint">
                      {s.unit}
                    </span>
                  )}
                </div>
                <span className="editorial-mono-caption text-ink-faint">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyStackSection;
