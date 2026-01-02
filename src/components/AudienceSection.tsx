import { Building2, Theater, Trophy, Briefcase } from "lucide-react";

const AudienceSection = () => {
  const audiences = [
    {
      icon: Building2,
      title: "Kommuner",
    },
    {
      icon: Theater,
      title: "Kulturhus",
    },
    {
      icon: Trophy,
      title: "Idrettslag",
    },
    {
      icon: Briefcase,
      title: "Bedrifter",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            En plattform. Mange bruksområder
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tilpasset kommuner, kulturhus, skoler, idrett og bedrifter
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
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
