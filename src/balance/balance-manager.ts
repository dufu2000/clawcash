/**
 * Balance manager for tracking balances across chains
 */

import type { ClawCashWallet } from '../core/wallet.js';
import type { Chain, Balance, TokenSymbol } from '../core/types.js';

/**
 * Balance summary across all chains
 */
export interface BalanceSummary {
  chain: Chain;
  address: string;
  balances: Array<{
    symbol: TokenSymbol;
    amount: string;
    formatted: string;
  }>;
  totalValueUsd?: string;
}

/**
 * Balance manager class
 */
export class BalanceManager {
  private wallet: ClawCashWallet;
  private cache: Map<string, { balance: Balance; timestamp: number }> = new Map();
  private cacheTtl: number = 60000; // 1 minute cache

  constructor(wallet: ClawCashWallet) {
    this.wallet = wallet;
  }

  /**
   * Get balance for a specific chain
   * @param chain - The blockchain network
   * @param token - Optional token symbol
   * @param useCache - Whether to use cached balance (default: true)
   */
  async getBalance(chain: Chain, token?: TokenSymbol, useCache: boolean = true): Promise<Balance> {
    const cacheKey = `${chain}-${token || 'native'}`;

    // Check cache
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTtl) {
        return cached.balance;
      }
    }

    // Fetch balance
    const balance = await this.wallet.getBalance(chain, token);

    // Cache the result
    this.cache.set(cacheKey, {
      balance,
      timestamp: Date.now(),
    });

    return balance;
  }

  /**
   * Get balances for all chains
   */
  async getAllBalances(): Promise<BalanceSummary[]> {
    const chains: Chain[] = ['ethereum', 'polygon', 'bsc', 'arbitrum', 'bitcoin'];
    const addresses = await this.wallet.getAddresses();

    const results: BalanceSummary[] = [];

    for (const chain of chains) {
      try {
        const balance = await this.getBalance(chain);

        results.push({
          chain,
          address: addresses[chain],
          balances: [
            {
              symbol: balance.symbol,
              amount: balance.amount.toString(),
              formatted: balance.formatted,
            },
          ],
        });
      } catch (error) {
        // Skip chains that fail
        results.push({
          chain,
          address: addresses[chain],
          balances: [],
        });
      }
    }

    return results;
  }

  /**
   * Get total balance across all chains for a specific token
   */
  async getTotalBalance(token: TokenSymbol): Promise<{
    amount: string;
    formatted: string;
    chains: Array<{ chain: Chain; amount: string }>;
  }> {
    const chains: Chain[] = ['ethereum', 'polygon', 'bsc', 'arbitrum'];
    const chainBalances: Array<{ chain: Chain; amount: string }> = [];

    let totalAmount = 0n;
    let decimals = 18;

    for (const chain of chains) {
      try {
        const balance = await this.getBalance(chain, token);
        if (balance.symbol === token) {
          totalAmount += balance.amount;
          decimals = balance.decimals;
          chainBalances.push({
            chain,
            amount: balance.formatted,
          });
        }
      } catch (error) {
        // Skip failed chains
      }
    }

    // Format total
    const formatted = (Number(totalAmount) / Math.pow(10, decimals)).toFixed(decimals);

    return {
      amount: totalAmount.toString(),
      formatted,
      chains: chainBalances,
    };
  }

  /**
   * Clear the balance cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set cache TTL
   */
  setCacheTtl(milliseconds: number): void {
    this.cacheTtl = milliseconds;
  }
}

/**
 * Create a balance manager
 */
export function createBalanceManager(wallet: ClawCashWallet): BalanceManager {
  return new BalanceManager(wallet);
}
