import { FileText, CheckCircle, Mail, BarChart3 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: FileText,
      title: "Søknad",
      description: "Innbygger eller organisasjon sender søknad via nettsiden.",
    },
    {
      step: 2,
      icon: CheckCircle,
      title: "Godkjenning",
      description: "Administrator godkjenner eller avslår søknaden basert på regler.",
    },
    {
      step: 3,
      icon: Mail,
      title: "Bekreftelse",
      description: "Automatisk bekreftelse sendes med detaljer og betalingsinformasjon.",
    },
    {
      step: 4,
      icon: BarChart3,
      title: "Oppfølging",
      description: "Rapportering, fakturering og oppfølging skjer automatisk.",
    },
  ];

  return (
    <section className="py-24 bg-secondary/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Booking på få steg
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Fire enkle steg fra søknad til oppfølging
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center group">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-primary-foreground bg-primary px-4 py-1.5 rounded-full shadow-md">
                  Steg {item.step}
                </div>
                
                {/* Icon */}
                <div className="relative mx-auto w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all group-hover:scale-110 duration-300 shadow-lg">
                  <item.icon className="w-10 h-10 text-primary" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-foreground/70 font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
