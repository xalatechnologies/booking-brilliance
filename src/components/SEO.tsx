import { useEffect } from "react";

interface HowToStep {
  name: string;
  text: string;
}

interface ArticleMeta {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorRole?: string;
  image?: string;
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  /** Use "article" for blog posts/case studies, "website" otherwise */
  ogType?: "website" | "article";
  /** Optional FAQ Q/A array — rendered as FAQPage JSON-LD */
  faq?: Array<{ question: string; answer: string }>;
  /** Optional breadcrumb trail */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Optional HowTo schema — for step-by-step content */
  howTo?: { name: string; description: string; steps: HowToStep[] };
  /** Optional Article schema — for blog posts */
  article?: ArticleMeta;
  /** Optional AboutPage flag — marks this as an about/colophon page */
  aboutPage?: boolean;
  /** Optional Service schema — for service offering pages */
  service?: boolean;
}

const DEFAULT_TITLE = "Digilist — Én plattform for alt som leies ut";
const DEFAULT_DESCRIPTION =
  "Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Sanntidskalender, betaling, sesongleie og fakturering — én digital plattform for det norske utleiemarkedet.";
const DEFAULT_KEYWORDS =
  "booking, utleie, selskapslokale, kulturhus, idrettshall, møterom, kommune, kontorbygg, foreninger, Vipps, BankID, ID-porten, EHF, Peppol, ISO 27001, GDPR, universell utforming, bookingsystem, lokalbooking, ressurstyring, Norge";

const BRAND_KNOWS_ABOUT = [
  "Bookingsystem",
  "Kommunal utleie",
  "Sesongleie",
  "ID-porten",
  "BankID",
  "Vipps",
  "EHF / Peppol-fakturering",
  "ISO 27001",
  "ISO 27701",
  "GDPR",
  "WCAG 2.1",
  "SSA-L 2026",
  "Digdir Designsystemet",
  "Convex reaktiv runtime",
  "PostgreSQL",
];

const BRAND_MENTIONS = [
  { "@type": "Service", name: "Vipps", url: "https://vipps.no" },
  { "@type": "Service", name: "BankID", url: "https://bankid.no" },
  { "@type": "Service", name: "ID-porten", url: "https://www.idporten.no" },
  { "@type": "Service", name: "EHF / Peppol", url: "https://peppol.eu" },
  { "@type": "Organization", name: "Digdir", url: "https://www.digdir.no" },
  {
    "@type": "Organization",
    name: "Brønnøysundregistrene",
    url: "https://www.brreg.no",
  },
];

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical = "https://digilist.no/",
  ogImage = "https://digilist.no/og-image.png",
  ogType = "website",
  faq,
  breadcrumbs,
  howTo,
  article,
  aboutPage,
  service,
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("og:type", ogType, true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", title, true);
    setMeta("og:url", canonical, true);
    setMeta("og:locale", "nb_NO", true);
    setMeta("og:site_name", "Digilist", true);
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", title, true);
    setMeta("twitter:description", description, true);
    setMeta("twitter:image", ogImage, true);
    setMeta("twitter:image:alt", title, true);

    // Canonical
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canonical);

    // Build all JSON-LD blocks
    const blocks: object[] = [];

    // Organization
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://digilist.no/#organization",
      name: "Digilist",
      alternateName: "Digilist — Enkel booking",
      url: "https://digilist.no",
      logo: "https://digilist.no/logo.svg",
      image: "https://digilist.no/og-image.png",
      sameAs: ["https://xala.no"],
      foundingDate: "2024",
      knowsAbout: BRAND_KNOWS_ABOUT,
      mentions: BRAND_MENTIONS,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nesbruveien 75",
        postalCode: "1394",
        addressLocality: "Nesbru",
        addressCountry: "NO",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+47-96-66-50-01",
        contactType: "Customer Service",
        email: "kontakt@digilist.no",
        areaServed: "NO",
        availableLanguage: ["Norwegian", "English"],
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Xala Technologies AS",
        url: "https://xala.no",
      },
    });

    // WebSite + SearchAction (sitelinks search box)
    blocks.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://digilist.no/#website",
      url: "https://digilist.no",
      name: "Digilist",
      description: DEFAULT_DESCRIPTION,
      inLanguage: "nb-NO",
      publisher: { "@id": "https://digilist.no/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://digilist.no/faq?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    });

    // SoftwareApplication
    blocks.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": "https://digilist.no/#software",
      name: "Digilist",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Booking & Reservation Platform",
      operatingSystem: "Web, iOS, iPadOS, Android",
      description: description,
      softwareVersion: "2026.05",
      url: "https://app.digilist.no",
      featureList: [
        "Sanntidskalender",
        "Privatbookinger og sesongleie",
        "Betaling med Vipps og kort",
        "BankID og ID-porten autentisering",
        "EHF / Peppol fakturering",
        "Regnskapsintegrasjoner (Visma, Tripletex, Fiken, PowerOffice, DNB)",
        "Driftsroller og varsler",
        "Digital nøkkel (Salto KS)",
        "Universell utforming (WCAG 2.1 AA)",
        "ISO 27001 og 27701 sertifisert",
        "RCO booking-migrasjon",
        "Audit-spor og RBAC",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "NOK",
        price: "0",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "NOK",
          description:
            "Gratis pilot for norske kommuner. Pristilbud basert på antall anlegg og brukermengde.",
        },
        availability: "https://schema.org/InStock",
      },
      provider: { "@id": "https://digilist.no/#organization" },
      areaServed: { "@type": "Country", name: "Norway" },
      inLanguage: "nb-NO",
    });

    // FAQ
    if (faq && faq.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
            inLanguage: "nb-NO",
          },
        })),
      });
    }

    // BreadcrumbList
    if (breadcrumbs && breadcrumbs.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    // HowTo
    if (howTo) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howTo.name,
        description: howTo.description,
        inLanguage: "nb-NO",
        step: howTo.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      });
    }

    // Article (blog posts)
    if (article) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline,
        description: article.description,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
          "@type": "Person",
          name: article.author,
          ...(article.authorRole ? { jobTitle: article.authorRole } : {}),
        },
        publisher: { "@id": "https://digilist.no/#organization" },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        ...(article.image
          ? {
              image: article.image.startsWith("http")
                ? article.image
                : `https://digilist.no${article.image}`,
            }
          : {}),
        articleSection: article.articleSection,
        keywords: article.keywords,
        ...(article.wordCount ? { wordCount: article.wordCount } : {}),
        inLanguage: "nb-NO",
      });
    }

    // AboutPage
    if (aboutPage) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: canonical,
        name: title,
        description: description,
        mainEntity: { "@id": "https://digilist.no/#organization" },
        inLanguage: "nb-NO",
      });
    }

    // Service
    if (service) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Booking Platform",
        provider: { "@id": "https://digilist.no/#organization" },
        areaServed: { "@type": "Country", name: "Norway" },
        availableLanguage: ["Norwegian", "English"],
        offers: {
          "@type": "Offer",
          priceCurrency: "NOK",
          availability: "https://schema.org/InStock",
        },
        category: "Software / SaaS",
        description: description,
        url: canonical,
      });
    }

    // Remove old ld+json blocks, replace with new
    document
      .querySelectorAll('script[type="application/ld+json"][data-seo="true"]')
      .forEach((el) => el.remove());
    blocks.forEach((block) => {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType,
    faq,
    breadcrumbs,
    howTo,
    article,
    aboutPage,
    service,
  ]);

  return null;
};

export default SEO;
