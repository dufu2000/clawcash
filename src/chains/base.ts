/**
 * Base chain interface for all blockchain implementations
 */

import type { Chain, Balance, PaymentParams, FeeEstimate } from '../core/types.js';

/**
 * Abstract base class for all chain implementations
 */
export abstract class BaseChain {
  /** Chain identifier */
  public readonly chainId: string;

  /** Chain name */
  public readonly name: string;

  /** RPC URL */
  protected rpcUrl: string;

  /** Block explorer URL */
  protected explorerUrl: string;

  constructor(
    chainId: string,
    name: string,
    rpcUrl: string,
    explorerUrl: string
  ) {
    this.chainId = chainId;
    this.name = name;
    this.rpcUrl = rpcUrl;
    this.explorerUrl = explorerUrl;
  }

  /**
   * Connect to the chain (establish provider connection)
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the chain
   */
  abstract disconnect(): void;

  /**
   * Get the wallet address for this chain
   */
  abstract getAddress(): string;

  /**
   * Validate an address format for this chain
   * @param address - The address to validate
   */
  abstract validateAddress(address: string): boolean;

  /**
   * Get balance for native or token
   * @param tokenAddress - Optional token address (undefined for native)
   */
  abstract getBalance(tokenAddress?: string): Promise<Balance>;

  /**
   * Estimate transaction fee
   * @param params - Payment parameters
   */
  abstract estimateFee(params: PaymentParams): Promise<FeeEstimate>;

  /**
   * Send a transaction
   * @param params - Payment parameters
   */
  abstract sendTransaction(params: PaymentParams): Promise<string>;

  /**
   * Sign a message
   * @param message - The message to sign
   */
  abstract signMessage(message: string): Promise<string>;

  /**
   * Get block explorer URL for a transaction
   * @param txHash - Transaction hash
   */
  getExplorerUrl(txHash?: string): string {
    if (txHash) {
      return `${this.explorerUrl}/tx/${txHash}`;
    }
    return this.explorerUrl;
  }

  /**
   * Get block explorer URL for an address
   * @param address - Wallet address
   */
  getAddressExplorerUrl(address: string): string {
    return `${this.explorerUrl}/address/${address}`;
  }

  /**
   * Get chain info
   */
  getInfo() {
    return {
      chainId: this.chainId,
      name: this.name,
      rpcUrl: this.rpcUrl,
      explorerUrl: this.explorerUrl,
    };
  }
}

/**
 * Chain factory type
 */
export type ChainFactory = (privateKey: string, rpcUrl?: string) => BaseChain;

/**
 * Registry for chain implementations
 */
export const ChainRegistry: Record<Chain, ChainFactory> = {} as Record<Chain, ChainFactory>;

/**
 * Register a chain implementation
 */
export function registerChain(chain: Chain, factory: ChainFactory): void {
  ChainRegistry[chain] = factory;
}

/**
 * Get a chain instance
 */
export function getChain(chain: Chain, privateKey: string, rpcUrl?: string): BaseChain {
  const factory = ChainRegistry[chain];
  if (!factory) {
    throw new Error(`Chain ${chain} not implemented`);
  }
  return factory(privateKey, rpcUrl);
}
