import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vitePluginCommitHash } from "./vite-plugin-commit-hash.ts"

// https://vite.dev/config/
export default defineConfig({
  // Served from https://myracodes.github.io/calendor/
  base: "/calendor/",
  plugins: [react(), vitePluginCommitHash()],
})
