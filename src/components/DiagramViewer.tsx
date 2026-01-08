import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { DiagramData, NodeCategory } from '../types/diagram';
import { ReactLogo, FastifyLogo, PostgreSQLLogo, BullMQLogo, MonitoringLogo } from './TechLogos';
import { renderToString } from 'react-dom/server';

interface DiagramViewerProps {
  data: DiagramData;
}

const ICON_MAP: Record<string, React.FC> = {
  React: ReactLogo,
  Fastify: FastifyLogo,
  PostgreSQL: PostgreSQLLogo,
  Redis: () => (
    <svg viewBox="0 0 256 220" width="28" height="28">
      <path fill="#D82C20" d="M245.97 168.943c-13.662 7.121-84.434 36.22-99.501 44.075-15.067 7.856-23.437 7.78-35.34 2.09-11.902-5.69-87.216-36.112-100.783-42.597C3.566 169.271 0 166.535 0 163.951v-25.876s98.05-21.345 113.879-27.024c15.828-5.679 21.32-5.884 34.79-.95 13.472 4.936 94.018 19.468 107.331 24.344l-.006 25.51c.002 2.558-3.07 5.364-10.024 8.988"/>
    </svg>
  ),
  BullMQ: BullMQLogo,
  Monitoring: MonitoringLogo,
};

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    updateSize();
    return () => observer.disconnect();
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const { width, height } = dimensions;
    const isDarkMode = theme === 'dark';
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Definitions for gradients
    const defs = svg.append("defs");

    // Beam Gradient
    const beamGradient = defs.append("linearGradient")
      .attr("id", "beam-gradient")
      .attr("gradientUnits", "userSpaceOnUse");
    
    beamGradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1").attr("stop-opacity", 0);
    beamGradient.append("stop").attr("offset", "50%").attr("stop-color", "#6366f1").attr("stop-opacity", 1);
    beamGradient.append("stop").attr("offset", "100%").attr("stop-color", "#6366f1").attr("stop-opacity", 0);

    const g = svg.append("g");

    // Zoom and pan (disable scroll zoom, only allow drag to pan)
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .filter((event) => {
        // Disable zoom on scroll, only allow pan with mouse drag
        return event.type !== 'wheel';
      })
      .on("zoom", (event) => g.attr("transform", event.transform));
    
    svg.call(zoom);

    // Layout Logic (Layered)
    const layers: Record<number, typeof data.nodes> = {};
    data.nodes.forEach(n => {
      if (!layers[n.layer]) layers[n.layer] = [];
      layers[n.layer].push(n);
    });

    const nodePositions: Record<string, { x: number; y: number }> = {};
    const layerCount = Object.keys(layers).length;
    const sortedLayers = Object.keys(layers).map(Number).sort((a, b) => a - b);
    
    const vSpace = Math.max(height, layerCount * 200);
    const layerHeight = vSpace / (layerCount + 1);

    sortedLayers.forEach((layer, idx) => {
      const nodes = layers[layer];
      const nodeCount = nodes.length;
      const hSpace = Math.max(width, nodeCount * 250);
      const nodeWidth = hSpace / (nodeCount + 1);
      
      nodes.forEach((node, nodeIdx) => {
        nodePositions[node.id] = {
          x: nodeWidth * (nodeIdx + 1),
          y: layerHeight * (idx + 1),
        };
      });
    });

    // Get CSS variable values
    const getColorValue = (cssVar: string) => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
      return value.trim();
    };

    // Draw Beams
    const linkGroups = g.selectAll(".link-group")
      .data(data.links)
      .enter()
      .append("g")
      .attr("class", "link-group");

    // Static background path using CSS variables
    const borderColor = getColorValue('--border');
    const borderHsl = `hsl(${borderColor})`;
    
    linkGroups.append("path")
      .attr("d", d => {
        const source = nodePositions[d.source];
        const target = nodePositions[d.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        return `M ${source.x} ${source.y} C ${source.x} ${source.y + dy / 2}, ${target.x} ${target.y - dy / 2}, ${target.x} ${target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", borderHsl)
      .attr("stroke-opacity", "0.2")
      .attr("stroke-width", 2.5);

    // Animated "Beam" path
    linkGroups.append("path")
      .attr("class", "beam-path")
      .attr("d", d => {
        const source = nodePositions[d.source];
        const target = nodePositions[d.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        return `M ${source.x} ${source.y} C ${source.x} ${source.y + dy / 2}, ${target.x} ${target.y - dy / 2}, ${target.x} ${target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", "url(#beam-gradient)")
      .attr("stroke-width", 2.5)
      .each(function() {
        const length = (this as SVGPathElement).getTotalLength();
        const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animate.setAttribute("attributeName", "stroke-dashoffset");
        animate.setAttribute("from", String(length * 2));
        animate.setAttribute("to", "0");
        animate.setAttribute("dur", `${2 + Math.random() * 2}s`);
        animate.setAttribute("repeatCount", "indefinite");
        
        d3.select(this)
          .attr("stroke-dasharray", `${length / 4} ${length * 2}`)
          .node()?.appendChild(animate);
      });

    // Draw Nodes as modern cards
    const nodeGroups = g.selectAll(".node")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${nodePositions[d.id].x}, ${nodePositions[d.id].y})`);

    const boxWidth = 240;
    const boxHeight = 90;

    // Get theme colors from CSS variables
    const cardColor = getColorValue('--card');
    const cardHsl = `hsl(${cardColor})`;
    const foregroundColor = getColorValue('--foreground');
    const foregroundHsl = `hsl(${foregroundColor})`;
    const mutedForegroundColor = getColorValue('--muted-foreground');
    const mutedForegroundHsl = `hsl(${mutedForegroundColor})`;
    const primaryColor = getColorValue('--primary');

    // Node Card Shadow/Glow
    nodeGroups.append("rect")
      .attr("x", -boxWidth / 2 - 3)
      .attr("y", -boxHeight / 2 - 3)
      .attr("width", boxWidth + 6)
      .attr("height", boxHeight + 6)
      .attr("rx", 18)
      .attr("fill", `hsl(${primaryColor} / 0.1)`)
      .style("filter", "blur(10px)");

    // Node Card Body (isDarkMode already defined at top of useEffect)
    nodeGroups.append("rect")
      .attr("x", -boxWidth / 2)
      .attr("y", -boxHeight / 2)
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("rx", 16)
      .attr("class", "diagram-card-bg")
      .attr("fill", isDarkMode ? '#0f172a' : '#f8fafc')
      .attr("stroke", isDarkMode ? '#334155' : '#cbd5e1')
      .attr("stroke-width", 2);

    // Category Indicator (larger box for icon)
    const iconBoxSize = 70;
    nodeGroups.append("rect")
      .attr("x", -boxWidth / 2 + 12)
      .attr("y", -boxHeight / 2 + 10)
      .attr("width", iconBoxSize)
      .attr("height", iconBoxSize)
      .attr("rx", 12)
      .attr("fill", d => {
        if (!d.color) return isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
        const hex = d.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${isDarkMode ? 0.15 : 0.1})`;
      })
      .attr("stroke", d => d.color || '#6366f1')
      .attr("stroke-opacity", isDarkMode ? "0.5" : "0.3")
      .attr("stroke-width", 2);

    // Icon (SVG) - centered in the box
    nodeGroups.each(function(d) {
      if (d.icon && ICON_MAP[d.icon]) {
        const IconComponent = ICON_MAP[d.icon];
        const iconSvg = renderToString(<IconComponent />);
        const iconGroup = d3.select(this).append("g")
          .attr("transform", `translate(${-boxWidth / 2 + 12 + iconBoxSize / 2 - 20}, ${-boxHeight / 2 + 10 + iconBoxSize / 2 - 20})`);
        
        iconGroup.html(iconSvg);
        // Scale up the SVG
        iconGroup.select("svg")
          .attr("width", "40")
          .attr("height", "40");
      }
    });

    // Label - dark text in light mode, light text in dark mode
    nodeGroups.append("text")
      .attr("x", -boxWidth / 2 + 95)
      .attr("y", -boxHeight / 2 + 40)
      .text(d => d.label)
      .attr("fill", isDarkMode ? '#f1f5f9' : '#0f172a')
      .attr("font-weight", "700")
      .attr("font-size", "18px")
      .attr("font-family", "Inter, system-ui, sans-serif");

    // Sublabel - grey in both modes
    nodeGroups.append("text")
      .attr("x", -boxWidth / 2 + 95)
      .attr("y", -boxHeight / 2 + 62)
      .text(d => d.subLabel || d.category.toUpperCase())
      .attr("fill", '#64748b')
      .attr("font-size", "15px")
      .attr("font-family", "Inter, system-ui, sans-serif")
      .attr("font-weight", "500");

    // Initial center - zoom out to show everything
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const scale = 0.9 / Math.max(bounds.width / width, bounds.height / height);
      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-(bounds.x + bounds.width / 2), -(bounds.y + bounds.height / 2));
      
      svg.transition().duration(750).call(zoom.transform, transform);
    }

  }, [data, dimensions, theme]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-slate-50 dark:bg-slate-950 overflow-hidden border-2 border-border/50 rounded-2xl group shadow-2xl">
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Zoom Control Buttons */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <button 
          onClick={() => {
             const svg = d3.select(svgRef.current);
             svg.transition().duration(500).call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.3);
          }}
          className="p-3 bg-card/95 backdrop-blur-md border border-border hover:bg-accent transition-all rounded-lg text-foreground shadow-lg hover:shadow-xl hover:scale-110"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button 
          onClick={() => {
             const svg = d3.select(svgRef.current);
             svg.transition().duration(500).call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 0.77);
          }}
          className="p-3 bg-card/95 backdrop-blur-md border border-border hover:bg-accent transition-all rounded-lg text-foreground shadow-lg hover:shadow-xl hover:scale-110"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
          </svg>
        </button>
      </div>

      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
