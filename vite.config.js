import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    jsxInject: `import React from 'react'`,
    resolve: {
      alias: [
        { find: '@assets', replacement: '/src/assets' },
        { find: '@components', replacement: '/src/components' },
        { find: '@pages', replacement: '/src/pages' },
        { find: '@styles', replacement: '/src/styles' },
        { find: '@contexts', replacement: '/src/contexts' },
        { find: '@hooks', replacement: '/src/hooks' },
        { find: '@utils', replacement: '/src/utils' },
      ],
    },
    define: {
      // Some libraries use the global object, even though it doesn't exist in the browser.
      // Alternatively, we could add `<script>window.global = window;</script>` to index.html.
      // https://github.com/vitejs/vite/discussions/5912
      global: 'window',
      'process.env': process.env,
      // Mainnet
      'import.meta.env.MAINNET_NETWORK': JSON.stringify(env.MAINNET_NETWORK),
      'import.meta.env.MAINNET_NETWORK_URL': JSON.stringify(
        env.MAINNET_NETWORK_URL
      ),
      'import.meta.env.MAINNET_MPG_NAME': JSON.stringify(env.MAINNET_MPG_NAME),
      'import.meta.env.MAINNET_MPG_KEY': JSON.stringify(env.MAINNET_MPG_KEY),
      'import.meta.env.MAINNET_PRODUCT_NAME': JSON.stringify(
        env.MAINNET_PRODUCT_NAME
      ),
      // Devnet
      'import.meta.env.DEVNET_NETWORK': JSON.stringify(env.DEVNET_NETWORK),
      'import.meta.env.DEVNET_NETWORK_URL': JSON.stringify(
        env.DEVNET_NETWORK_URL
      ),
      'import.meta.env.DEVNET_MPG_KEY': JSON.stringify(env.DEVNET_MPG_KEY),
      // Testnet
      'import.meta.env.TESTNET_NETWORK': JSON.stringify(env.TESTNET_NETWORK),
      'import.meta.env.TESTNET_NETWORK_URL': JSON.stringify(
        env.TESTNET_NETWORK_URL
      ),
      'import.meta.env.TESTNET_MPG_KEY': JSON.stringify(env.TESTNET_MPG_KEY),
      // API
      'import.meta.env.API_URL': JSON.stringify(env.API_URL),
      'import.meta.env.URL_SOLANA': JSON.stringify(env.URL_SOLANA),
      // TOKEN
      'import.meta.env.USDC_TOKEN_MINT': JSON.stringify(env.USDC_TOKEN_MINT),
      'import.meta.env.TOKEN_PROGRAM_ID': JSON.stringify(env.TOKEN_PROGRAM_ID),
    },
  };
});
