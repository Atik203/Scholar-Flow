import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "prefer-const": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='$queryRawUnsafe']",
          message:
            "Use prisma.$queryRaw with parameters (tagged template or placeholders).",
        },
        {
          selector: "CallExpression[callee.property.name='$executeRawUnsafe']",
          message:
            "Use prisma.$executeRaw with parameters (tagged template or placeholders).",
        },
      ],
    },
  },
  {
    ignores: ["dist/**", "src/generated/**"],
  },
];
