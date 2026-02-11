/**
 * Base exchange adapter interface
 */

import type { ExchangeConfig, OrderBook, Ticker, OrderStatus } from '../types.js';
import type { TradeConfig, TradeResult, MarketInfo } from '../../core/types.js';

/**
 * Abstract base class for exchange adapters
 */
export abstract class BaseExchange {
  protected config: ExchangeConfig;
  protected connected: boolean = false;

  constructor(config: ExchangeConfig) {
    this.config = config;
  }

  /**
   * Connect to the exchange
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the exchange
   */
  abstract disconnect(): void;

  /**
   * Get available markets/trading pairs
   */
  abstract getMarkets(): Promise<string[]>;

  /**
   * Get market info for a symbol
   */
  abstract getMarketInfo(symbol: string): Promise<MarketInfo>;

  /**
   * Get ticker for a symbol
   */
  abstract getTicker(symbol: string): Promise<Ticker>;

  /**
   * Get order book for a symbol
   */
  abstract getOrderBook(symbol: string, limit?: number): Promise<OrderBook>;

  /**
   * Get account balance
   */
  abstract getBalance(): Promise<Record<string, string>>;

  /**
   * Place a buy order
   */
  abstract buy(config: TradeConfig): Promise<TradeResult>;

  /**
   * Place a sell order
   */
  abstract sell(config: TradeConfig): Promise<TradeResult>;

  /**
   * Cancel an order
   */
  abstract cancelOrder(orderId: string, symbol?: string): Promise<boolean>;

  /**
   * Get order status
   */
  abstract getOrderStatus(orderId: string): Promise<OrderStatus>;

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get exchange name
   */
  getName(): string {
    return this.config.name;
  }
}
