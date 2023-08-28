export const VALUE_BET = {
  btc: ['.01', '.05', '.10', '.25', '.50', '1'],
  eth: ['.1', '.25', '.5', '1', '10', '100'],
  sol: ['1', '5', '25', '50', '10', '500'],
};

const MAIN = process.env.MAINNET_NETWORK;
const DEV = process.env.DEVNET_NETWORK;
const TEST = process.env.TESTNET_NETWORK;

const NETWORK = localStorage.getItem('network');
// NETWORK_URL
export const RPC =
  localStorage.getItem('rpc_custom') ||
  localStorage.getItem('rpc') ||
  process.env.MAINNET_NETWORK_URL;

export const RPC_CUSTOM = localStorage.getItem('rpc_custom') || '';

export const MAINNET_NETWORK_URL =
  NETWORK === MAIN
    ? RPC_CUSTOM || process.env.MAINNET_NETWORK_URL
    : process.env.MAINNET_NETWORK_URL;

export const TESTNET_NETWORK_URL =
  NETWORK === TEST
    ? RPC_CUSTOM || process.env.TESTNET_MPG_KEY
    : process.env.TESTNET_MPG_KEY;

export const DEVNET_NETWORK_URL =
  NETWORK === DEV
    ? RPC_CUSTOM || process.env.DEVNET_NETWORK_URL
    : process.env.DEVNET_NETWORK_URL;
