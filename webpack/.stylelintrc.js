/**
 * Stylelint config file
 * as configured in package.json under stylelint.extends
 *
 * @docs Stylelint https://stylelint.io/user-guide/
 * @docs StylelintWebpackPlugin: https://webpack.js.org/plugins/stylelint-webpack-plugin/
 * @docs stylelint-scss : https://github.com/kristerkari/stylelint-scss
 * @since 1.0.0
 */

module.exports = {
    plugins: [
        "stylelint-scss"
    ],
    "rules": {
        "block-no-empty": null,
        "comment-empty-line-before": [
            "always",
            {
                "ignore": ["stylelint-commands", "after-comment"]
            }
        ],
        "max-empty-lines": 2,
        "font-family-no-duplicate-names" : true,
        "selector-type-no-unknown": true,
        "font-family-no-missing-generic-family-keyword": true,
        "declaration-block-no-duplicate-properties": true,
        "no-duplicate-at-import-rules": true,
        "function-calc-no-unspaced-operator" : true,
        "unit-case": "lower",
        "unit-no-unknown": true,
        "no-extra-semicolons": true,
        "no-invalid-position-at-import-rule": true,
        "value-keyword-case": "lower",
        "property-case": "lower",
        "no-empty-first-line": true
    }
}