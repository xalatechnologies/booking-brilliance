import { ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { CategoryVisual } from "@/components/CategoryVisual";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";
import TechnologyStackSection from "@/components/TechnologyStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import IntegrationsSection from "@/components/IntegrationsSection";

const APP = "https://app.digilist.no";

// The /teknologi FAQ. Single source of truth for this page's visible accordion
// AND its FAQPage JSON-LD (passed to <SEO faq>). Keep byte-for-byte in sync
// with the /teknologi route `faq` array in scripts/prerender.mjs — that copy is
// what crawlers index, and Google requires the visible text to match the markup.
const TEKNOLOGI_FAQ: FAQItem[] = [
  {
    q: "Hvilken teknologi er Digilist bygget på?",
    a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten.",
  },
  {
    q: "Hvilke integrasjoner støttes?",
    a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking.",
  },
  {
    q: "Hvor lagres dataene?",
    a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier.",
  },
  {
    q: "Er Digilist ISO 27001 og 27701-sertifisert?",
    a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel.",
  },
  {
    q: "Oppfyller Digilist WCAG 2.0 AA?",
    a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal.",
  },
  {
    q: "Hvor høy oppetid garanterer Digilist?",
    a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig.",
  },
];

export default function Teknologi() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Teknologi og sikkerhet: stack, arkitektur og samsvar | Digilist"
        description="Teknologien bak Digilist: React 19, Convex reaktiv runtime, PostgreSQL 16 i Norge og EU, ISO 27001/27701, GDPR, WCAG 2.1 AA, ID-porten, EHF/Peppol og norske integrasjoner."
        keywords="digilist teknologi, bookingsystem arkitektur, convex, postgresql, iso 27001, gdpr, wcag, id-porten, ehf peppol, datalagring norge, sikkerhet bookingsystem"
        canonical="https://digilist.no/teknologi"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Teknologi", url: "https://digilist.no/teknologi" },
        ]}
        service
        faq={TEKNOLOGI_FAQ.map((e) => ({ question: e.q, answer: e.a }))}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="PLATTFORM · SIKKERHET · SAMSVAR" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Teknologien{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      under Digilist
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    En reaktiv runtime, norsk og europeisk datalagring, og
                    samsvar bygget inn fra grunnen: ISO 27001/27701, GDPR og
                    universell utforming. Her er stacken, arkitekturen og
                    integrasjonene som driver plattformen.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Åpne plattformen
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={ShieldCheck}
                    label="ISO 27001 · GDPR · WCAG 2.1 AA"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Relocated platform content — the same sections, now on a focused,
              indexable URL instead of buried in the homepage scroll. */}
          <TechnologyStackSection />
          <ArchitectureSection />
          <IntegrationsSection />

          {/* FAQ — visible copy mirrors the FAQPage schema above */}
          <section
            id="faq"
            aria-labelledby="teknologi-faq-heading"
            className="py-16 lg:py-24 bg-paper border-t border-rule"
          >
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="OFTE STILTE SPØRSMÅL" />
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14 items-end">
                <div className="lg:col-span-7">
                  <EditorialHeading
                    as="h2"
                    size="section"
                    id="teknologi-faq-heading"
                  >
                    Teknologi og{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      samsvar
                    </em>
                    .
                  </EditorialHeading>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-6 lg:items-end">
                  <p className="text-lg text-ink-soft leading-relaxed lg:text-right">
                    Stack, datalagring, sertifiseringer og oppetid: svar på det
                    tekniske kjøpere og saksbehandlere spør om.
                  </p>
                  <EditorialButton variant="link" size="md" href="/faq">
                    Se alle spørsmål
                  </EditorialButton>
                </div>
              </div>
              <FAQAccordion items={TEKNOLOGI_FAQ} />
            </div>
          </section>

          {/* Closing CTA */}
          <section className="pb-20 lg:pb-28 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <EditorialCard className="bg-paper-deep/40">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
                  <div className="lg:col-span-8">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      Vil du se det under panseret?
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Book en demo, så går vi gjennom arkitektur, datalagring,
                      samsvarsdokumentasjon og integrasjonene som er relevante
                      for ditt oppsett.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
