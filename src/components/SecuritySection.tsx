import { Shield, Eye, Headphones, Check } from "lucide-react";
import { useState } from "react";

const SecuritySection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
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
    {
      icon: Shield,
      label: "Sikkerhet og personvern",
      items: [
        "ISMS: ISO 27001. Personvernledelse: ISO 27701.",
        "GDPR + norsk personvernlov",
        "Data i EU/EØS",
        "Kryptering i transit (TLS 1.2+) og i hvile",
        "Databehandleravtale før behandling starter",
      ],
    },
  ];

  return (
    <section className="py-24 bg-secondary/40 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">
            Trygg drift
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
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
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground shadow-lg glow-effect"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/10"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="card-gradient rounded-2xl p-8 border border-border shadow-lg">
            <ul className="grid md:grid-cols-2 gap-4">
              {tabs[activeTab].items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{item}</span>
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
