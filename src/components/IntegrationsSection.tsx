import { useState } from "react";
import { Building2, Calendar, CreditCard, Users, Layers, CheckCircle, Briefcase, Globe, Mail, Target, Clock, Settings, Zap, Shield } from "lucide-react";

const IntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      name: "Anleggstyper",
      icon: Building2,
      color: "#2F55A4",
      description: "Plattformen støtter 6 distinkte anleggstyper, hver optimalisert for spesifikke bruksområder og booking-modeller.",
      cards: [
        { 
          icon: Building2, 
          title: "Rom & Haller", 
          description: "Idrettshaller, møterom, kultursal",
          model: "Tidsperiode & Tidsluk",
          features: ["Hele/halv hall", "Fleksibel prising", "Kapasitetsstyring"]
        },
        { 
          icon: Layers, 
          title: "Ressurser", 
          description: "Projektor, sportsutstyr, inventar",
          model: "Antallsbasert",
          features: ["Tilgjengelighet", "Inventarstyring", "Flere enheter"]
        },
        { 
          icon: Calendar, 
          title: "Arrangement", 
          description: "Konserter, kurs, workshops",
          model: "Kapasitetsbasert",
          features: ["Deltagerbegrensning", "Billettsystem", "Påmelding"]
        },
        { 
          icon: Target, 
          title: "Kjøretøy & Tjenester", 
          description: "Kommunebiler, båter, vaktmester",
          model: "Heldags & Tidsperiode",
          features: ["Vedlikeholdssporing", "Tilgangskontroll", "Loggføring"]
        },
      ],
    },
    {
      name: "Bookbare Enheter",
      icon: Layers,
      color: "#8b5cf6",
      description: "Listing Standard v1 introduserer Bookable Units - flere bookbare enheter per anlegg med individuelle priser og regler.",
      cards: [
        { 
          icon: Layers, 
          title: "Flere enheter per anlegg", 
          description: "Eksempel: Skien Idrettshall",
          model: "Fleksibel oppsett",
          features: ["Hele hallen - 2000 kr/t", "Halv hall - 1100 kr/t", "Treningsrom - 500 kr/t"]
        },
        { 
          icon: CreditCard, 
          title: "Individuelle priser", 
          description: "Egen prising per bookbar enhet",
          model: "Dynamisk prising",
          features: ["Perioderegler", "Brukergrupperabatt", "Rabattkoder"]
        },
        { 
          icon: Clock, 
          title: "Egne tidsregler", 
          description: "Separate åpningstider og tilgjengelighet",
          model: "Fleksibel styring",
          features: ["Helg/hverdagsregler", "Sesongvariasjoner", "Helligdager"]
        },
        { 
          icon: Settings, 
          title: "Separat kapasitet", 
          description: "Individuelle inventar og begrensninger",
          model: "Kapasitetsstyring",
          features: ["Maks personer", "Utstyrsbegrensninger", "Samtidig bruk"]
        },
      ],
    },
    {
      name: "Brukergrupper",
      icon: Users,
      color: "#8BC34A",
      description: "6 brukergrupper med automatisk rabattberegning og verifisering gjennom BRREG, NIF og ID-porten.",
      cards: [
        { 
          icon: Users, 
          title: "Privatpersoner", 
          description: "Standard brukere uten organisasjonstilknytning",
          model: "0% rabatt",
          features: ["Ingen verifisering", "Standardpris", "Enkelt pålogging"]
        },
        { 
          icon: Shield, 
          title: "Idrettslag", 
          description: "Verifiserte idrettsklubber via NIF",
          model: "30-70% rabatt",
          features: ["NIF-verifisering", "Sesongutleie", "Prioritert tildeling"]
        },
        { 
          icon: Building2, 
          title: "Skoler & Kommune", 
          description: "Offentlige institusjoner",
          model: "100% rabatt",
          features: ["Full rabatt", "Verifisert tilgang", "Ubegrenset bruk"]
        },
        { 
          icon: Briefcase, 
          title: "Næringsliv & Foreninger", 
          description: "Bedrifter og organisasjoner",
          model: "Varierende rabatt",
          features: ["BRREG-verifisering", "Fleksibel prising", "Fakturering"]
        },
      ],
    },
    {
      name: "Godkjenning & Betaling",
      icon: CheckCircle,
      color: "#9EDBE5",
      description: "4 godkjenningsmoduser med regelbasert automatisering og integrert betalingsløsning for Vipps, Klarna og faktura.",
      cards: [
        { 
          icon: Zap, 
          title: "Auto-godkjenning", 
          description: "Umiddelbar bekreftelse for enkle bookinger",
          model: "Regelbasert",
          features: ["Lave verdier", "Korte bookinger", "Verifiserte brukere"]
        },
        { 
          icon: CheckCircle, 
          title: "Manuell godkjenning", 
          description: "Saksbehandler-kontroll for sensitive bookinger",
          model: "Kø-basert",
          features: ["Høye verdier", "Sensitive anlegg", "Spesielle vilkår"]
        },
        { 
          icon: CreditCard, 
          title: "Betalingsintegrasjon", 
          description: "Vipps, Klarna og fakturasystem",
          model: "Automatisk",
          features: ["Mobilbetaling", "Kortbetaling", "ERP-integrasjon"]
        },
        { 
          icon: Settings, 
          title: "Refusjonsregler", 
          description: "Automatisk refusjonsberegning",
          model: "Policy-basert",
          features: [">48t = 100%", "24-48t = 50%", "<24t = 0%"]
        },
      ],
    },
  ];

  const activeFeature = features[activeTab];

  return (
    <section id="funksjonalitet" className="py-16 md:py-24 bg-secondary/30 relative section-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">
            Funksjonalitet
          </h2>
          <p className="section-subheading max-w-3xl mx-auto">
            Bygget på et kraftig listing-konsept som håndterer alle typer bookbare ressurser
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`group relative px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 ${
                activeTab === index
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/40 scale-105"
                  : "bg-card/80 border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:scale-102"
              }`}
            >
              <div className="flex items-center gap-3">
                <feature.icon className="w-5 h-5" />
                {feature.name}
              </div>
            </button>
          ))}
        </div>

        {/* Feature Description */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {activeFeature.description}
          </p>
        </div>

        {/* Cards - 2 per row */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {activeFeature.cards.map((card, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-2 border-border/60 hover:border-primary/70 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2"
              >
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${activeFeature.color}10 0%, transparent 100%)`
                  }}
                />
                
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0"
                    style={{
                      backgroundColor: `${activeFeature.color}15`,
                    }}
                  >
                    <card.icon 
                      className="w-8 h-8" 
                      style={{ color: activeFeature.color }}
                      strokeWidth={2.5}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-xl mb-1 group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h4>
                    <p className="text-sm font-semibold opacity-70" style={{ color: activeFeature.color }}>
                      {card.model}
                    </p>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed mb-5">
                  {card.description}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                  {card.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: activeFeature.color }} />
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Corner accent */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to bottom left, ${activeFeature.color}15, transparent)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Integration Partners */}
        <div className="mt-20 text-center">
          <h3 className="text-lg font-bold text-foreground mb-8">Integrasjoner</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-base font-bold text-foreground">RCO</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-base font-bold text-foreground">Visma</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-base font-bold text-foreground">WebSak</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-base font-bold text-foreground">Outlook</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-orange-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span className="text-base font-bold text-foreground">Vipps</span>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-card border-2 border-border/50 hover:border-pink-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CreditCard className="w-5 h-5 text-pink-500" />
              <span className="text-base font-bold text-foreground">Klarna</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
