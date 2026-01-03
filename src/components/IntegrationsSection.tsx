import { useState } from "react";
import { Calendar, Clock, Repeat, CalendarDays, AlertCircle, Users, CheckCircle, Bell, FileBarChart, Zap, Link, Lock, Globe, Palette, UserCheck } from "lucide-react";

const IntegrationsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: "Booking og planlegging",
      items: [
        { icon: Calendar, name: "Booking av lokaler og ressurser", description: "Enkel booking av rom, utstyr og fasiliteter" },
        { icon: Clock, name: "Kalender og tilgjengelighet", description: "Oversikt over ledige tider og kapasitet" },
        { icon: CalendarDays, name: "Enkeltbooking og gjentakende leie", description: "Fleksibel booking for ulike behov" },
        { icon: Repeat, name: "Sesongleie og faste tider", description: "Håndtering av faste avtaler og sesongbooking" },
        { icon: AlertCircle, name: "Avvik, ferier og endringer", description: "Enkel håndtering av unntak og endringer" },
        { icon: Calendar, name: "Oversikt per lokale og tidsrom", description: "Se tilgjengelighet, bookinger og bruk samlet i én tydelig kalenderoversikt" },
      ],
    },
    {
      name: "Administrasjon og automatisering",
      items: [
        { icon: Users, name: "Roller og tilgang", description: "Styring av brukerrettigheter og tilganger" },
        { icon: CheckCircle, name: "Regelbasert godkjenning", description: "Automatisk godkjenning basert på regler" },
        { icon: Bell, name: "Varsler og frister", description: "Automatiske påminnelser og varsler" },
        { icon: FileBarChart, name: "Rapportering og eksport", description: "Innsikt og dataeksport for analyse" },
        { icon: Zap, name: "Mindre manuelt arbeid", description: "Automatisering av repetitive oppgaver" },
        { icon: FileBarChart, name: "Prisregler og beregning", description: "Automatisk beregning av pris basert på regler, tid og brukergruppe" },
      ],
    },
    {
      name: "Integrasjoner og tilpasning",
      items: [
        { icon: Link, name: "Økonomi- og arkivsystemer", description: "Kobling til Visma, Acos og andre systemer" },
        { icon: Calendar, name: "Kalender- og låssystem", description: "Synkronisering med kalendere og adgangssystemer" },
        { icon: Globe, name: "Nettside-modul / embed", description: "Booking-widget for kommunens nettside" },
        { icon: Palette, name: "Tilpasning av utseende og innhold", description: "Tilpass design og tekster etter behov" },
        { icon: UserCheck, name: "Støtte for ulike brukergrupper", description: "Tilpasset opplevelse for ulike brukere" },
        { icon: Lock, name: "Betaling og innlogging", description: "Integrasjon med Vipps, Bankid, ID-porten, Google, Faktura" },
      ],
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funksjonalitet
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            Støtte for sentrale funksjoner og integrasjoner som sikrer effektiv booking
          </p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs[activeTab].items.map((item, index) => (
            <div
              key={index}
              className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
