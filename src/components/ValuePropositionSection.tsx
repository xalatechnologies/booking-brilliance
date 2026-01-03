import { Layers, Users, Zap, TrendingUp } from "lucide-react";

const ValuePropositionSection = () => {
  const values = [
    {
      icon: Layers,
      title: "Alt på ett sted",
      description: "Bestilling, kalender, priser, vilkår og administrasjon samlet i én plattform.",
    },
    {
      icon: Users,
      title: "Enkel for brukere",
      description: "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring.",
    },
    {
      icon: Zap,
      title: "Effektiv for administrasjon",
      description: "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid.",
    },
    {
      icon: TrendingUp,
      title: "Skalerbar løsning",
      description: "Tilpasset ulike typer lokaler, målgrupper og regelverk. Klar for vekst.",
    },
  ];

  return (
    <section className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <value.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
