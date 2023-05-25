/**
 * This holds the configuration that is being used for both development and production.
 * This is being imported and extended in the config.development.cjs and config.production.cjs files
 *
 * @since 1.1.0
 */
const WebpackBar = require('webpackbar') // Display elegant progress bar while building or watch
const CopyPlugin = require('copy-webpack-plugin') // For  we need to copy images from src to public to optimize them
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (projectOptions) => {
  /**
   * JavaScript rules
   */
  const jsRules = {
    test: projectOptions.projectJs.rules.test,
    include: projectOptions.projectJsPath,
    exclude: /(node_modules|bower_components|vendor)/,
    use: 'babel-loader', // Configurations in "webpack/babel.config.js"
  }

  const cssRule = {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader, // instead of style-loader
      'css-loader',
    ],
  }

  const imageRule = {
    test: /\.(png|jpg|gif|webp)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  }

  const SVGRule = {
    test: /\.svg$/,
    use: ['@svgr/webpack', 'url-loader'],
  }

  /**
   * Optimization rules
   */
  const optimizations = {
    minimize: false,
  }

  /**
   * Plugins
   */
  const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new Dotenv(),
    new WebpackBar(), // Adds loading bar during builds
    // Uncomment this to enable profiler https://github.com/nuxt-contrib/webpackbar#options
    // { reporters: [ 'profile' ], profile: true }
    new webpack.ProvidePlugin({
      // Make a global `process` variable that points to the `process` package,
      // because the `util` package expects there to be a global variable named `process`.
      // Thanks to https://stackoverflow.com/a/65018686/14239942
      process: 'process/browser',
    }),
    new CopyPlugin({
      // Copies images from src to public
      patterns: [
        {
          from: projectOptions.projectJsPath + '/assets/favicon.svg',
          to: projectOptions.projectOutput,
        },
        // { from: projectOptions.projectJsPath + '/tooltip.js', to: projectOptions.projectOutput }
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Open HXRO',
      // Load a custom template (lodash by default)
      template: 'index.html',
    }),
  ]

  return {
    jsRules: jsRules,
    optimizations: optimizations,
    plugins: plugins,
    cssRule: cssRule,
    imageRule: imageRule,
    SVGRule: SVGRule,
  }
}
