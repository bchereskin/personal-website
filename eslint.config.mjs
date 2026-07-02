import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-app code that shouldn't be linted as part of the site:
    "backtest/**",
    "mcp-server/**",
    "handoff/**",
    "**/.venv/**",
    "**/node_modules/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
