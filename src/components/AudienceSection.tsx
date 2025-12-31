import { Building2, Theater, Trophy, Briefcase, ArrowRight } from "lucide-react";

const AudienceSection = () => {
  const audiences = [
    {
      icon: Building2,
      title: "Kommune",
      description: "Automatiser utleie av kommunale lokaler med full kontroll og rapportering.",
    },
    {
      icon: Theater,
      title: "Kulturhus",
      description: "Administrer saler, scener og arrangementer med booking og betaling.",
    },
    {
      icon: Trophy,
      title: "Idrett/Skole",
      description: "Enkel booking av idrettsanlegg, klasserom og møterom.",
    },
    {
      icon: Briefcase,
      title: "Bedrift",
      description: "Profesjonell løsning for bedriftslokaler og konferanserom.",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary mb-4 block">For alle</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hvem passer det for
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En løsning som fungerer for alle typer organisasjoner
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="group card-gradient rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground mb-6">{item.description}</p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all"
              >
                Les mer
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
