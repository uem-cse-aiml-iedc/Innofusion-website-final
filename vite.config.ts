import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy HackNest API requests to bypass CORS during local development
      "/hacknest-api": {
        target: "https://server.uemcseaiml.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/hacknest-api/, "/hacknest"),
        secure: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    // Skip the legacy compatibility CSS transform for browsers we do not target.
    cssTarget: "chrome87",
    rollupOptions: {
      output: {
        /*
         * Split the heavy third-party libraries into long-lived chunks so a
         * change to site code does not invalidate them.
         *
         * The old config also declared a 'vendor-three' chunk, but three.js
         * was only imported by two components that nothing rendered, so the
         * chunk shipped at 0 bytes while the dependency stayed installed.
         * Firebase now gets its own chunk because useViewCounter imports it
         * dynamically.
         */
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-gsap": ["gsap"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    // Inline anything under 4kB as a data URI instead of a separate request.
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "gsap"],
  },
}));
