/**
 * BabelJS config file
 * as configured in package.json under babel.extends
 *
 * @docs Babel Webpack loader: https://webpack.js.org/loaders/babel-loader/
 * @since 1.0.0
 */
module.exports = (api) => {
  return {
    plugins: [
      '@babel/plugin-transform-runtime',
      'transform-class-properties',
      '@emotion',
      'styled-components',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-modules-commonjs',
      [
        'module-resolver',
        {
          root: ['src'],
          alias: {
            '@contexts': '/src/contexts',
            '@pages': '/src/pages',
            '@styles': '/src/styles',
            '@assets': '/src/assets',
            '@components': '/src/components',
            '@hooks': '/src/hooks',
            '@utils': '/src/utils',
          },
        },
      ],
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: '3.1.3',
          useBuiltIns: 'entry',
          // caller.target will be the same as the target option from webpack
          targets: api.caller((caller) => caller && caller.target === 'node')
            ? { node: 'current' }
            : { chrome: '58', ie: '11' },
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  }
}
