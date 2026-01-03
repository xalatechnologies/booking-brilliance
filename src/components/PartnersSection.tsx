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

        {/* Partner Names */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {partners.map((partner, index) => (
            <span
              key={index}
              className="text-muted-foreground text-lg md:text-xl font-medium tracking-wide hover:text-foreground transition-colors cursor-default"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
