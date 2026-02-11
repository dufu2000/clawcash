/**
 * ClawCash - AI Agent Cryptocurrency Wallet
 *
 * A simple, secure, multi-chain wallet library for AI agents.
 */

// Core wallet functionality
export { ClawCashWallet, createWallet, importWallet } from './core/wallet.js';

// Key management
export { KeyManager } from './core/key-manager.js';

// Mnemonic utilities
export {
  generateMnemonic,
  validateMnemonic,
  mnemonicToEntropy,
  entropyToMnemonic,
} from './core/mnemonic.js';

// Types
export type {
  Chain,
  TokenSymbol,
  WalletConfig,
  WalletAddresses,
  TokenConfig,
  ChainConfig,
  Balance,
  PaymentParams,
  TransactionResult,
  FeeEstimate,
  Transaction,
  TradeConfig,
  TradeResult,
  MarketInfo,
  AgentError,
  AgentResult,
} from './core/types.js';

// Chain implementations
export { BaseChain, registerChain, getChain } from './chains/base.js';
export { EthereumChain } from './chains/evm/ethereum.js';
export { BitcoinChain } from './chains/bitcoin/bitcoin.js';

// Trading module
export {
  TradingManager,
  createTradingManager,
} from './trading/trading-manager.js';
export { BaseExchange } from './trading/exchanges/base.js';
export { BinanceExchange } from './trading/exchanges/binance.js';
export type {
  ExchangeConfig,
  OrderBook,
  Ticker,
  OrderStatus,
} from './trading/types.js';

// Balance module
export {
  BalanceManager,
  createBalanceManager,
} from './balance/balance-manager.js';
export type { BalanceSummary } from './balance/balance-manager.js';

// Token registry
export {
  getTokenAddress,
  hasToken,
  getTokensForChain,
  getAllSupportedTokens,
  CHAIN_IDS,
  TOKEN_ADDRESSES,
} from './tokens/registry.js';
export type { TokenInfo } from './tokens/registry.js';

// Public API (agent-friendly)
export {
  createWalletAPI,
  importWalletAPI,
  getBalanceAPI,
  exportMnemonicAPI,
} from './api/wallet-api.js';

export {
  sendPaymentAPI,
  estimateFeesAPI,
  quickSend,
} from './api/payment-api.js';
