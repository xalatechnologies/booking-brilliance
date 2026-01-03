import { useState } from "react";
import { 
  Calendar, 
  CreditCard, 
  Users, 
  Palette, 
  Link as LinkIcon,
  Check,
  FileSpreadsheet,
  FileText,
  Ticket,
  Lock,
  Globe
} from "lucide-react";

const FeaturesIntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "booking",
      label: "Booking og tilgjengelighet",
      icon: Calendar,
      items: [
        { title: "Kalender og ressursplanlegging", description: "Visuell oversikt over alle bookinger og ressurser" },
        { title: "Intern og ekstern booking", description: "Separate løsninger for interne og eksterne brukere" },
        { title: "Sesongleie og gjentakende avtaler", description: "Håndtering av faste avtaler og sesongbaserte utleie" },
      ],
    },
    {
      id: "economy",
      label: "Økonomi og betingelser",
      icon: CreditCard,
      items: [
        { title: "Betaling og fakturagrunnlag", description: "Integrert betaling og automatisk fakturering" },
        { title: "Avbestilling og frister", description: "Fleksible regler for avbestilling" },
        { title: "Tilleggstjenester", description: "Mulighet for å legge til ekstra tjenester" },
      ],
    },
    {
      id: "admin",
      label: "Administrasjon og kontroll",
      icon: Users,
      items: [
        { title: "Roller og tilgang", description: "Detaljert tilgangsstyring for ansatte" },
        { title: "Rapportering og eksport", description: "Omfattende rapporter og dataeksport" },
        { title: "Brønnøysund-verifisering", description: "Automatisk verifisering av organisasjoner" },
      ],
    },
    {
      id: "customization",
      label: "Tilpasning og kommunikasjon",
      icon: Palette,
      items: [
        { title: "Tilpasning og branding", description: "Tilpass utseende til din organisasjon" },
        { title: "Redigering av bookingside", description: "Full kontroll over bookingsiden" },
        { title: "Maler og kommunikasjon", description: "Automatiske meldinger og maler" },
      ],
    },
    {
      id: "integrations",
      label: "Integrasjoner",
      icon: LinkIcon,
      integrations: [
        { icon: Calendar, name: "Outlook-kalender", description: "Synkronisering med Outlook" },
        { icon: FileSpreadsheet, name: "Visma", description: "Integrasjon for fakturering" },
        { icon: FileText, name: "Acos Websak", description: "Dokumenthåndtering" },
        { icon: Ticket, name: "Billettsystem", description: "Kobling til billettsystemer" },
        { icon: Lock, name: "Låssystem (RCO)", description: "Automatisk adgangskontroll" },
        { icon: Globe, name: "Nettside-modul", description: "Embed eller widget" },
      ],
    },
  ];

  const activeTabData = tabs[activeTab];

  return (
    <section id="funksjoner" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funksjoner og integrasjoner
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Alt du trenger for å administrere booking, ressurser og samspill med eksisterende systemer
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="card-gradient rounded-2xl p-8 border border-border/50">
            {activeTabData.items ? (
              // Feature cards
              <div className="grid md:grid-cols-3 gap-6">
                {activeTabData.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-secondary/30 rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm pl-8">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : activeTabData.integrations ? (
              // Integration cards
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTabData.integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="bg-secondary/30 rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                        <integration.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{integration.name}</h3>
                        <p className="text-muted-foreground text-sm">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesIntegrationsSection;
