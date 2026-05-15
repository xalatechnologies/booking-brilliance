// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://docs.digilist.no",
  integrations: [
    starlight({
      title: "Digilist Docs",
      description:
        "Dokumentasjon for Digilist — kommunal booking-SaaS for idrettshaller, møterom, kulturhus og selskapslokaler.",
      // No Starlight `logo` here — the custom Header (src/components/starlight/Header.astro)
      // renders the marketing /logo.svg + Fraunces wordmark directly to
      // match digilist.no's Navbar exactly.
      social: {
        linkedin: "https://www.linkedin.com/company/digilistno",
      },
      editLink: {
        baseUrl:
          "https://github.com/xalatechnologies/booking-brilliance/edit/main/apps/docs/",
      },
      customCss: [
        "./src/styles/digilist-tokens.css",
        "./src/styles/digilist-overrides.css",
      ],
      lastUpdated: true,
      pagination: true,
      components: {
        // Editorial overrides — replace Starlight's stock components with
        // ones styled to match digilist.no. See apps/docs/src/components/starlight/.
        Header: "./src/components/starlight/Header.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        Hero: "./src/components/starlight/Hero.astro",
        Footer: "./src/components/starlight/Footer.astro",
      },
      sidebar: [
        {
          label: "Kom i gang",
          autogenerate: { directory: "kom-i-gang" },
        },
        {
          label: "Admin-runbooks",
          autogenerate: { directory: "admin" },
        },
        {
          label: "API-referanse",
          autogenerate: { directory: "api" },
        },
        {
          label: "Compliance",
          autogenerate: { directory: "compliance" },
        },
      ],
      head: [
        {
          tag: "meta",
          attrs: {
            name: "theme-color",
            content: "#003057",
          },
        },
        // Open Graph + Twitter Card metadata. Starlight emits the title +
        // description per-page, but doesn't ship og:image / og:type by
        // default. These site-level fallbacks make every docs page
        // shareable on LinkedIn/Slack/Twitter without per-page boilerplate.
        {
          tag: "meta",
          attrs: { property: "og:site_name", content: "Digilist Docs" },
        },
        {
          tag: "meta",
          attrs: { property: "og:type", content: "website" },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://digilist.no/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: { property: "og:locale", content: "nb_NO" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary_large_image" },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://digilist.no/og-image.png",
          },
        },
        // JSON-LD Organization structured data — improves AI-search
        // citation density (ChatGPT, Claude, Perplexity) and Google
        // Knowledge Graph eligibility.
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Digilist",
            url: "https://digilist.no/",
            logo: "https://digilist.no/logo.svg",
            description:
              "Bookingplattform for norske kommuner og utleiere — lokaler, møterom, idrettshaller, kulturhus.",
            areaServed: "Norway",
            knowsAbout: [
              "municipal booking",
              "SSA-L compliance",
              "ID-porten integration",
              "EHF invoicing",
            ],
            sameAs: ["https://digilist.no/"],
          }),
        },
        {
          // Force light theme on first visit so docs default matches
          // digilist.no's light-first marketing voice. Users who pick dark
          // via the theme toggle still get dark — we only override the
          // *initial* setting when nothing's been chosen yet.
          tag: "script",
          content:
            'try{if(!localStorage.getItem("starlight-theme")){localStorage.setItem("starlight-theme","light");document.documentElement.dataset.theme="light";}}catch(e){}',
        },
      ],
    }),
  ],
});
