/**
 * Trading module types
 */

export type { TradeConfig, TradeResult, MarketInfo } from '../core/types.js';

/**
 * Exchange configuration
 */
export interface ExchangeConfig {
  name: string;
  apiKey?: string;
  apiSecret?: string;
  passphrase?: string; // For some exchanges like Coinbase Pro
  sandbox?: boolean; // Use testnet/sandbox mode
}

/**
 * Order book data
 */
export interface OrderBook {
  bids: [string, string][]; // [price, amount]
  asks: [string, string][]; // [price, amount]
  timestamp: number;
}

/**
 * Ticker data
 */
export interface Ticker {
  symbol: string;
  bid: string;
  ask: string;
  last: string;
  volume: string;
  change: string;
  percentage: string;
}

/**
 * Order status
 */
export type OrderStatus = 'open' | 'closed' | 'canceled' | 'rejected';
