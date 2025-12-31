import { Shield, Eye, Headphones, Check } from "lucide-react";
import { useState } from "react";

const SecuritySection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: Shield,
      label: "Sikkerhet og personvern",
      items: [
        "ISMS: ISO 27001. Personvernledelse: ISO 27701.",
        "GDPR + norsk personvernlov",
        "Data i EU/EØS",
        "Kryptering i transit (TLS 1.2+) og i hvile",
        "Varsling ved sikkerhetshendelser uten ugrunnet opphold",
        "ROS i samarbeid før produksjon",
        "Logg: hvor, retention, tilgjengeliggjøring",
        "Backup: hyppighet, retention, gjenoppretting",
        "Dataeierskap + uttrekk ved kontraktslutt",
        "Databehandleravtale før behandling starter",
        "Filopplasting: antivirus + tillatte formater",
      ],
    },
    {
      icon: Eye,
      label: "Universell utforming",
      items: [
        "WCAG 2.1 AA-kompatibel",
        "Responsivt design for alle enheter",
        "Skjermleserkompatibilitet",
        "Tastaturnavigasjon",
        "Høy kontrast-støtte",
      ],
    },
    {
      icon: Headphones,
      label: "Drift, opplæring og support",
      items: [
        "24/7 overvåkning av systemer",
        "Automatiske oppdateringer",
        "Opplæringsmateriell og dokumentasjon",
        "Dedikert supportteam",
        "SLA-garantier",
      ],
    },
  ];

  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trygg drift
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sikkerhet, tilgjengelighet og support på høyt nivå
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="card-gradient rounded-2xl p-8 border border-border/50">
            <ul className="grid md:grid-cols-2 gap-4">
              {tabs[activeTab].items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
