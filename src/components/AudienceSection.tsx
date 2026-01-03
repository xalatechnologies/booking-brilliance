import offentligSektorImg from "@/assets/offentlig-sektor.jpg";
import naeringOrganisasjonerImg from "@/assets/naering-organisasjoner.jpeg";

const AudienceSection = () => {
  const audiences = [
    {
      image: offentligSektorImg,
      title: "Offentlig sektor",
    },
    {
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&h=400&fit=crop",
      title: "Kultur og arrangement",
    },
    {
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&h=400&fit=crop",
      title: "Idrett og aktivitet",
    },
    {
      image: naeringOrganisasjonerImg,
      title: "Næring og organisasjoner",
    },
  ];

  return (
    <section className="py-24 bg-secondary/40 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            En plattform. Mange bruksområder
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Tilpasset kommuner, kulturhus, skoler, idrett og bedrifter
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="group card-gradient rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
