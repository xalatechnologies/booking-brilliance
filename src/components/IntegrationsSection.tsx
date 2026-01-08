import { useState } from "react";
import { Building2, Calendar, CreditCard, Users, Shield, Layers, CheckCircle, Briefcase, Globe, Mail, Smartphone } from "lucide-react";

const IntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      name: "Anleggshåndtering",
      icon: Building2,
      color: "#3b82f6",
      description: "6 anleggstyper optimalisert for ulike bruksområder",
      highlights: [
        { label: "Idrettshaller", sublabel: "Hele/halv hall med fleksibel prising" },
        { label: "Møterom & Kultursal", sublabel: "Romreservasjon med kapasitet" },
        { label: "Utstyr & Ressurser", sublabel: "Inventarstyring med tilgjengelighet" },
        { label: "Kjøretøy & Båter", sublabel: "Heldags-booking med vedlikehold" },
      ],
      stats: [
        { value: "6", label: "Anleggstyper" },
        { value: "6", label: "Booking-modeller" },
      ],
    },
    {
      name: "Bookingmotor",
      icon: Calendar,
      color: "#8b5cf6",
      description: "Intelligent bookingmotor med automatisk godkjenning",
      highlights: [
        { label: "Tidsbasert", sublabel: "Start/slutt med konfliktsjekk" },
        { label: "Slots", sublabel: "Predefinerte tidsluk for faste aktiviteter" },
        { label: "Sesongutleie", sublabel: "Regelbasert tildeling med prioritering" },
        { label: "Antall & Kapasitet", sublabel: "Fleksibel ressursstyring" },
      ],
      stats: [
        { value: "60%", label: "Mindre manuelt arbeid" },
        { value: "24/7", label: "Selvbetjening" },
      ],
    },
    {
      name: "Betaling & Prising",
      icon: CreditCard,
      color: "#22c55e",
      description: "Fleksibel prising med automatisk betalingshåndtering",
      highlights: [
        { label: "Vipps", sublabel: "Rask mobilbetaling" },
        { label: "Rabattsystem", sublabel: "6 brukergrupper med rabatter 0-100%" },
        { label: "Perioderegler", sublabel: "Helg, kveld, helligdager" },
        { label: "Refusjon", sublabel: "Automatisk basert på kanselleringsregler" },
      ],
      stats: [
        { value: "6", label: "Brukergrupper" },
        { value: "100%", label: "Maks rabatt" },
      ],
    },
    {
      name: "Brukerstyring",
      icon: Users,
      color: "#f59e0b",
      description: "Verifisering og tilgangskontroll for alle brukertyper",
      highlights: [
        { label: "ID-porten", sublabel: "BankID/MinID autentisering" },
        { label: "BRREG", sublabel: "Organisasjonsverifisering" },
        { label: "NIF", sublabel: "Idrettslag-verifisering" },
        { label: "RBAC", sublabel: "4 tilgangsnivåer (user/org/tenant/saas)" },
      ],
      stats: [
        { value: "4", label: "Godkjenningsmoduser" },
        { value: "Auto", label: "Regelbasert" },
      ],
    },
  ];

  const activeFeature = features[activeTab];

  return (
    <section id="funksjonalitet" className="py-16 md:py-24 bg-secondary/30 relative section-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">
            Funksjonalitet
          </h2>
          <p className="section-subheading max-w-3xl mx-auto">
            En komplett løsning som digitaliserer og effektiviserer booking av kommunale anlegg og ressurser
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`group relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === index
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "bg-card/80 border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <feature.icon className="w-4 h-4" />
                {feature.name}
              </div>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl transition-transform duration-300 hover:scale-110"
                  style={{
                    backgroundColor: `${activeFeature.color}15`,
                    color: activeFeature.color,
                  }}
                >
                  <activeFeature.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {activeFeature.name}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {activeFeature.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {activeFeature.stats.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      borderColor: `${activeFeature.color}30`,
                      backgroundColor: `${activeFeature.color}05`,
                    }}
                  >
                    <div 
                      className="text-3xl font-extrabold mb-1"
                      style={{ color: activeFeature.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Highlights */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-4">
                {activeFeature.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="group relative p-5 rounded-xl bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${activeFeature.color}15`,
                        }}
                      >
                        <CheckCircle 
                          className="w-5 h-5" 
                          style={{ color: activeFeature.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground mb-1 text-base">
                          {highlight.label}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {highlight.sublabel}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration Partners */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Integrasjoner</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-foreground">RCO</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-foreground">Visma</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-foreground">WebSak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-foreground">Outlook</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-bold text-foreground">Vipps</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CreditCard className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-bold text-foreground">Klarna</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
