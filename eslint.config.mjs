import { defineConfig, globalIgnores } from "eslint/config";

import { configs } from "@nullvoxpopuli/eslint-configs";

export default defineConfig([
  ...configs.node(import.meta.dirname),
  globalIgnores(["node_modules/**", "files/**"]),
  {
    settings: {
      node: {
        // For Dev, we use 22.
        // We still test 18+ in CI
        version: "22",
      },
    },
  },
]);
