import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import playwrightPlugin from "eslint-plugin-playwright";

export default [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/cdk.out/**",
      "**/.cdk/**",
      "**/coverage/**",
    ],
  },
  // Base configuration for all files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          modules: true,
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-const-assign": "error",
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": "error",
      "no-empty": "error",
      "no-extra-semi": "error",
    },
  },
  // Allow console in CLI, deployment, and tests
  {
    files: ["tests/**/*", "cli/**", "deployment/**"],
    rules: {
      "no-console": "off",
    },
  },
  // Jest configuration
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/testing/**"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
    settings: {
      jest: {
        version: 29,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
  // Allow exports in test utility files
  {
    files: ["**/commonTests.tsx"],
    rules: {
      "jest/no-export": "off",
    },
  },
  // Playwright configuration
  {
    files: ["tests/playwright/**"],
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      ...playwrightPlugin.configs.recommended.rules,
      "playwright/expect-expect": [
        "warn",
        {
          assertFunctionNames: [
            "expect",
            "assertReportIsCreated",
            "assertBannerIsPopulated",
          ],
        },
      ],
    },
  },
];
