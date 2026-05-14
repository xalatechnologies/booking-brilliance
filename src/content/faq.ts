/**
 * Source-of-truth FAQ content for Digilist.
 * Used by:
 *   1. /faq page — SEO + GEO landing with FAQPage JSON-LD
 *   2. Landing-page FAQ JSON-LD (subset)
 *   3. /llms.txt + /llms-full.txt static assets
 *   4. Chatbot RAG corpus (each entry is one retrievable chunk)
 *
 * Edit here, run `pnpm build`, deploy — all surfaces stay in sync.
 */

export interface FAQCategory {
  id: string;
  label: string;
  description: string;
  questions: Array<{
    q: string;
    a: string;
    keywords?: string[];
  }>;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "produkt",
    label: "Om Digilist",
    description: "Hva Digilist er, hvem som bruker det, og hva som skiller plattformen fra alternativene.",
    questions: [
      {
        q: "Hva er Digilist?",
        a: "Digilist er en norsk digital plattform for utleie og booking av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie, fakturering og rapportering i én løsning — bygget for både private utleiere og norske kommuner.",
        keywords: ["digilist", "hva er", "bookingplattform"],
      },
      {
        q: "Hvem står bak Digilist?",
        a: "Digilist er utviklet av Xala Technologies AS, et norsk teknologiselskap basert i Nesbruveien 75, 1394 Nesbru. Selskapet utvikler digitale løsninger for offentlig sektor og næringsliv i Norge.",
        keywords: ["xala", "leverandør", "selskap"],
      },
      {
        q: "Hvilke organisasjoner bruker Digilist i dag?",
        a: "Digilist brukes blant andre av Nordre Follo kommune (12 anlegg, ~340 lag og foreninger, ~1 200 bookinger/mnd), Rønningen Selskapslokale (Asker), Lier Bygdetun og RightSize Group (Nesbru). Plattformen håndterer både offentlige og private utleiere.",
        keywords: ["kunder", "referanser", "nordre follo", "rønningen"],
      },
      {
        q: "Hva skiller Digilist fra andre bookingsystemer?",
        a: "Digilist er bygget for norske krav fra grunnen — Vipps, BankID, ID-porten, EHF/Peppol, BRREG og Digdir Designsystemet er innebygd. Én plattform håndterer både privat utleie og kommunal drift. Convex' reaktive runtime gir sanntid uten polling, og all data lagres i Norge og EU.",
        keywords: ["differensiering", "konkurrenter", "fordeler"],
      },
    ],
  },
  {
    id: "funksjonalitet",
    label: "Funksjonalitet",
    description: "Hva plattformen kan gjøre — fra booking og betaling til sesongleie og rapportering.",
    questions: [
      {
        q: "Hvilke betalingsmetoder støtter Digilist?",
        a: "Digilist støtter Vipps (mobil + web), kortbetaling via Stripe Connect (Express), depositum, fakturering og EHF/Peppol for offentlig fakturering. Refusjonsregler kan tilpasses per anlegg og brukergruppe.",
        keywords: ["betaling", "vipps", "stripe", "ehf"],
      },
      {
        q: "Støtter Digilist sanntidstilgjengelighet?",
        a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart for alle brukere — drevet av Convex' reaktive runtime, ingen polling eller refresh nødvendig.",
        keywords: ["sanntid", "kalender", "real-time"],
      },
      {
        q: "Hvordan håndteres sesongleie for lag og foreninger?",
        a: "Digilist har en egen sesongleie-modul med søknadsportal for lag og foreninger, BRREG-verifisering av organisasjoner, regelstyrt fordelingsforslag basert på kommunens prioriteringsregler, saksbehandlerverktøy for justering og automatisk varsling. Tilskudd og kapasitetsutnyttelse rapporteres automatisk.",
        keywords: ["sesongleie", "lag", "foreninger", "fordeling"],
      },
      {
        q: "Hva er forskjellen på auto-godkjenning og manuell godkjenning?",
        a: "Auto-godkjenning bekrefter bookinger umiddelbart basert på regler (lave verdier, korte bookinger, verifiserte brukere). Manuell godkjenning sender bookinger til saksbehandler-kø for kontroll. Begge moduser kan kombineres — auto for hovedtidsperiode, manuell for unntak.",
        keywords: ["godkjenning", "automatisk", "manuell"],
      },
      {
        q: "Støtter Digilist digital nøkkel og adgangskontroll?",
        a: "Ja. Salto KS digital nøkkel er integrert. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt. Vaktmestere og driftsroller varsles automatisk om aktive bookinger.",
        keywords: ["digital nøkkel", "salto", "adgang"],
      },
      {
        q: "Hvordan varsles vaktmestere og driftspersonell?",
        a: "Når en booking bekreftes, sendes automatiske varsler til vaktmester, renholdspersonell, vekter og andre relevante driftsroller — via e-post, SMS eller varsler i Digilist-appen. Varslene tilpasses per anlegg.",
        keywords: ["varsling", "drift", "vaktmester"],
      },
    ],
  },
  {
    id: "kommune",
    label: "For kommuner",
    description: "SSA-L 2026, anskaffelse, sesongleie og hvordan kommunen kan starte en pilot.",
    questions: [
      {
        q: "Oppfyller Digilist SSA-L 2026-kravene?",
        a: "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering.",
        keywords: ["ssa-l", "anskaffelse", "krav"],
      },
      {
        q: "Kan kommunen importere bookinger fra eksisterende system?",
        a: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi tar over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen.",
        keywords: ["migrasjon", "rco", "import"],
      },
      {
        q: "Hva er pilotprogrammet for kommuner?",
        a: "Vi tilbyr norske kommuner en gratis pilotfase hvor Digilist hjelper med oppsett og publisering av kommunale lokaler og anlegg. Kommunen får egen administrativ tilgang. Målet er ikke å erstatte eksisterende prosesser, men å utforske hvordan Digilist kan supplere kommunens digitale tjenester.",
        keywords: ["pilot", "gratis", "start"],
      },
      {
        q: "Hvor lang tid tar implementeringen for en kommune?",
        a: "En typisk kommunal etableringsfase tar 6–12 uker, avhengig av antall anlegg og kompleksiteten av eksisterende data. Pilotopplegg kan komme i gang på under to uker. Detaljert tidslinje finnes i Bilag 3 for SSA-L-anskaffelser.",
        keywords: ["implementering", "tidslinje", "etablering"],
      },
      {
        q: "Hvilke kommunale anleggstyper støttes?",
        a: "Idrettshaller, svømmehaller, gymsaler, fotballbaner, møterom, kantiner, kulturhus, samfunnshus, kjøretøy, AV-utstyr og ressurser. Hver anleggstype kan ha egne regler for kapasitet, prising og brukergrupper.",
        keywords: ["anlegg", "idrettshall", "møterom", "kulturhus"],
      },
    ],
  },
  {
    id: "samsvar",
    label: "Samsvar og sikkerhet",
    description: "GDPR, ISO 27001, datalokasjon og hvordan kommunens persondata behandles.",
    questions: [
      {
        q: "Er Digilist GDPR-kompatibel?",
        a: "Ja. Digilist er GDPR-kompatibel og leverer standard databehandleravtale (DPA) før kontraktsinngåelse. Plattformen har dataregister, rett til sletting, audit-logg og prosedyrer for sikkerhetsbrudd og innsynsbegjæringer.",
        keywords: ["gdpr", "personvern"],
      },
      {
        q: "Hvor lagres dataene?",
        a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier.",
        keywords: ["datalokasjon", "norge", "eu"],
      },
      {
        q: "Er Digilist ISO 27001 og 27701-sertifisert?",
        a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel.",
        keywords: ["iso", "27001", "27701", "sertifisering"],
      },
      {
        q: "Oppfyller Digilist WCAG 2.0 AA?",
        a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal.",
        keywords: ["wcag", "universell utforming", "tilgjengelighet"],
      },
      {
        q: "Hva inneholder audit-loggen?",
        a: "Hver mutasjon i systemet — bookinger, godkjenninger, endringer, slettinger, brukerhandlinger — registreres med tidsstempel, brukerident og endringsdetaljer. Loggen er uforanderlig og kan eksporteres til kommunens systemer ved revisjon.",
        keywords: ["audit", "logg", "revisjon"],
      },
    ],
  },
  {
    id: "teknologi",
    label: "Teknologi",
    description: "Stack, arkitektur, integrasjoner og hvordan plattformen er bygget.",
    questions: [
      {
        q: "Hvilken teknologi er Digilist bygget på?",
        a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten.",
        keywords: ["stack", "teknologi", "react", "convex"],
      },
      {
        q: "Hvilke integrasjoner støttes?",
        a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking.",
        keywords: ["integrasjoner", "tredjepart"],
      },
      {
        q: "Har Digilist åpne API-er?",
        a: "Ja. Digilist tilbyr REST- og webhook-API-er for bookinger, brukere, betaling og integrasjon med eksisterende kommunale systemer. API-dokumentasjon er tilgjengelig for kunder og potensielle kunder under signert NDA.",
        keywords: ["api", "integrasjon", "webhook"],
      },
      {
        q: "Hvor høy oppetid garanterer Digilist?",
        a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig.",
        keywords: ["oppetid", "sla", "uptime"],
      },
      {
        q: "Hvor rask er plattformen?",
        a: "API-respons under 200 ms i 95-persentilen. Sanntid-oppdateringer leveres som push fra Convex' reaktive runtime, ikke polling. Frontend laster mindre enn 300 kB gzip og Lighthouse-scoring er 90+ på alle parametere.",
        keywords: ["ytelse", "hastighet", "performance"],
      },
    ],
  },
  {
    id: "priser",
    label: "Priser og kontrakter",
    description: "Hva Digilist koster, hvordan vi prises og hvilke kontraktsformer som er tilgjengelige.",
    questions: [
      {
        q: "Hva koster Digilist?",
        a: "Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tilbyr en gratis demo og pristilbud basert på kommunens eller bedriftens spesifikke behov. For kommuner i pilotfase er bruken gratis i prøveperioden.",
        keywords: ["pris", "kostnad"],
      },
      {
        q: "Er det kostnader knyttet til integrasjoner?",
        a: "Standardintegrasjoner (Vipps, BankID, ID-porten, EHF, Visma, Tripletex, Fiken, PowerOffice, Microsoft 365, Salto KS) er inkludert. Spesialtilpassede integrasjoner mot kommunens egne systemer prises separat etter omfang.",
        keywords: ["integrasjonspris", "tilkobling"],
      },
      {
        q: "Hva slags kontrakter tilbys?",
        a: "For offentlig sektor tilbyr vi SSA-L 2026-kontrakter med standard bilag (1–6). For privat sektor: månedlig eller årlig abonnement. Pilotperioder er alltid gratis og uforpliktende.",
        keywords: ["kontrakt", "ssa-l", "abonnement"],
      },
    ],
  },
  {
    id: "support",
    label: "Support og opplæring",
    description: "Hvordan vi hjelper deg i gang og holder plattformen i drift.",
    questions: [
      {
        q: "Hvilken support inkluderes?",
        a: "Telefon- og e-post-support i ordinære arbeidstider (08:00–17:00 norsk tid), kunnskapsbase, opplæringsmateriale og dedikert onboarding-konsulent i etableringsfasen. 24/7 driftsovervåking med automatisk alarmering.",
        keywords: ["support", "hjelp", "kundestøtte"],
      },
      {
        q: "Får vi opplæring av brukere og saksbehandlere?",
        a: "Ja. I etableringsfasen tilbys workshops for saksbehandlere, administratorer og driftsroller. Opplæringsmateriell (video, dokumentasjon) er tilgjengelig kontinuerlig. Vi tilbyr også løpende opplæring ved behov.",
        keywords: ["opplæring", "kurs", "workshop"],
      },
      {
        q: "Hvordan rapporteres feil og forbedringsforslag?",
        a: "Via support@digilist.no, statusside, eller direkte i administrasjonsverktøyet. Feilrettinger prioriteres etter alvorlighetsgrad (kritisk → høy → middels → lav). Forbedringsforslag samles i offentlig veikart hvor kommuner kan stemme.",
        keywords: ["feilmelding", "bug", "rapportering"],
      },
    ],
  },
];

export function allFAQEntries(): Array<{ q: string; a: string; category: string }> {
  return FAQ_CATEGORIES.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, category: cat.label })),
  );
}
