import { execSync } from "child_process"
import type { Plugin } from "vite"

export function vitePluginCommitHash(): Plugin {
  let commitHash = "unknown"

  try {
    commitHash = execSync("git rev-parse HEAD").toString().trim().slice(0, 7)
  } catch {
    // not in a git repo or git not available
  }

  return {
    name: "vite-plugin-commit-hash",
    config() {
      return {
        define: {
          "import.meta.env.VITE_COMMIT_HASH": JSON.stringify(commitHash),
        },
      }
    },
  }
}
