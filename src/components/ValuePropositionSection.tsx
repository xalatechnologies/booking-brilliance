import { Layers, Users, Zap, TrendingUp } from "lucide-react";

const ValuePropositionSection = () => {
  const values = [
    {
      icon: Layers,
      title: "Alt på ett sted",
      description: "Bestilling, kalender, priser, vilkår og administrasjon samlet i én plattform.",
      gradient: "from-blue-500/30 via-cyan-500/20 to-blue-600/30",
      iconGradient: "from-blue-500 to-cyan-500",
      glowColor: "blue",
    },
    {
      icon: Users,
      title: "Enkel for brukere",
      description: "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring.",
      gradient: "from-green-500/30 via-emerald-500/20 to-green-600/30",
      iconGradient: "from-green-500 to-emerald-500",
      glowColor: "green",
    },
    {
      icon: Zap,
      title: "Effektiv for administrasjon",
      description: "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid.",
      gradient: "from-purple-500/30 via-pink-500/20 to-purple-600/30",
      iconGradient: "from-purple-500 to-pink-500",
      glowColor: "purple",
    },
    {
      icon: TrendingUp,
      title: "Skalerbar løsning",
      description: "Tilpasset ulike typer lokaler, målgrupper og regelverk. Klar for vekst.",
      gradient: "from-orange-500/30 via-amber-500/20 to-orange-600/30",
      iconGradient: "from-orange-500 to-amber-500",
      glowColor: "orange",
    },
  ];

  return (
    <section id="verdi" className="py-16 md:py-24 bg-background relative section-border overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Hvorfor velge DigiList?
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            En komplett løsning som forenkler booking og administrasjon for både brukere og administratorer
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border-2 border-border/50 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-3 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-20`} />
              
              {/* Icon and Title aligned horizontally */}
              <div className="flex items-center gap-4 mb-6 w-full">
                {/* Icon Container */}
                <div className="relative w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/30 flex-shrink-0">
                {/* Animated background glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.iconGradient} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`} />
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                  {/* Icon */}
                  <value.icon className="w-8 h-8 md:w-9 md:h-9 text-primary group-hover:scale-110 transition-transform duration-500 relative z-10" strokeWidth={2} />
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-all duration-300 flex-1 text-left">
                  {value.title}
                </h3>
              </div>
              
              {/* Description with better readability */}
              <p className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-xs font-medium group-hover:text-foreground/90 transition-colors duration-300">
                {value.description}
              </p>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
