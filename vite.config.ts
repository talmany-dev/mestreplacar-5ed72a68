import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png", "robots.txt"],
      manifest: false, // usamos o manifest.webmanifest em /public
      workbox: {
        // Aumenta o limite para 4MB para cobrir imagens grandes (hero-bg ~2.4MB)
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Cache de assets estáticos (JS, CSS, fontes, imagens)
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
        // Rotas da aplicação: retorna index.html (SPA offline)
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/functions\//, /^\/api\//],
        runtimeCaching: [
          {
            // Cache de bandeiras dos países (CDN externo)
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "flags-cache",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
              },
            },
          },
          {
            // Cache de chamadas ao Supabase (stale-while-revalidate)
            urlPattern: /^https:\/\/swtsbvpmqcnixltcrmra\.supabase\.co\/rest\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "supabase-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5, // 5 minutos
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // desativa SW em dev para não interferir no HMR
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
