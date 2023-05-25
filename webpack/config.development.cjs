/**
 * webpack's configurations for the development environment
 * based on the script from package.json
 * Run with: "npm run dev" or "npm run dev:watch"
 *
 * @since 1.0.0
 */

const ESLintPlugin    = require( 'eslint-webpack-plugin' );
const path = require("path"); //  Find and fix problems in your JavaScript code

module.exports = ( projectOptions ) => {

    process.env.NODE_ENV = 'development'; // Set environment level to 'development'

    /**
     * The base skeleton
     */
    const Base = require( './config.base.cjs' )( projectOptions );


    /**
     * JS rules
     */
    const jsRules = {
        ...Base.jsRules, ...{
            // add JS rules for development here
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

    /* External Files Rule */

    const externalFilesRules = {
            test: /\.(ttf|eot|woff|woff2|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'webfonts',
                        name: '[name].[ext]',
                        publicPath: './../webfonts',
                        limit: 10000
                    },
                }
            ]
        }


    /**
     * Optimizations rules
     */
    const optimizations = {
        ...Base.optimizations, ...{
            // add optimizations rules for development here
        }
    }

    /**
     * Plugins
     */
    const plugins = [
        ...Base.plugins, ...[
            // add plugins for development here
        ]
    ]
    // Add eslint to plugins if enabled
    if ( projectOptions.projectJs.eslint === true ) {
        plugins.push( new ESLintPlugin() )
    }

    /***
     * Add sourcemap for development if enabled
     */
    const sourceMap = { devtool: false };
    if ( projectOptions.projectSourceMaps.enable === true && (
        projectOptions.projectSourceMaps.env === 'dev' || projectOptions.projectSourceMaps.env === 'dev-prod'
    ) ) {
        sourceMap.devtool = projectOptions.projectSourceMaps.devtool;
    }
    /**
     * The configuration that's being returned to Webpack
     */
    return {
        mode:         'development',
        performance: {
            hints: false,
        },
        externals: {
        },
        entry:        projectOptions.projectJs.entry, // Define the starting point of the application.
        output:       {
            path:     projectOptions.projectOutput,
            filename: projectOptions.projectJs.filename
        },
        devtool:      "source-map",
        optimization: optimizations,
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
        module:       { rules: [ externalFilesRules, jsRules,cssRules,imagesRules,SVGRules], },
        plugins:      plugins,
    }
}
