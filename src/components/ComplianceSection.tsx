import { Shield, FileCheck, Headphones, Check } from "lucide-react";

const ComplianceSection = () => {
  const categories = [
    {
      icon: Shield,
      title: "Autentisering",
      subtitle: "ID-porten, SSO, MFA",
    },
    {
      icon: FileCheck,
      title: "Dokumentasjon",
      subtitle: "WCAG, GDPR, DPA",
    },
    {
      icon: Headphones,
      title: "Drift",
      subtitle: "Support, vedlikehold",
    },
  ];

  const authFeatures = [
    "ID-porten (støtte/roadmap)",
    "SSO (Single Sign-On)",
    "MFA (Multi-Factor Authentication)",
    "BankID for innbyggere",
  ];

  return (
    <section id="om-oss" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Klar for anskaffelse i offentlig sektor
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Alle krav dekket for kommuner og kulturhus
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-muted-foreground border-border/50 hover:border-primary/30"
              }`}
            >
              <category.icon className="w-5 h-5" />
              <div>
                <p className="font-semibold">{category.title}</p>
                <p className="text-sm opacity-80">{category.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="card-gradient rounded-2xl p-8 border border-border/50">
            <h3 className="text-xl font-semibold text-foreground mb-6">Autentisering og tilgang</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {authFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
