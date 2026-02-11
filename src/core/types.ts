/**
 * Core type definitions for ClawCash wallet
 */

/**
 * Supported blockchain networks
 */
export type Chain = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'bitcoin';

/**
 * Supported token symbols
 */
export type TokenSymbol = 'ETH' | 'BTC' | 'MATIC' | 'BNB' | 'USDT' | 'USDC';

/**
 * Wallet configuration options
 */
export interface WalletConfig {
  /** BIP39 mnemonic phrase (if not provided, a new one will be generated) */
  mnemonic?: string;
  /** Password for encrypting private keys */
  password?: string;
  /** Custom RPC endpoints for each chain */
  rpcUrls?: Partial<Record<Chain, string>>;
}

/**
 * Wallet addresses for all supported chains
 */
export interface WalletAddresses {
  ethereum: string;
  polygon: string;
  bsc: string;
  arbitrum: string;
  bitcoin: string;
}

/**
 * Token configuration
 */
export interface TokenConfig {
  symbol: TokenSymbol;
  decimals: number;
  address?: string; // undefined for native tokens
  chainId: number;
}

/**
 * Chain configuration
 */
export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

/**
 * Balance information
 */
export interface Balance {
  amount: bigint;
  formatted: string;
  symbol: TokenSymbol;
  decimals: number;
}

/**
 * Payment/transfer parameters
 */
export interface PaymentParams {
  /** Source chain */
  chain: Chain;
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Amount to send (as decimal string) */
  amount: string;
  /** Token symbol (e.g., 'ETH', 'USDT') */
  token: TokenSymbol;
  /** Optional gas price for EVM chains */
  gasPrice?: string;
  /** Optional gas limit for EVM chains */
  gasLimit?: string;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  /** Transaction hash */
  hash: string;
  /** Block number (if confirmed) */
  blockNumber?: number;
  /** Transaction status */
  status: 'pending' | 'confirmed' | 'failed';
  /** Explorer URL */
  explorerUrl?: string;
}

/**
 * Fee estimate for a transaction
 */
export interface FeeEstimate {
  /** Estimated gas fee in wei */
  gasFee: bigint;
  /** Estimated gas price */
  gasPrice: bigint;
  /** Estimated gas limit */
  gasLimit: bigint;
  /** Total fee formatted */
  formatted: string;
}

/**
 * Transaction history entry
 */
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: bigint;
  formatted: string;
  symbol: TokenSymbol;
  timestamp: number;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

/**
 * Trade configuration (for exchange trading)
 */
export interface TradeConfig {
  /** Exchange name (e.g., 'binance', 'coinbase') */
  exchange: string;
  /** Trading pair (e.g., 'BTC/USDT') */
  symbol: string;
  /** Amount to trade */
  amount: string;
  /** Limit price (undefined for market order) */
  price?: string;
  /** Order type */
  type?: 'market' | 'limit';
}

/**
 * Trade result
 */
export interface TradeResult {
  /** Order ID */
  orderId: string;
  /** Exchange name */
  exchange: string;
  /** Trading pair */
  symbol: string;
  /** Side (buy/sell) */
  side: 'buy' | 'sell';
  /** Amount traded */
  amount: string;
  /** Price */
  price: string;
  /** Order status */
  status: 'open' | 'filled' | 'canceled';
  /** Timestamp */
  timestamp: number;
}

/**
 * Market information
 */
export interface MarketInfo {
  symbol: string;
  bidPrice: string;
  askPrice: string;
  lastPrice: string;
  volume24h: string;
}

/**
 * Agent-friendly error class
 */
export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

/**
 * Result wrapper for agent operations
 */
export interface AgentResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
