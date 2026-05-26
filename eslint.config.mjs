import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: ["build/**", "node_modules/**", "src/build/**", "static/**"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["scripts/demos/**/*.mjs", "vite.demos.config.mjs", "eslint.config.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node, ...globals.browser },
        },
    },
    {
        files: ["src/compiledDemos/**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
        },
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
];
