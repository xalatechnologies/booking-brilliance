import { useState } from "react";
import { Building2, Target, Award, Users, Rocket, Shield, Cloud, Code2, Brain, CheckCircle } from "lucide-react";

const AboutUsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      name: "Hvem vi er",
      icon: Building2,
      content: {
        highlights: [
          {
            icon: Target,
            title: "Vår visjon",
            text: "Å demokratisere tilgang til innovative teknologiløsninger som skaper reell verdi for norske kommuner og organisasjoner."
          },
          {
            icon: Rocket,
            title: "Vår misjon",
            text: "Levere skalerbare, sikre og brukervennlige digitale løsninger som forenkler hverdagen for både innbyggere og administratorer."
          },
          {
            icon: Award,
            title: "Våre verdier",
            text: "Transparens, innovasjon og kvalitet. Vi kombinerer teknisk ekspertise med forretningsteft for å drive forretningsvekst."
          },
        ],
      },
    },
    {
      name: "Tjenester",
      icon: Code2,
      content: {
        highlights: [
          {
            icon: Brain,
            title: "AI & Maskinlæring",
            text: "Automatiser prosesser og få innsikt fra data med moderne AI-løsninger. Fra dokumentanalyse til prediktiv modellering."
          },
          {
            icon: Cloud,
            title: "Skyløsninger",
            text: "Sikker og skalerbar infrastruktur i skyen med Azure og AWS. Vi håndterer alt fra arkitektur til deployment."
          },
          {
            icon: Code2,
            title: "Webutvikling",
            text: "Moderne nettsider og applikasjoner med React, Next.js og TypeScript. Responsive design og optimal ytelse."
          },
        ],
      },
    },
    {
      name: "Våre spesialiteter",
      icon: Award,
      content: {
        highlights: [
          {
            icon: Rocket,
            title: "Rask levering",
            text: "Vi leverer fungerende løsninger raskt med moderne teknologi og effektive arbeidsmetoder. Agil utvikling sikrer kontinuerlig verdi."
          },
          {
            icon: Cloud,
            title: "Skalerbare løsninger",
            text: "Alle våre løsninger er bygget for å vokse med din bedrift og håndtere fremtidig vekst. Cloud-native arkitektur fra start."
          },
          {
            icon: Users,
            title: "Fullservice",
            text: "Fra idé til ferdig løsning - vi dekker hele prosessen med design, utvikling, testing og deployment. Én partner for alt."
          },
        ],
      },
    },
  ];

  const activeContent = tabs[activeTab].content;

  return (
    <section id="om-oss" className="py-16 md:py-24 bg-background relative section-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">
            Om oss
          </h2>
          <p className="section-subheading max-w-3xl mx-auto">
            Xala Technologies AS - Din partner for innovative teknologiløsninger
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`group relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === index
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "bg-card/80 border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* Highlights - 3 cards per row */}
          <div className="grid md:grid-cols-3 gap-8">
            {activeContent.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-3 hover:scale-[1.02]"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                
                {/* Icon and Title aligned */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl flex-shrink-0"
                  >
                    <highlight.icon className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {highlight.text}
                </p>

                {/* Decorative corner accents */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
