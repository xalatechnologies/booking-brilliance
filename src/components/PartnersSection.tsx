const PartnersSection = () => {
  const partners = [
    { name: "Bilisim", logo: "BI" },
    { name: "Xala Technologies", logo: "XT" },
    { name: "Norchain", logo: "NC" },
    { name: "Commit Care", logo: "CC" },
  ];

  return (
    <section id="partnere" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Våre partnere
          </h2>
        </div>

        {/* Static Partner Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="px-8 py-6 rounded-xl card-gradient border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors"
            >
              <span className="text-foreground font-medium text-lg">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
