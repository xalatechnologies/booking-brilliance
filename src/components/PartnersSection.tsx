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
              className="w-56 h-24 rounded-xl card-gradient border border-border/50 flex items-center justify-center gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                {partner.logo}
              </div>
              <span className="text-foreground font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
