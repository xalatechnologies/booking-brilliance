const PartnersSection = () => {
  const partners = [
    { name: "Xala Technologies", logo: "XT" },
    { name: "Billisim", logo: "BI" },
    { name: "CommitCare", logo: "CC" },
    { name: "NorChain", logo: "NC" },
    { name: "TechNordic", logo: "TN" },
    { name: "DigitalFlow", logo: "DF" },
  ];

  // Double the array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section id="partnere" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <span className="text-sm font-medium text-primary mb-4 block">Våre partnere</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Vi samarbeider med ledende teknologipartnere
          </h2>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8"
            >
              <div className="w-48 h-24 rounded-xl card-gradient border border-border/50 flex items-center justify-center gap-3 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {partner.logo}
                </div>
                <span className="text-foreground font-medium">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
