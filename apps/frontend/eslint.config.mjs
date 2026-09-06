import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// The jsx-a11y plugin is registered in nextVitals' first config object
// (scoped to **/*.{js,jsx,mjs,ts,tsx,mts,cts}). In flat config, plugins
// are only visible to rules in the same object — so the accessibility
// rules must be merged into that object rather than declared in a new one.
const vitals = [...nextVitals];
vitals[0] = {
  ...vitals[0],
  rules: {
    ...(vitals[0].rules ?? {}),
    // Accessibility rules (WCAG 2.1 AA)
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/html-has-lang": "error",
    "jsx-a11y/iframe-has-title": "error",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/media-has-caption": "warn",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/scope": "error",
    "jsx-a11y/tabindex-no-positive": "warn",
  },
};

const eslintConfig = [
  ...vitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // React 19.2 compiler-aware strict rules — scoped off pending the
      // legacy "sync state from props" and ref-during-render refactor.
      // React Compiler is enabled and handles these patterns; revisit
      // when migrating effect-driven state to derived state.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default eslintConfig;
