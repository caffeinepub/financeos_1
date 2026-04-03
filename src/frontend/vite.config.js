import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import { compression } from "vite-plugin-compression2";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3")) {
            return "vendor-charts";
          }
          if (
            id.includes("node_modules/@dfinity") ||
            id.includes("node_modules/@icp-sdk")
          ) {
            return "vendor-icp";
          }
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul") ||
            id.includes("node_modules/sonner")
          ) {
            return "vendor-ui";
          }
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/three")
          ) {
            return "vendor-3d";
          }
          // App chunks - split heavy pages
          if (id.includes("/pages/DashboardPage")) {
            return "page-dashboard";
          }
          if (id.includes("/pages/PortfolioPage")) {
            return "page-portfolio";
          }
          if (id.includes("/pages/TradeJournalPage")) {
            return "page-tradejournal";
          }
          if (id.includes("/pages/FinancialPlannerPage") || id.includes("/components/financial-planner")) {
            return "page-financial-planner";
          }
          if (id.includes("/pages/FinancialModelPage") || id.includes("/components/financial-model")) {
            return "page-financial-model";
          }
          if (id.includes("/pages/FinancialRulesPage")) {
            return "page-learn-finance";
          }
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
    // Gzip compression
    compression({
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Brotli compression
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
});
