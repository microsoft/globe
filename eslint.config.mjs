import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import licenseHeader from "eslint-plugin-license-header";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("prettier"), {
    plugins: {
        import: fixupPluginRules(_import),
        'license-header': licenseHeader
    },
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",
    },
    rules: {
        "brace-style": ["error", "1tbs"],
        curly: "error",
        "eol-last": "error",
        eqeqeq: ["error", "smart"],
        "guard-for-in": "error",
        "id-denylist": "off",
        "id-match": "off",
        "license-header/header": [
            "error",
            [
                "/*!",
                " * Copyright (c) Microsoft Corporation. All rights reserved.",
                " * Licensed under the MIT License.",
                " */",
            ]
        ],
        "import/order": ["error", {
            alphabetize: {
                caseInsensitive: true,
                order: "asc",
            },

            "newlines-between": "ignore",

            groups: [
                ["builtin", "external", "internal", "unknown", "object", "type"],
                "parent",
                ["sibling", "index"],
            ],

            distinctGroup: false,
            pathGroupsExcludedImportTypes: [],

            pathGroups: [{
                pattern: "./",

                patternOptions: {
                    nocomment: true,
                    dot: true,
                },

                group: "sibling",
                position: "before",
            }, {
                pattern: ".",

                patternOptions: {
                    nocomment: true,
                    dot: true,
                },

                group: "sibling",
                position: "before",
            }, {
                pattern: "..",

                patternOptions: {
                    nocomment: true,
                    dot: true,
                },

                group: "parent",
                position: "before",
            }, {
                pattern: "../",

                patternOptions: {
                    nocomment: true,
                    dot: true,
                },

                group: "parent",
                position: "before",
            }],
        }],

        indent: "off",

        "max-len": ["error", {
            code: 140,
        }],

        "no-bitwise": "off",
        "no-caller": "error",

        "no-console": ["error", {
            allow: [
                "log",
                "warn",
                "dir",
                "timeLog",
                "assert",
                "clear",
                "count",
                "countReset",
                "group",
                "groupEnd",
                "table",
                "dirxml",
                "error",
                "groupCollapsed",
                "Console",
                "profile",
                "profileEnd",
                "timeStamp",
                "context",
                "createTask",
            ],
        }],

        "no-debugger": "error",
        "no-empty": "error",
        "no-empty-function": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-trailing-spaces": "off",
        "no-underscore-dangle": "off",
        "no-unused-expressions": "off",
        "no-unused-labels": "error",
        quotes: "off",
        radix: "error",
        semi: "off",
    },
}];