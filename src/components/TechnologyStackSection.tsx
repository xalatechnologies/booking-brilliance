import { Code2, Database, Server, Layers, Zap, Package, Shield, Cloud } from "lucide-react";

const TechnologyStackSection = () => {
  const technologies = [
    {
      category: "Frontend",
      icon: Code2,
      color: "#3b82f6",
      description: "Moderne brukeropplevelse med React 19 og Server-Side Rendering",
      features: ["SSR/SSG Støtte", "Type-sikker", "Responsivt design"],
      items: [
        { name: "React", version: "19", description: "Komponentbibliotek" },
        { name: "React Router", version: "7", description: "SSR & Ruting" },
        { name: "TypeScript", version: "5.x", description: "Type-sikkerhet" },
        { name: "Tailwind CSS", version: "3.x", description: "Utility-First CSS" },
        { name: "Shadcn/ui", version: "Latest", description: "Komponentsystem" },
      ],
    },
    {
      category: "Backend",
      icon: Server,
      color: "#8b5cf6",
      description: "Høyytende API med Fastify og asynkrone operasjoner",
      features: ["REST API", "WebSocket", "Jobbkø"],
      items: [
        { name: "Fastify", version: "5.x", description: "API Rammeverk" },
        { name: "Node.js", version: "20 LTS", description: "Kjøretidsmiljø" },
        { name: "TypeScript", version: "5.x", description: "Strict Mode" },
        { name: "BullMQ", version: "Latest", description: "Bakgrunnsjobber" },
        { name: "Zod", version: "Latest", description: "Skjemavalidering" },
      ],
    },
    {
      category: "Database",
      icon: Database,
      color: "#06b6d4",
      description: "Skalerbar datalagring med ACID-garantier og hurtigbuffer",
      features: ["ACID Kompatibel", "Hurtigbuffer", "Type-sikker ORM"],
      items: [
        { name: "PostgreSQL", version: "16", description: "Relasjonsdatabase" },
        { name: "Drizzle ORM", version: "0.30.x", description: "Type-sikker ORM" },
        { name: "Redis", version: "7.x", description: "Hurtigbuffer & Sesjoner" },
        { name: "pgvector", version: "Latest", description: "Vektorsøk" },
      ],
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      color: "#22c55e",
      description: "Omfattende sikkerhet og etterlevelse av norske standarder",
      features: ["GDPR Klar", "WCAG 2.1 AA", "Ende-til-ende kryptering"],
      items: [
        { name: "ID-porten", version: "BankID/MinID", description: "Nasjonal autentisering" },
        { name: "GDPR", version: "Kompatibel", description: "Databeskyttelse" },
        { name: "WCAG", version: "2.1 AA", description: "Tilgjengelighet" },
        { name: "TLS", version: "1.3", description: "Ende-til-ende kryptering" },
        { name: "RBAC", version: "Tilpasset", description: "Rollebasert tilgang" },
      ],
    },
  ];

  return (
    <section id="teknologi" className="py-16 md:py-24 bg-background relative section-border overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Teknologi Stack
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Moderne teknologier for pålitelighet, sikkerhet og ytelse
          </p>
        </div>

        {/* Technology Grid - 2 per row, full width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={tech.category}
              className="group relative flex flex-col p-6 rounded-2xl bg-gradient-to-br from-card/70 via-card/60 to-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.01]"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Category Header */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="flex items-center justify-center size-12 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg"
                    style={{ 
                      backgroundColor: `${tech.color}15`,
                      color: tech.color,
                    }}
                  >
                    <tech.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {tech.category}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tech.description}
                </p>
              </div>

              {/* Features Pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tech.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${tech.color}15`,
                      color: tech.color,
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Technology Items - Compact Grid */}
              <div className="grid grid-cols-1 gap-3 flex-1">
                {tech.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {item.version}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative corner */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(to bottom left, ${tech.color}10, transparent)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Stats - Enhanced */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-card/50 to-card/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 mb-3">
                <Code2 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-2">100%</div>
              <div className="text-sm font-bold text-foreground mb-1">TypeScript</div>
              <div className="text-xs text-muted-foreground">Type-sikker kode</div>
            </div>
          </div>
          
          <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-card/50 to-card/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 mb-3">
                <Cloud className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-green-500 mb-2">99.9%</div>
              <div className="text-sm font-bold text-foreground mb-1">Oppetid</div>
              <div className="text-xs text-muted-foreground">SLA Garanti</div>
            </div>
          </div>
          
          <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-card/50 to-card/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 mb-3">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-purple-500 mb-2">&lt;200ms</div>
              <div className="text-sm font-bold text-foreground mb-1">API Response</div>
              <div className="text-xs text-muted-foreground">P95 Latency</div>
            </div>
          </div>
          
          <div className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card/50 to-card/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mb-3">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-500 mb-2">WCAG AA</div>
              <div className="text-sm font-bold text-foreground mb-1">Accessibility</div>
              <div className="text-xs text-muted-foreground">Universell utforming</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyStackSection;
