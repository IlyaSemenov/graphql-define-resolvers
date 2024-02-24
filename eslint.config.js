import config from "@antfu/eslint-config"

export default config(
  {
    stylistic: {
      quotes: "double",
      braceStyle: "1tbs",
    },
    rules: {
      "curly": ["error", "all"],
      "import/order": ["error", {
        "newlines-between": "always",
        "distinctGroup": false,
        "alphabetize": {
          order: "asc",
          orderImportKind: "asc",
        },
      }],
      "test/consistent-test-it": "off",
      "ts/consistent-type-definitions": "off",
    },
  },
)
