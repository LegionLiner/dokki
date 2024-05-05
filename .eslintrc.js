/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "no-underscore-dangle": 0,
    indent: ["error", 2],
    quotes: [
      2,
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],
  },
};
