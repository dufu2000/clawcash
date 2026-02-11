/**
 * Token address registry for multi-chain tokens
 */

import type { Chain, TokenSymbol } from '../core/types.js';

/**
 * Token configuration
 */
export interface TokenInfo {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  address: string;
  chainId: number;
}

/**
 * Token addresses across chains
 */
export const TOKEN_ADDRESSES: Record<string, Partial<Record<Chain, string>>> = {
  // USDT (Tether USD)
  USDT: {
    ethereum: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    polygon: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    bsc: '0x55d398326f99059ff775485246999027b3197955',
    arbitrum: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
  },

  // USDC (USD Coin)
  USDC: {
    ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    polygon: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    bsc: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },

  // WBTC (Wrapped Bitcoin)
  WBTC: {
    ethereum: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    polygon: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    bsc: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    arbitrum: '0x2f2a2543b76a4166869fb4605c78dcdbe30c8b3a',
  },
};

/**
 * Chain IDs
 */
export const CHAIN_IDS: Record<Chain, number> = {
  ethereum: 1,
  polygon: 137,
  bsc: 56,
  arbitrum: 42161,
  bitcoin: 0,
};

/**
 * Get token address for a chain
 */
export function getTokenAddress(token: string, chain: Chain): string | undefined {
  return TOKEN_ADDRESSES[token]?.[chain];
}

/**
 * Check if token exists on chain
 */
export function hasToken(token: string, chain: Chain): boolean {
  return token in TOKEN_ADDRESSES && chain in TOKEN_ADDRESSES[token];
}

/**
 * Get all tokens for a chain
 */
export function getTokensForChain(chain: Chain): string[] {
  return Object.keys(TOKEN_ADDRESSES).filter(
    token => hasToken(token, chain)
  );
}

/**
 * Get all supported tokens
 */
export function getAllSupportedTokens(): string[] {
  return Object.keys(TOKEN_ADDRESSES);
}
