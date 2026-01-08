import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

const SEO = ({
  title = "Digilist - Kommunal Bookingplattform",
  description = "Moderne SaaS-plattform for booking av kommunale anlegg og ressurser i Norge. Håndterer booking, betaling, kalender og rapportering i én plattform.",
  keywords = "booking, kommune, anlegg, idrettshall, møterom, digital booking",
  canonical = "https://digilist.no/",
  ogImage = "https://digilist.no/og-image.png",
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("twitter:title", title, true);
    updateMetaTag("twitter:description", description, true);
    updateMetaTag("twitter:image", ogImage, true);

    // Update canonical
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.setAttribute("rel", "canonical");
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute("href", canonical);

    // Add JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Digilist",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "NOK"
      },
      "operatingSystem": "Web",
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": "Xala Technologies AS",
        "url": "https://xala.no",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Nesbruveien 75",
          "postalCode": "1394",
          "addressLocality": "Nesbru",
          "addressCountry": "NO"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+47-96-66-50-01",
          "contactType": "Customer Service",
          "email": "kontakt@digilist.no",
          "areaServed": "NO",
          "availableLanguage": "Norwegian"
        }
      },
      "areaServed": {
        "@type": "Country",
        "name": "Norway"
      }
    };

    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(structuredData);
  }, [title, description, keywords, canonical, ogImage]);

  return null;
};

export default SEO;
