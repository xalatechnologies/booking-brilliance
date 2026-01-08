import { DiagramViewer } from "./DiagramViewer";
import { DiagramData } from "../types/diagram";

const ArchitectureSection = () => {
  const diagramData: DiagramData = {
    title: "DigiList Platform Architecture",
    nodes: [
      // Layer 0: Frontend Apps
      { id: "webapp", label: "Web App", subLabel: "RR7/RC19", category: "client", layer: 0, icon: "React", color: "#61dafb" },
      { id: "backoffice", label: "Backoffice", subLabel: "RR7", category: "client", layer: 0, icon: "React", color: "#61dafb" },
      { id: "learning", label: "Learning Hub", subLabel: "RR7", category: "client", layer: 0, icon: "React", color: "#61dafb" },
      { id: "docs", label: "Docs", subLabel: "RR7", category: "client", layer: 0, icon: "React", color: "#61dafb" },
      
      // Layer 1: API Server
      { id: "api", label: "API Server", subLabel: "Fastify 5", category: "server", layer: 1, icon: "Fastify", color: "#000000" },
      
      // Layer 2: Backend Services
      { id: "postgres", label: "PostgreSQL", subLabel: "16", category: "database", layer: 2, icon: "PostgreSQL", color: "#336791" },
      { id: "redis", label: "Redis", subLabel: "7.x", category: "storage", layer: 2, icon: "Redis", color: "#D82C20" },
      { id: "worker", label: "Worker", subLabel: "BullMQ", category: "worker", layer: 2, icon: "BullMQ", color: "#f59e0b" },
      { id: "monitoring", label: "Monitoring", subLabel: "Audit Log - RR7", category: "general", layer: 2, icon: "Monitoring", color: "#8b5cf6" },
    ],
    links: [
      // Frontend → API Server
      { source: "webapp", target: "api" },
      { source: "backoffice", target: "api" },
      { source: "learning", target: "api" },
      { source: "docs", target: "api" },
      
      // API Server → Backend
      { source: "api", target: "postgres" },
      { source: "api", target: "redis" },
      { source: "api", target: "worker" },
      { source: "api", target: "monitoring" },
      
      // Worker → Redis
      { source: "worker", target: "redis" },
    ],
  };

  return (
    <section id="arkitektur" className="py-16 md:py-24 bg-secondary/30 relative section-border overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Systemarkitektur
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            En robust og skalerbar plattform bygget med moderne teknologi
          </p>
        </div>

        {/* Interactive Diagram - Desktop Only */}
        <div className="hidden md:block w-full h-[700px] md:h-[800px]">
          <DiagramViewer data={diagramData} />
        </div>

        {/* Mobile - Simple List View */}
        <div className="md:hidden space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Frontend Apps</h3>
            <div className="grid grid-cols-2 gap-3">
              {diagramData.nodes.filter(n => n.layer === 0).map(node => (
                <div key={node.id} className="p-4 rounded-xl bg-card/80 border border-border/50">
                  <div className="font-bold text-foreground mb-1">{node.label}</div>
                  <div className="text-xs text-muted-foreground">{node.subLabel}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground mb-4">API Server</h3>
            <div className="p-4 rounded-xl bg-card/80 border border-primary/50">
              <div className="font-bold text-foreground mb-1">API Server</div>
              <div className="text-xs text-muted-foreground">Fastify 5</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Backend Services</h3>
            <div className="grid grid-cols-2 gap-3">
              {diagramData.nodes.filter(n => n.layer === 2).map(node => (
                <div key={node.id} className="p-4 rounded-xl bg-card/80 border border-border/50">
                  <div className="font-bold text-foreground mb-1">{node.label}</div>
                  <div className="text-xs text-muted-foreground">{node.subLabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base">
            DigiList plattformen består av flere frontend-applikasjoner som kommuniserer med en sentral API-server, 
            som igjen er koblet til PostgreSQL-databasen, Redis cache og BullMQ worker for bakgrunnsjobber.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
