# /public/images — image asset catalog

Drop the source files here. Filenames below are referenced from React
components, so keep them exact. Editorial Nordic aesthetic — restrained,
documentary-style, Norwegian context.

## Format & sizing

- **Format:** WebP preferred, JPEG fallback acceptable. Use `.webp` extension.
- **Hero / full-bleed:** 2400 × 1600 (3:2), max 350 kB after compression.
- **Section / story:** 1600 × 1066 (3:2), max 200 kB.
- **Blog cover:** 1600 × 900 (16:9), max 200 kB.
- **Compression:** `cwebp -q 82 input.jpg -o output.webp` or Squoosh.
- **Color:** lean cool/desaturated, avoid stock-photo saturation. Crop tight.

## Required files

### Blog covers — `/images/blog/`

| Filename | Topic | Notes |
|---|---|---|
| `ssa-l-cover.webp` | SSA-L 2026 / kommunal anskaffelse | Kommunehus, idrettshall eller saksbehandler-arbeidsplass |
| `sesongleie-cover.webp` | Sesongleie til lag og foreninger | Idrettshall, ungdom i aktivitet, eller treningstid |
| `gdpr-iso-cover.webp` | Datalokasjon / GDPR / ISO 27001 | Norsk landskap, serverrom, eller dokumenter |

### Section visuals — `/images/sections/`

| Filename | Used in | Notes |
|---|---|---|
| `audience-kommune.webp` | AudienceSection | Norsk rådhus eller kommunal mottakelse |
| `audience-private.webp` | AudienceSection | Selskapslokale interiør, dekket bord |
| `pilot-hero.webp` | PilotInvitationSection | Kommune-driftsleder ved skjerm, eller idrettshall morgenlys |
| `brukerhistorier-ronning.webp` | BrukerhistorierSection | Rønning Selskapslokale interiør (rights-cleared) |
| `brukerhistorier-nordrefollo.webp` | BrukerhistorierSection | Nordre Follo anlegg/aktivitet (rights-cleared) |

## Sourcing suggestions

- **Free + commercial-OK:** Unsplash, Pexels, Pixabay. Search "norwegian
  municipality", "nordic interior", "scandinavian architecture".
- **Norwegian photographers:** Nordic Stock (nordic-stock.com),
  Mostphotos.no (Scandinavian Stock).
- **AI-generated:** Acceptable for non-customer scenes (audience, pilot,
  blog covers). NOT acceptable for customer story photos — those need
  real photos cleared with the customer.
- **Original:** for Rønning + Nordre Follo, request the customers send
  one rights-cleared photo each.

## Compression workflow

```bash
# Single file
cwebp -q 82 -resize 1600 0 input.jpg -o /public/images/blog/ssa-l-cover.webp

# Batch
for f in *.jpg; do
  cwebp -q 82 -resize 1600 0 "$f" -o "${f%.jpg}.webp"
done
```

Each image should include `<img alt="...">` with a descriptive Norwegian
caption when referenced from a component. See `BlogPreviewSection.tsx`
and `BrukerhistorierSection.tsx` for examples.
