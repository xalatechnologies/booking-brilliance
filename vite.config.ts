import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Local dev: proxy /api/* to the Node API (digilist-api on :3001).
      // In production nginx handles this, so this config only fires under
      // `pnpm dev` / `pnpm dev:client`.
      "/api": {
        target: process.env.VITE_API_TARGET || "http://localhost:3001",
        changeOrigin: false,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Pull big libraries into their own chunks so the marketing
    // homepage's initial JS stays small. Each chunk is HTTP/2-fetched
    // in parallel and admin-only ones only load when /admin/* is hit.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            // These small shared UI atoms + utilities are each pulled in by
            // many different lazy-loaded pages, so Rollup's default
            // splitting shatters them into a dozen ~0.5-3 KB chunks —
            // every one a separate "High"-priority request competing with
            // the actually-critical JS/CSS/fonts on slow connections.
            // Grouping them keeps the byte count the same but cuts the
            // request count.
            if (id.includes("/src/components/editorial/")) return "editorial";
            if (
              id.includes("/src/lib/motion.ts") ||
              id.includes("/src/lib/fonts.ts") ||
              id.includes("/src/lib/utils.ts")
            ) {
              return "shared-lib";
            }
            return;
          }
          // Admin-only / Convex-backed
          if (id.includes("convex/")) return "vendor-convex";
          // Markdown rendering (blog detail page only)
          if (id.includes("react-markdown") || id.includes("remark-")) {
            return "vendor-markdown";
          }
          // Charts / visualization (admin intelligence + transparens)
          if (id.includes("recharts") || id.includes("d3-")) {
            return "vendor-charts";
          }
          // Animation library (heavy, used in hero + transitions)
          if (id.includes("framer-motion")) return "vendor-motion";
          // Radix UI primitives — used everywhere but big enough to split
          if (id.includes("@radix-ui")) return "vendor-radix";
          // Date utilities + react-day-picker (forms only)
          if (id.includes("date-fns") || id.includes("react-day-picker")) {
            return "vendor-date";
          }
          // Icon library (every page uses some, but tree-shakes well)
          if (id.includes("lucide-react")) return "vendor-icons";
          // Everything else from node_modules goes into a shared vendor
          return "vendor";
        },
      },
    },
    // Bump the warning threshold — our largest split is now the
    // vendor chunk (React + ReactDOM + Router) which sits around 180 KB.
    chunkSizeWarningLimit: 600,
  },
}));
