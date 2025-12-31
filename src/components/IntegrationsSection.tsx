import { Calendar, FileSpreadsheet, FileText, Ticket, Lock, Globe } from "lucide-react";

const IntegrationsSection = () => {
  const integrations = [
    {
      icon: Calendar,
      name: "Outlook-kalender",
      description: "Synkronisering med Outlook for automatisk kalenderoppdatering",
    },
    {
      icon: FileSpreadsheet,
      name: "Visma",
      description: "Direkte integrasjon eller filoverføring for fakturering",
    },
    {
      icon: FileText,
      name: "Acos Websak",
      description: "Integrasjon med Acos for dokumenthåndtering",
    },
    {
      icon: Ticket,
      name: "Billettsystem",
      description: "Kobling til billettsystemer for arrangementer",
    },
    {
      icon: Lock,
      name: "Låssystem (RCO)",
      description: "Integrasjon med låssystemer for automatisk adgang",
    },
    {
      icon: Globe,
      name: "Nettside-modul",
      description: "Embed eller widget for booking på kommunens nettside",
    },
  ];

  const benefits = [
    "Ingen dobbeltføring",
    "Automatisk dataflyt",
    "Enkelt å sette opp",
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Integrasjoner
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Integrer med de systemene du allerede bruker for en sømløs arbeidsflyt
          </p>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="card-gradient rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <integration.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{integration.name}</h3>
                  <p className="text-muted-foreground text-sm">{integration.description}</p>
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
