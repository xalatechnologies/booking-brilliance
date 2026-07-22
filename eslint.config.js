import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Don't lint build output, generated code, stray worktrees, or the legacy
  // host-side tooling/one-off scripts — none of it is the product app, and it
  // was polluting the gate with ~30 non-actionable errors (Astro-generated
  // .d.ts, a leftover .claude worktree copy of the whole tree).
  { ignores: ["dist", "**/.astro/**", ".claude/**", "tools/**", "scripts/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Not enforced historically (main was never lint-gated); keep as warnings so
      // the gate blocks only real bugs. Ratchet these to "error" later.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
);
