/**
 * This is a main entrypoint for Webpack config.
 *
 * @since 1.0.0
 */
const path = require('path')
// Paths to find our files and provide BrowserSync functionality.
const projectPaths = {
  projectDir: __dirname, // Current project directory absolute path.
  projectJsPath: path.resolve(__dirname, './src'),
  projectOutput: path.resolve(__dirname, './public'),
  projectWebpack: path.resolve(__dirname, 'webpack'),
}

// Files to bundle
const projectFiles = {
  // JS configurations for development and production
  projectJs: {
    eslint: false, // enable or disable eslint  | this is only enabled in development env.
    filename: `[name]${`${Math.random()}`.substring(3, 10)}.js`,
    entry: {
      index: projectPaths.projectJsPath + '/main.jsx',
    },
    rules: {
      test: /\.(js|jsx)$/,
    },
  },
  // Source Maps configurations
  projectSourceMaps: {
    // Sourcemaps are nice for debugging but takes lots of time to compile,
    // so we disable this by default and can be enabled when necessary
    enable: false,
    env: 'dev', // dev | dev-prod | prod
    // ^ Enabled only for development on default, use "prod" to enable only for production
    // or "dev-prod" to enable it for both production and development
    devtool: 'source-map', // type of sourcemap, see more info here: https://webpack.js.org/configuration/devtool/
    // ^ If "source-map" is too slow, then use "cheap-source-map" which struck a good balance between build performance and debuggability.
  },
  // Images configurations for development and production
  projectImages: {
    rules: {
      test: /\.(ttf|eot|svg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    },
    // Optimization settings
    minimizerOptions: {
      // Lossless optimization with custom option
      // Feel free to experiment with options for better result for you
      // More info here: https://webpack.js.org/plugins/image-minimizer-webpack-plugin/
      plugins: [
        [
          'svgo',
          {
            plugins: [{ removeViewBox: false }],
          },
        ],
      ],
    },
  },
}

// Merging the projectFiles & projectPaths objects
const projectOptions = {
  ...projectPaths,
  ...projectFiles,
  projectConfig: {},
}

// Get the development or production setup based
// on the script from package.json
module.exports = (env) => {
  if (env.NODE_ENV === 'production') {
    return require('./webpack/config.production.cjs')(projectOptions)
  } else {
    return require('./webpack/config.development.cjs')(projectOptions)
  }
}
