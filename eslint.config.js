import typescriptParser from "@typescript-eslint/parser"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"

export default [
  {
    // Ignore build artifacts, node_modules, and scaffold templates
    ignores: ["**/dist/**", "**/node_modules/**", "**/template/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": "off",
      semi: ["error", "never"],
    },
  },
]
