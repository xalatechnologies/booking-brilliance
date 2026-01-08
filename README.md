# Digilist - Kommunal Bookingplattform

En moderne SaaS-løsning for booking av kommunale anlegg og ressurser i Norge.

## Om prosjektet

Digilist er en komplett plattform som digitaliserer og effektiviserer booking av kommunale anlegg som idrettshaller, møterom, kulturhus og andre ressurser. Løsningen håndterer hele verdikjeden fra publisering av ledige tider, gjennom bookingprosess med betaling, til rapportering og etterlevelse av norske lover og forskrifter.

### Hovedfunksjoner

- **6 anleggstyper** - Støtter alt fra rom og haller til kjøretøy og utstyr
- **6 booking-modeller** - Fleksibel booking tilpasset ulike bruksområder
- **Integrert betaling** - Vipps, Klarna og faktura
- **Automatisk godkjenning** - Regelbaserte godkjenningsflyter
- **GDPR-klar** - Full etterlevelse av personvernregler
- **Universelt utformet** - WCAG 2.1 AA standard

## Teknologistack

### Frontend
- React 19 med React Router 7
- TypeScript 5.x (strict mode)
- Tailwind CSS for styling
- Shadcn/ui komponenter

### Backend
- Fastify 5.x API server
- Node.js 20 LTS
- PostgreSQL 16 database
- Drizzle ORM
- Redis for caching
- BullMQ for bakgrunnsjobber

### Integrasjoner
- **ID-porten** - BankID/MinID autentisering
- **Vipps** - Mobilbetaling
- **BRREG** - Organisasjonsverifisering
- **RCO** - Låskodegenerering
- **Visma** - Økonomisystemer

## Komme i gang

### Forutsetninger

- Node.js 20.x eller nyere
- pnpm (anbefalt) eller npm
- PostgreSQL 16
- Redis 7.x

### Installasjon

```bash
# Klon repositoryet
git clone <repository-url>
cd booking-brilliance

# Installer avhengigheter
pnpm install

# Konfigurer miljøvariabler
cp .env.example .env
# Rediger .env med dine verdier

# Start utviklingsserver
pnpm dev
```

Applikasjonen vil være tilgjengelig på `http://localhost:8080`

### Bygging for produksjon

```bash
# Bygg alle applikasjoner
pnpm build

# Forhåndsvis produksjonsbygg
pnpm preview
```

## Prosjektstruktur

```
booking-brilliance/
├── src/
│   ├── components/        # React komponenter
│   ├── pages/            # Side-komponenter
│   ├── types/            # TypeScript types
│   ├── integrations/     # Supabase og andre integrasjoner
│   └── lib/              # Hjelpefunksjoner
├── public/               # Statiske filer
└── supabase/            # Supabase edge functions
```

## Utviklet av

**Xala Technologies AS**  
Nesbruveien 75, 1394 Nesbru  
Telefon: +47 96 66 50 01  
E-post: info@xala.no  
Web: [xala.no](https://xala.no)

## Lisens

© 2024-2026 Digilist. Alle rettigheter forbeholdt.

---

For spørsmål eller support, kontakt oss på kontakt@digilist.no
