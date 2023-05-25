/**
 * Eslint config file
 * as configured in package.json under eslintConfig.extends
 *
 * @docs BabelJS: https://babeljs.io/
 * @docs Webpack babel-loader: https://webpack.js.org/loaders/babel-loader/
 * @docs @wordpress/eslint-plugin : https://www.npmjs.com/package/@wordpress/eslint-plugin
 * @since 1.0.0
 */
module.exports = {
    parser:  "@babel/eslint-parser",
    env:     {
        "es6":     true,
        "browser": true,
        "node":    true,
        "jquery":  true,
        "amd":     true
    },
    extends: [ "eslint:recommended"],
    rules:   {},
    globals: {
        "wp":     true,
        "jQuery": true,
    },
    ignorePatterns: [
        "assets/public/**/*.js",
        "temp.js",
        "/vendor/**/**/*.js",
        "/node_modules/**/**/*.js",
        "assets/src/js/gutenbergs/**/*.js",
        "assets/src/js/admin/**/*.js"
    ],
}