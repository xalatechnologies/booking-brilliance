import { Calendar, CreditCard, Users, Palette, Check } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Booking og tilgjengelighet",
      items: ["Kalender og ressursplanlegging", "Intern og ekstern booking", "Sesongleie og gjentakende"],
    },
    {
      icon: CreditCard,
      title: "Økonomi og betingelser",
      items: ["Betaling og fakturagrunnlag", "Avbestilling og frister", "Tilleggstjenester"],
    },
    {
      icon: Users,
      title: "Administrasjon og kontroll",
      items: ["Rolle og tilgang", "Rapportering og eksport", "Brønnøysund-verifisering"],
    },
    {
      icon: Palette,
      title: "Tilpasning og kommunikasjon",
      items: ["Tilpasning og branding", "Rediger bookingsiden", "Maler og kommunikasjon"],
    },
  ];

  return (
    <section id="funksjoner" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary mb-4 block">Komplett løsning</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Funksjoner
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Alt du trenger for å administrere bookinger, ressurser og arrangementer
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-gradient rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
