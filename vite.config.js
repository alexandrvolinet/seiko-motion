import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      includePublic: true,
      logStats: true,
      ansiColors: false,
      png: { quality: 82, compressionLevel: 9 },
      jpeg: { quality: 82, mozjpeg: true },
      webp: { quality: 82, effort: 6 },
      avif: { quality: 65, effort: 6 },
      svg: {
        multipass: true,
        plugins: [{
          name: "preset-default",
          params: { overrides: { cleanupIds: { minify: false, remove: false } } },
        }],
      },
    }),
  ],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap"],
          three: ["three"],
        },
      },
    },
  },
});
