/**
 * Webpack configurations for the production environment
 * based on the script from package.json
 * Run with: "npm run prod" or or "npm run prod:watch"
 *
 * @since 1.0.0
 */
const path = require("path");
module.exports = ( projectOptions ) => {

    process.env.NODE_ENV = 'production';  // Set environment level to 'production'

    /**
     * The base skeleton
     */
    const Base = require( './config.base.cjs' )( projectOptions );


    /**
     * JS rules
     */
    const jsRules = {
        ...Base.jsRules, ...{
            // add JS rules for production here
        }
    };


    /**
     * CSS rules
     */
    const cssRules = {
        ...Base.cssRule, ...{
            // add JS rules for development here
        }
    };


    /**
     * CSS rules
     */
    const SVGRules = {
        ...Base.SVGRule, ...{
            // add JS rules for development here
        }
    };


    /**
     * CSS rules
     */
    const imagesRules = {
        ...Base.imageRule, ...{
            // add JS rules for development here
        }
    };


    /**
     * Optimizations rules
     */
    const optimizations = {
        ...Base.optimizations, ...{
            splitChunks: {
                cacheGroups: {
                    reactVendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                        name: 'vendor-react',
                        chunks: 'all',
                    },
                    corejsVendor: {
                        test: /[\\/]node_modules[\\/](core-js)[\\/]/,
                        name: 'vendor-corejs',
                        chunks: 'all',
                    },
                }
            },
        }
    }

    /**
     * Plugins
     */
    const plugins = [
        ...Base.plugins, ...[
            // add plugins for production here
        ]
    ]

    /**
     * Add sourcemap for production if enabled
     */
    const sourceMap = { devtool: false };
    if ( projectOptions.projectSourceMaps.enable === true && (
        projectOptions.projectSourceMaps.env === 'prod' || projectOptions.projectSourceMaps.env === 'dev-prod'
    ) ) {
        sourceMap.devtool = projectOptions.projectSourceMaps.devtool;
    }

    /**
     * The configuration that's being returned to Webpack
     */
    return {
        mode:         'production',
        performance: {
            hints: false,
        },
        externals: {
        },
        entry:        projectOptions.projectJs.entry, // Define the starting point of the application.
        output:       {
            path:     projectOptions.projectOutput,
            chunkFilename: '[name].bundle.js',
            filename: projectOptions.projectJs.filename
        },
        devtool:      sourceMap.devtool,
        experiments: {
            topLevelAwait: true
        },
        devServer: {
            static: './public',
        },
        resolve: {
            extensions: ['.jsx', '.js'],
            alias: {
                '@contexts': path.resolve(__dirname, './src/contexts'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@assets': path.resolve(__dirname, './src/assets'),
                '@components': path.resolve(__dirname, './src/components'),
                '@hooks': path.resolve(__dirname, './src/hooks'),
                '@utils': path.resolve(__dirname, './src/utils'),
            },
            fallback: {
                // 👇️👇️👇️ add this 👇️👇️👇️
                "assert": require.resolve("assert"),
            }
        },
        optimization: optimizations,
        module:       { rules: [ jsRules,cssRules,SVGRules,imagesRules ], },
        plugins:      plugins,
    }
}
