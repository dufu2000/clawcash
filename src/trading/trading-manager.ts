/**
 * Trading manager for handling exchange operations
 */

import { BaseExchange } from './exchanges/base.js';
import { BinanceExchange } from './exchanges/binance.js';
import type { ExchangeConfig, OrderBook, Ticker } from './types.js';
import type { TradeConfig, TradeResult, MarketInfo } from '../core/types.js';

/**
 * Exchange factory
 */
export type ExchangeFactory = (config: ExchangeConfig) => BaseExchange;

/**
 * Exchange registry
 */
const ExchangeRegistry: Record<string, ExchangeFactory> = {
  binance: (config) => new BinanceExchange(config),
  // More exchanges can be added here
};

/**
 * Trading manager class
 */
export class TradingManager {
  private exchanges: Map<string, BaseExchange> = new Map();

  /**
   * Add an exchange connection
   */
  addExchange(name: string, config: ExchangeConfig): void {
    const factory = ExchangeRegistry[name.toLowerCase()];
    if (!factory) {
      throw new Error(`Exchange ${name} not supported`);
    }

    const exchange = factory({ ...config, name });
    this.exchanges.set(name.toLowerCase(), exchange);
  }

  /**
   * Connect to an exchange
   */
  async connect(name: string): Promise<void> {
    const exchange = this.exchanges.get(name.toLowerCase());
    if (!exchange) {
      throw new Error(`Exchange ${name} not configured`);
    }
    await exchange.connect();
  }

  /**
   * Disconnect from an exchange
   */
  disconnect(name: string): void {
    const exchange = this.exchanges.get(name.toLowerCase());
    if (exchange) {
      exchange.disconnect();
    }
  }

  /**
   * Get available markets from an exchange
   */
  async getMarkets(exchange: string): Promise<string[]> {
    const ex = this.getExchange(exchange);
    return await ex.getMarkets();
  }

  /**
   * Get market info
   */
  async getMarketInfo(exchange: string, symbol: string): Promise<MarketInfo> {
    const ex = this.getExchange(exchange);
    return await ex.getMarketInfo(symbol);
  }

  /**
   * Get ticker
   */
  async getTicker(exchange: string, symbol: string): Promise<Ticker> {
    const ex = this.getExchange(exchange);
    return await ex.getTicker(symbol);
  }

  /**
   * Get order book
   */
  async getOrderBook(exchange: string, symbol: string, limit?: number): Promise<OrderBook> {
    const ex = this.getExchange(exchange);
    return await ex.getOrderBook(symbol, limit);
  }

  /**
   * Get account balance
   */
  async getBalance(exchange: string): Promise<Record<string, string>> {
    const ex = this.getExchange(exchange);
    return await ex.getBalance();
  }

  /**
   * Place a buy order
   */
  async buy(config: TradeConfig): Promise<TradeResult> {
    const ex = this.getExchange(config.exchange);
    return await ex.buy(config);
  }

  /**
   * Place a sell order
   */
  async sell(config: TradeConfig): Promise<TradeResult> {
    const ex = this.getExchange(config.exchange);
    return await ex.sell(config);
  }

  /**
   * Cancel an order
   */
  async cancelOrder(exchange: string, orderId: string, symbol?: string): Promise<boolean> {
    const ex = this.getExchange(exchange);
    return await ex.cancelOrder(orderId, symbol);
  }

  /**
   * Get exchange instance
   */
  private getExchange(name: string): BaseExchange {
    const exchange = this.exchanges.get(name.toLowerCase());
    if (!exchange) {
      throw new Error(`Exchange ${name} not configured. Call addExchange() first.`);
    }
    return exchange;
  }

  /**
   * Check if exchange is connected
   */
  isConnected(exchange: string): boolean {
    const ex = this.exchanges.get(exchange.toLowerCase());
    return ex ? ex.isConnected() : false;
  }
}

/**
 * Create a new trading manager
 */
export function createTradingManager(): TradingManager {
  return new TradingManager();
}
